import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './application.entity';
import { CreateApplicationDto } from './dto/create-application.request.dto';
import { PandaDocWebhookDto } from './dto/pandadoc-webhook.dto';
import { AppStatus, ExperienceType, InterestArea, School } from './types';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async findAll(): Promise<Application[]> {
    return await this.applicationRepository.find();
  }

  async findById(appId: number): Promise<Application> {
    const application: Application = await this.applicationRepository.findOne({
      where: { appId },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${appId} not found`);
    }

    return application;
  }

  async create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    const application = this.applicationRepository.create(createApplicationDto);
    return await this.applicationRepository.save(application);
  }

  async handlePandaDocWebhook(
    webhookData: PandaDocWebhookDto,
  ): Promise<Application> {
    this.logger.log(
      `Received PandaDoc webhook event: ${webhookData.event} for document ${webhookData.data.id}`,
    );
    this.logger.debug(`Webhook payload: ${JSON.stringify(webhookData)}`);

    // Only process completed document events
    if (
      webhookData.event !== 'document_completed' &&
      webhookData.event !== 'recipient_completed'
    ) {
      this.logger.log(`Ignoring webhook event of type: ${webhookData.event}`);
      throw new Error(`Event type ${webhookData.event} is not processed`);
    }

    // Extract applicant data from webhook fields
    const applicationData = this.mapPandaDocToApplication(webhookData);

    this.logger.log(
      `Creating application for: ${applicationData.name} (${applicationData.email})`,
    );

    // Create and save the application
    const application = this.applicationRepository.create(applicationData);
    const savedApplication = await this.applicationRepository.save(application);

    this.logger.log(
      `Successfully created application with ID: ${savedApplication.appId}`,
    );

    return savedApplication;
  }

  private mapPandaDocToApplication(
    webhookData: PandaDocWebhookDto,
  ): CreateApplicationDto {
    const fields = webhookData.data.fields || [];
    const recipients = webhookData.data.recipients || [];

    // Helper function to find field value by name
    const getFieldValue = (fieldName: string): string => {
      const field = fields.find(
        (f) => f.name === fieldName || f.title === fieldName,
      );
      return (field?.value as string) || '';
    };

    // Extract email from recipients (typically the first recipient is the applicant)
    const email =
      recipients[0]?.email || getFieldValue('email') || getFieldValue('Email');

    // Extract name from recipients or fields
    const firstName =
      recipients[0]?.first_name ||
      getFieldValue('first_name') ||
      getFieldValue('First Name');
    const lastName =
      recipients[0]?.last_name ||
      getFieldValue('last_name') ||
      getFieldValue('Last Name');
    const fullName =
      getFieldValue('name') ||
      getFieldValue('Name') ||
      getFieldValue('Full Name');
    const name = fullName || `${firstName} ${lastName}`.trim();

    // Map other fields - these field names should match what PandaDoc sends
    // Supports snake_case, Title Case, and camelCase variations
    return {
      name,
      email,
      disciplineId: this.parseDisciplineId(
        getFieldValue('discipline') || getFieldValue('Discipline'),
      ),
      appStatus: AppStatus.APP_SUBMITTED,
      daysAvailable:
        getFieldValue('days_available') ||
        getFieldValue('Days Available') ||
        getFieldValue('daysAvailable') ||
        '',
      experienceType: this.parseEnumValue(
        getFieldValue('experience_type') ||
          getFieldValue('Experience Type') ||
          getFieldValue('experienceType'),
      ) as ExperienceType,
      fileUploads: this.parseFileUploads(
        getFieldValue('file_uploads') ||
          getFieldValue('File Uploads') ||
          getFieldValue('fileUploads'),
      ),
      interest: this.parseEnumValue(
        getFieldValue('interest') ||
          getFieldValue('Interest Area') ||
          getFieldValue('Interest') ||
          getFieldValue('interestArea'),
      ) as InterestArea,
      license: getFieldValue('license') || getFieldValue('License') || '',
      isInternational: this.parseBoolean(
        getFieldValue('is_international') ||
          getFieldValue('International') ||
          getFieldValue('isInternational'),
      ),
      isLearner: this.parseBoolean(
        getFieldValue('is_learner') ||
          getFieldValue('Learner') ||
          getFieldValue('isLearner'),
      ),
      phone: getFieldValue('phone') || getFieldValue('Phone') || '',
      school: this.parseEnumValue(
        getFieldValue('school') || getFieldValue('School'),
      ) as School,
      referred: this.parseBoolean(
        getFieldValue('referred') || getFieldValue('Referred'),
      ),
      referredEmail:
        getFieldValue('referred_email') ||
        getFieldValue('Referred Email') ||
        getFieldValue('referredEmail'),
      weeklyHours: parseInt(
        getFieldValue('weekly_hours') ||
          getFieldValue('Weekly Hours') ||
          getFieldValue('weeklyHours') ||
          '0',
        10,
      ),
    };
  }

  private parseDisciplineId(value: string): number | undefined {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? undefined : parsed;
  }

  private parseBoolean(value: string): boolean {
    if (!value) return false;
    const lowerValue = value.toLowerCase();
    return lowerValue === 'true' || lowerValue === 'yes' || lowerValue === '1';
  }

  private parseEnumValue(value: string): string | undefined {
    return value || undefined;
  }

  private parseFileUploads(value: string): string[] {
    if (!value) return [];
    try {
      return JSON.parse(value);
    } catch {
      return value
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);
    }
  }
}
