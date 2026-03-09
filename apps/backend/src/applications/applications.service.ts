import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './application.entity';
import { CreateApplicationDto } from './dto/create-application.request.dto';
import { PHONE_REGEX } from './types';
import { DISCIPLINE_VALUES } from '../disciplines/disciplines.constants';

/**
 * Service for applications that interfaces with the application repository.
 */
@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  /**
   * Validates the fields of a CreateApplicationDto.
   * @param dto The DTO to validate.
   * @throws {BadRequestException} if any field fails validation.
   */
  private validateApplicationDto(dto: CreateApplicationDto): void {
    // Validate phone number format
    if (!PHONE_REGEX.test(dto.phone)) {
      throw new BadRequestException(
        'Phone number must be in ###-###-#### format',
      );
    }

    // Validate weeklyHours is positive
    if (dto.weeklyHours <= 0 || dto.weeklyHours > 7 * 24) {
      throw new BadRequestException(
        'Weekly hours must be greater than 0 and less than 7 * 24 hours',
      );
    }
  }

  /**
   * Returns all applications in the repository.
   * @returns A promise resolving to all applications in the repository.
   * @throws {Error} which is unchanged from what repository throws.
   */
  async findAll(): Promise<Application[]> {
    return await this.applicationRepository.find();
  }

  /**
   * Returns an application by id from the repository.
   * @param appId The desired application id to search for.
   * @returns A promise resolving to the application with that id.
   * @throws {NotFoundException} with message 'Application with ID <id> not found'
   *         if an application with that id does not exist.
   * @throws {Error} which is unchanged from what repository throws.
   */
  async findById(appId: number): Promise<Application> {
    const application: Application = await this.applicationRepository.findOne({
      where: { appId },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${appId} not found`);
    }

    return application;
  }

  /**
   * Validates that the provided discipline is a valid DISCIPLINE_VALUES enum value.
   * @param discipline The discipline value to validate.
   * @throws {BadRequestException} if the discipline is not a valid DISCIPLINE_VALUES enum value.
   */
  private validateDiscipline(discipline: string): void {
    if (
      !Object.values(DISCIPLINE_VALUES).includes(
        discipline as DISCIPLINE_VALUES,
      )
    ) {
      throw new BadRequestException(
        `Invalid discipline: ${discipline}. Valid disciplines are: ${Object.values(
          DISCIPLINE_VALUES,
        ).join(', ')}`,
      );
    }
  }

  /**
   * Returns all applications that have the specified discipline.
   * @param discipline The discipline to filter applications by.
   * @returns A promise resolving to an array of applications with the specified discipline.
   *          Returns an empty array if no applications match the discipline.
   * @throws {BadRequestException} if the discipline is not a valid DISCIPLINE_VALUES enum value.
   * @throws {Error} which is unchanged from what repository throws.
   */
  async findByDiscipline(discipline: string): Promise<Application[]> {
    this.validateDiscipline(discipline);
    return await this.applicationRepository.find({
      where: { discipline: discipline as DISCIPLINE_VALUES },
    });
  }

  /**
   * Creates an application in the repository.
   * @param createApplicationDto The expected data required to create an application (applicant's info).
   * @returns The newly created application.
   * @throws {BadRequestException} if validation fails.
   * @throws {Error} which is unchanged from what repository throws.
   */
  async create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    this.validateApplicationDto(createApplicationDto);
    const application = this.applicationRepository.create(createApplicationDto);
    return await this.applicationRepository.save(application);
  }

  /**
   * Updates the status of the application in the repository.
   * @param appId The id of the application to update.
   * @param updateData Object containing the desired new application status.
   * @returns The updated application object.
   * @throws {NotFoundException} with message 'Application with ID <id> not found'
   *         if the application does not exist.
   * @throws {Error} which is unchanged from what repository throws.
   */
  async update(
    appId: number,
    updateData: Partial<CreateApplicationDto>,
  ): Promise<Application> {
    const application = await this.findById(appId);
    if (!application) {
      throw new NotFoundException(`Application with ID ${appId} not found`);
    }
    Object.assign(application, updateData);
    return await this.applicationRepository.save(application);
  }

  async delete(appId: number): Promise<Application> {
    const application = await this.findById(appId);
    if (!application) {
      throw new NotFoundException(`Application with ID ${appId} not found`);
    }
    return await this.applicationRepository.remove(application);
  }
}
