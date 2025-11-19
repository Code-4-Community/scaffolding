import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { Application } from './application.entity';
import { CreateApplicationDto } from './dto/create-application.request.dto';
import { AppStatus, ExperienceType, InterestArea, School } from './types';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let repository: Repository<Application>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: getRepositoryToken(Application),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    repository = module.get<Repository<Application>>(
      getRepositoryToken(Application),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of applications', async () => {
      const mockApplications: Application[] = [
        {
          appId: 1,
          name: 'Test User',
          email: 'test@example.com',
          appStatus: AppStatus.APP_SUBMITTED,
          daysAvailable: 'Monday, Tuesday',
          experienceType: ExperienceType.BS,
          fileUploads: [],
          interest: InterestArea.NURSING,
          license: null,
          isInternational: false,
          isLearner: false,
          phone: '123-456-7890',
          school: School.HARVARD_MEDICAL_SCHOOL,
          referred: false,
          referredEmail: null,
          weeklyHours: 20,
        },
      ];

      mockRepository.find.mockResolvedValue(mockApplications);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(mockApplications);
    });
  });

  describe('findById', () => {
    it('should return a single application', async () => {
      const mockApplication: Application = {
        appId: 1,
        name: 'Test User',
        email: 'test@example.com',
        appStatus: AppStatus.APP_SUBMITTED,
        daysAvailable: 'Monday, Tuesday',
        experienceType: ExperienceType.BS,
        fileUploads: [],
        interest: InterestArea.NURSING,
        license: null,
        isInternational: false,
        isLearner: false,
        phone: '123-456-7890',
        school: School.HARVARD_MEDICAL_SCHOOL,
        referred: false,
        referredEmail: null,
        weeklyHours: 20,
      };

      mockRepository.findOne.mockResolvedValue(mockApplication);

      const result = await service.findById(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { appId: 1 } });
      expect(result).toEqual(mockApplication);
    });

    it('should throw NotFoundException when application is not found', async () => {
      const nonExistentId = 999;

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(nonExistentId)).rejects.toThrow(
        new NotFoundException(`Application with ID ${nonExistentId} not found`),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { appId: nonExistentId },
      });
    });
  });

  describe('create', () => {
    it('should create and save a new application', async () => {
      const createApplicationDto: CreateApplicationDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        appStatus: AppStatus.APP_SUBMITTED,
        daysAvailable: 'Monday, Tuesday',
        experienceType: ExperienceType.BS,
        fileUploads: [],
        interest: InterestArea.NURSING,
        license: null,
        isInternational: false,
        isLearner: false,
        phone: '123-456-7890',
        school: School.HARVARD_MEDICAL_SCHOOL,
        referred: false,
        referredEmail: null,
        weeklyHours: 20,
      };

      const savedApplication: Application = {
        appId: 1,
        appStatus: AppStatus.APP_SUBMITTED,
        ...createApplicationDto,
      };

      mockRepository.save.mockResolvedValue(savedApplication);

      const result = await service.create(createApplicationDto);

      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(savedApplication);
    });
  });

  describe('handlePandaDocWebhook', () => {
    it('should process a document_completed webhook and create an application', async () => {
      const webhookData = {
        event: 'document_completed',
        data: {
          id: 'doc-123',
          name: 'Test Document',
          status: 'document.completed',
          recipients: [
            {
              email: 'jane.doe@example.com',
              first_name: 'Jane',
              last_name: 'Doe',
            },
          ],
          fields: [
            { uuid: 'f1', name: 'phone', value: '617-555-1234' },
            { uuid: 'f2', name: 'school', value: 'Harvard Medical School' },
            { uuid: 'f3', name: 'days_available', value: 'Monday, Wednesday' },
            { uuid: 'f4', name: 'weekly_hours', value: '10' },
            { uuid: 'f5', name: 'experience_type', value: 'MD' },
            { uuid: 'f6', name: 'interest', value: 'Nursing' },
            { uuid: 'f7', name: 'license', value: 'MD-12345' },
            { uuid: 'f8', name: 'is_international', value: 'false' },
            { uuid: 'f9', name: 'is_learner', value: 'true' },
            { uuid: 'f10', name: 'referred', value: 'false' },
            { uuid: 'f11', name: 'file_uploads', value: '[]' },
          ],
        },
      };

      const expectedApplication = {
        appId: 1,
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        appStatus: AppStatus.APP_SUBMITTED,
        daysAvailable: 'Monday, Wednesday',
        experienceType: ExperienceType.MD,
        fileUploads: [],
        interest: InterestArea.NURSING,
        license: 'MD-12345',
        isInternational: false,
        isLearner: true,
        phone: '617-555-1234',
        school: School.HARVARD_MEDICAL_SCHOOL,
        referred: false,
        weeklyHours: 10,
      };

      mockRepository.create.mockReturnValue(expectedApplication);
      mockRepository.save.mockResolvedValue(expectedApplication);

      const result = await service.handlePandaDocWebhook(webhookData);

      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(expectedApplication);
    });

    it('should throw an error for unsupported webhook events', async () => {
      const webhookData = {
        event: 'document_created',
        data: {
          id: 'doc-123',
          fields: [],
          recipients: [],
        },
      };

      await expect(service.handlePandaDocWebhook(webhookData)).rejects.toThrow(
        'Event type document_created is not processed',
      );
    });

    it('should extract name from name field in webhook data', async () => {
      const webhookData = {
        event: 'document_completed',
        data: {
          id: 'doc-456',
          recipients: [],
          fields: [
            { uuid: 'f1', name: 'name', value: 'Alice Smith' },
            { uuid: 'f2', name: 'email', value: 'alice@example.com' },
            { uuid: 'f3', name: 'phone', value: '555-0001' },
            { uuid: 'f4', name: 'school', value: 'Other' },
            { uuid: 'f5', name: 'days_available', value: 'Friday' },
            { uuid: 'f6', name: 'weekly_hours', value: '5' },
            { uuid: 'f7', name: 'experience_type', value: 'BS' },
            { uuid: 'f8', name: 'interest', value: 'Nursing' },
            { uuid: 'f9', name: 'license', value: '' },
            { uuid: 'f10', name: 'is_international', value: 'true' },
            { uuid: 'f11', name: 'is_learner', value: 'false' },
            { uuid: 'f12', name: 'referred', value: 'false' },
            { uuid: 'f13', name: 'file_uploads', value: '[]' },
          ],
        },
      };

      const expectedApplication = {
        appId: 2,
        name: 'Alice Smith',
        email: 'alice@example.com',
      };

      mockRepository.create.mockReturnValue(expectedApplication);
      mockRepository.save.mockResolvedValue(expectedApplication);

      const result = await service.handlePandaDocWebhook(webhookData);

      expect(result.name).toBe('Alice Smith');
      expect(result.email).toBe('alice@example.com');
    });
  });
});
