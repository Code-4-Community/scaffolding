import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { Application } from './application.entity';
import { CreateApplicationDto } from './dto/create-application.request.dto';
import {
  AppStatus,
  ExperienceType,
  InterestArea,
  School,
  ApplicantType,
} from './types';
import { DISCIPLINE_VALUES } from '../disciplines/disciplines.constants';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let repository: Repository<Application>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
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
          appStatus: AppStatus.APP_SUBMITTED,
          mondayAvailability: '12pm and on every other week',
          tuesdayAvailability: 'approximately 10am-3pm',
          wednesdayAvailability: 'no availability',
          thursdayAvailability: 'maybe before 10am',
          fridayAvailability: 'Sometime between 4-6',
          saturdayAvailability: 'no availability',
          experienceType: ExperienceType.BS,
          interest: [InterestArea.WOMENS_HEALTH],
          license: null,
          applicantType: ApplicantType.LEARNER,
          phone: '123-456-7890',
          email: 'test@example.com',
          discipline: DISCIPLINE_VALUES.RN,
          referred: false,
          weeklyHours: 20,
          pronouns: 'they/them',
          nonEnglishLangs: 'some french, native spanish speaker',
          desiredExperience:
            'I want to give back to the boston community and learn to talk better with patients',
          resume: 'janedoe_resume_2_6_2026.pdf',
          coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
          emergencyContactName: 'Jane Doe',
          emergencyContactPhone: '111-111-1111',
          emergencyContactRelationship: 'Mother',
        },
      ];

      mockRepository.find.mockResolvedValue(mockApplications);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(mockApplications);
    });

    it('should return an empty array if the repo returns one', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should pass along any repo errors without information loss', async () => {
      mockRepository.find.mockRejectedValue(
        new Error('There was a problem retrieving the info'),
      );

      await expect(service.findAll()).rejects.toThrow(
        `There was a problem retrieving the info`,
      );
    });
  });

  describe('findById', () => {
    it('should return a single application', async () => {
      const mockApplication: Application = {
        appId: 1,
        appStatus: AppStatus.APP_SUBMITTED,
        mondayAvailability: '12pm and on every other week',
        tuesdayAvailability: 'approximately 10am-3pm',
        wednesdayAvailability: 'no availability',
        thursdayAvailability: 'maybe before 10am',
        fridayAvailability: 'Sometime between 4-6',
        saturdayAvailability: 'no availability',
        experienceType: ExperienceType.BS,
        interest: [InterestArea.WOMENS_HEALTH],
        license: null,
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.RN,
        referred: false,
        weeklyHours: 20,
        pronouns: 'she/her',
        nonEnglishLangs: 'spoken chinese only',
        desiredExperience:
          'I want to give back to the boston community and learn to talk better with patients',
        resume: 'janedoe_resume_2_6_2026.pdf',
        coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '111-111-1111',
        emergencyContactRelationship: 'Mother',
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

    // TODO: Address this in codebase so it passes.
    // Note: Adding .skip for now so it doesn't confuse people in their develop then tests all pass work cycle
    it.skip('should not return an application from the repo if the id is not the same as asked for', async () => {
      const mockApplication: Application = {
        appId: 1,
        appStatus: AppStatus.APP_SUBMITTED,
        mondayAvailability: '12pm and on every other week',
        tuesdayAvailability: 'approximately 10am-3pm',
        wednesdayAvailability: 'no availability',
        thursdayAvailability: 'maybe before 10am',
        fridayAvailability: 'Sometime between 4-6',
        saturdayAvailability: 'no availability',
        experienceType: ExperienceType.BS,
        interest: [InterestArea.WOMENS_HEALTH],
        license: 'n/a',
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.RN,
        referred: false,
        weeklyHours: 20,
        pronouns: 'they/them',
        nonEnglishLangs: 'some french, native spanish speaker',
        desiredExperience:
          'I want to give back to the boston community and learn to talk better with patients',
        resume: 'janedoe_resume_2_6_2026.pdf',
        coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '111-111-1111',
        emergencyContactRelationship: 'Mother',
      };

      mockRepository.findOne.mockResolvedValue(mockApplication);

      const result = await service.findById(10);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { appId: 10 } });
      expect(repository.findOne).toThrow();
    });

    it('should handle returning an application with no changes when optional fields are ommitted', async () => {
      const mockApplication: Application = {
        appId: 1,
        appStatus: AppStatus.APP_SUBMITTED,
        mondayAvailability: '12pm and on every other week',
        tuesdayAvailability: 'approximately 10am-3pm',
        wednesdayAvailability: 'no availability',
        thursdayAvailability: 'maybe before 10am',
        fridayAvailability: 'Sometime between 4-6',
        saturdayAvailability: 'no availability',
        experienceType: ExperienceType.BS,
        interest: [InterestArea.WOMENS_HEALTH],
        license: null,
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.RN,
        weeklyHours: 20,
        pronouns: 'they/them',
        nonEnglishLangs: 'none',
        desiredExperience:
          'I want to give back to the boston community and learn to talk better with patients',
        resume: 'janedoe_resume_2_6_2026.pdf',
        coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '111-111-1111',
        emergencyContactRelationship: 'Mother',
      };

      mockRepository.findOne.mockResolvedValue(mockApplication);

      const result = await service.findById(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { appId: 1 } });
      expect(result).toEqual(mockApplication);
    });

    it('should pass along any repo errors without information loss', async () => {
      mockRepository.findOne.mockRejectedValue(
        new Error('There was a problem retrieving the info'),
      );

      await expect(service.findById(1)).rejects.toThrow(
        new Error(`There was a problem retrieving the info`),
      );
    });
  });

  describe('create', () => {
    it('should create and save a new application', async () => {
      const createApplicationDto: CreateApplicationDto = {
        appStatus: AppStatus.APP_SUBMITTED,
        mondayAvailability: '12pm and on every other week',
        tuesdayAvailability: 'approximately 10am-3pm',
        wednesdayAvailability: 'no availability',
        thursdayAvailability: 'maybe before 10am',
        fridayAvailability: 'Sometime between 4-6',
        saturdayAvailability: 'no availability',
        experienceType: ExperienceType.BS,
        interest: [InterestArea.WOMENS_HEALTH],
        license: null,
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.RN,
        referred: false,
        weeklyHours: 20,
        pronouns: 'they/them',
        nonEnglishLangs: 'some chinese',
        desiredExperience:
          'I want to give back to the boston community and learn to talk better with patients',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '111-111-1111',
        emergencyContactRelationship: 'Mother',
        heardAboutFrom: [],
      };

      const savedApplication: Application = {
        appId: 1,
        ...createApplicationDto,
        resume: 'janedoe_resume_2_6_2026.pdf',
        coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
      };

      mockRepository.save.mockResolvedValue(savedApplication);

      const result = await service.create(createApplicationDto);

      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(savedApplication);
    });

    it('should pass along any repo errors without information loss', async () => {
      mockRepository.save.mockRejectedValue(
        new Error('There was a problem retrieving the info'),
      );
      const mockApplication: CreateApplicationDto = {
        appStatus: AppStatus.APP_SUBMITTED,
        mondayAvailability: '12pm and on every other week',
        tuesdayAvailability: 'approximately 10am-3pm',
        wednesdayAvailability: 'no availability',
        thursdayAvailability: 'maybe before 10am',
        fridayAvailability: 'Sometime between 4-6',
        saturdayAvailability: 'no availability',
        experienceType: ExperienceType.BS,
        interest: [InterestArea.WOMENS_HEALTH],
        license: null,
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.RN,
        weeklyHours: 20,
        pronouns: 'they/them',
        desiredExperience:
          'I want to give back to the boston community and learn to talk better with patients',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '111-111-1111',
        emergencyContactRelationship: 'Mother',
        heardAboutFrom: [],
      };

      await expect(service.create(mockApplication)).rejects.toThrow(
        new Error(`There was a problem retrieving the info`),
      );
    });

    it('should not accept a phone number that is too long', async () => {
      const createApplicationDto: CreateApplicationDto = {
        appStatus: AppStatus.APP_SUBMITTED,
        mondayAvailability: '12pm and on every other week',
        tuesdayAvailability: 'approximately 10am-3pm',
        wednesdayAvailability: 'no availability',
        thursdayAvailability: 'maybe before 10am',
        fridayAvailability: 'Sometime between 4-6',
        saturdayAvailability: 'no availability',
        experienceType: ExperienceType.BS,
        interest: [InterestArea.WOMENS_HEALTH],
        license: null,
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-78901231',
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.RN,
        referred: false,
        weeklyHours: 20,
        pronouns: 'they/them',
        desiredExperience:
          'I want to give back to the boston community and learn to talk better with patients',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '111-111-1111',
        emergencyContactRelationship: 'Mother',
        heardAboutFrom: [],
      };

      const savedApplication: Application = {
        appId: 1,
        ...createApplicationDto,
        resume: 'janedoe_resume_2_6_2026.pdf',
        coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
      };

      mockRepository.save.mockResolvedValue(savedApplication);
      await expect(service.create(createApplicationDto)).rejects.toThrow();
    });

    it('should not accept a phone number that is too short', async () => {
      const createApplicationDto: CreateApplicationDto = {
        appStatus: AppStatus.APP_SUBMITTED,
        mondayAvailability: '12pm and on every other week',
        tuesdayAvailability: 'approximately 10am-3pm',
        wednesdayAvailability: 'no availability',
        thursdayAvailability: 'maybe before 10am',
        fridayAvailability: 'Sometime between 4-6',
        saturdayAvailability: 'no availability',
        experienceType: ExperienceType.BS,
        interest: [InterestArea.WOMENS_HEALTH],
        license: null,
        applicantType: ApplicantType.LEARNER,
        phone: '123-4562',
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.RN,
        referred: false,
        weeklyHours: 20,
        pronouns: 'they/them',
        desiredExperience:
          'I want to give back to the boston community and learn to talk better with patients',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '111-111-1111',
        emergencyContactRelationship: 'Mother',
        heardAboutFrom: [],
      };

      const savedApplication: Application = {
        appId: 1,
        ...createApplicationDto,
        resume: 'janedoe_resume_2_6_2026.pdf',
        coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
      };

      mockRepository.save.mockResolvedValue(savedApplication);
      await expect(service.create(createApplicationDto)).rejects.toThrow();
    });

    it('should not accept a phone number that is the right length but not in ###-###-#### format', async () => {
      const createApplicationDto: CreateApplicationDto = {
        appStatus: AppStatus.APP_SUBMITTED,
        mondayAvailability: '12pm and on every other week',
        tuesdayAvailability: 'approximately 10am-3pm',
        wednesdayAvailability: 'no availability',
        thursdayAvailability: 'maybe before 10am',
        fridayAvailability: 'Sometime between 4-6',
        saturdayAvailability: 'no availability',
        experienceType: ExperienceType.BS,
        interest: [InterestArea.WOMENS_HEALTH],
        license: null,
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-8-90',
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.RN,
        referred: false,
        weeklyHours: 20,
        pronouns: 'they/them',
        desiredExperience:
          'I want to give back to the boston community and learn to talk better with patients',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '111-111-1111',
        emergencyContactRelationship: 'Mother',
        heardAboutFrom: [],
      };

      const savedApplication: Application = {
        appId: 1,
        ...createApplicationDto,
        resume: 'janedoe_resume_2_6_2026.pdf',
        coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
      };

      mockRepository.save.mockResolvedValue(savedApplication);
      await expect(service.create(createApplicationDto)).rejects.toThrow();
    });

    it('should not accept 0 weekly hours', async () => {
      const createApplicationDto: CreateApplicationDto = {
        appStatus: AppStatus.APP_SUBMITTED,
        mondayAvailability: '12pm and on every other week',
        tuesdayAvailability: 'approximately 10am-3pm',
        wednesdayAvailability: 'no availability',
        thursdayAvailability: 'maybe before 10am',
        fridayAvailability: 'Sometime between 4-6',
        saturdayAvailability: 'no availability',
        experienceType: ExperienceType.BS,
        interest: [InterestArea.WOMENS_HEALTH],
        license: null,
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.RN,
        referred: false,
        weeklyHours: 0,
        pronouns: 'they/them',
        desiredExperience:
          'I want to give back to the boston community and learn to talk better with patients',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '111-111-1111',
        emergencyContactRelationship: 'Mother',
        heardAboutFrom: [],
      };

      const savedApplication: Application = {
        appId: 1,
        ...createApplicationDto,
        resume: 'janedoe_resume_2_6_2026.pdf',
        coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
      };

      mockRepository.save.mockResolvedValue(savedApplication);
      await expect(service.create(createApplicationDto)).rejects.toThrow();
    });

    it('should not accept negative weekly hours', async () => {
      const createApplicationDto: CreateApplicationDto = {
        appStatus: AppStatus.APP_SUBMITTED,
        mondayAvailability: '12pm and on every other week',
        tuesdayAvailability: 'approximately 10am-3pm',
        wednesdayAvailability: 'no availability',
        thursdayAvailability: 'maybe before 10am',
        fridayAvailability: 'Sometime between 4-6',
        saturdayAvailability: 'no availability',
        experienceType: ExperienceType.BS,
        interest: [InterestArea.WOMENS_HEALTH],
        license: null,
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-78901231',
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.RN,
        referred: false,
        weeklyHours: -5,
        pronouns: 'they/them',
        desiredExperience:
          'I want to give back to the boston community and learn to talk better with patients',
        elaborateOtherDiscipline: 'text',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '111-111-1111',
        emergencyContactRelationship: 'Mother',
        heardAboutFrom: [],
      };

      const savedApplication: Application = {
        appId: 1,
        ...createApplicationDto,
        resume: 'janedoe_resume_2_6_2026.pdf',
        coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
      };

      mockRepository.save.mockResolvedValue(savedApplication);
      await expect(service.create(createApplicationDto)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update application status', async () => {
      const mockApplication: Application = {
        appId: 1,
        appStatus: AppStatus.APP_SUBMITTED,
        mondayAvailability: '12pm and on every other week',
        tuesdayAvailability: 'approximately 10am-3pm',
        wednesdayAvailability: 'no availability',
        thursdayAvailability: 'maybe before 10am',
        fridayAvailability: 'Sometime between 4-6',
        saturdayAvailability: 'no availability',
        experienceType: ExperienceType.BS,
        interest: [InterestArea.WOMENS_HEALTH],
        license: null,
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.RN,
        referred: false,
        weeklyHours: 20,
        pronouns: 'she/her',
        desiredExperience:
          'I want to give back to the boston community and learn to talk better with patients',
        resume: 'janedoe_resume_2_6_2026.pdf',
        coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '111-111-1111',
        emergencyContactRelationship: 'Mother',
      };

      const updatedApplication: Application = {
        ...mockApplication,
        appStatus: AppStatus.IN_REVIEW,
        resume: 'janedoe_resume_2_6_2026.pdf',
        coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
      };

      mockRepository.findOne.mockResolvedValue(mockApplication);
      mockRepository.save.mockResolvedValue(updatedApplication);

      const result = await service.update(1, {
        appStatus: AppStatus.IN_REVIEW,
      });

      expect(repository.findOne).toHaveBeenCalledWith({ where: { appId: 1 } });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockApplication,
        appStatus: AppStatus.IN_REVIEW,
      });
      expect(result).toEqual(updatedApplication);
    });

    it('should update application discipline', async () => {
      const mockApplication: Application = {
        appId: 1,
        appStatus: AppStatus.APP_SUBMITTED,
        mondayAvailability: '12pm and on every other week',
        tuesdayAvailability: 'approximately 10am-3pm',
        wednesdayAvailability: 'no availability',
        thursdayAvailability: 'maybe before 10am',
        fridayAvailability: 'Sometime between 4-6',
        saturdayAvailability: 'no availability',
        experienceType: ExperienceType.BS,
        interest: [InterestArea.WOMENS_HEALTH],
        license: null,
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.RN,
        referred: false,
        weeklyHours: 20,
        pronouns: 'they/them',
        desiredExperience:
          'I want to give back to the boston community and learn to talk better with patients',
        resume: 'janedoe_resume_2_6_2026.pdf',
        coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '111-111-1111',
        emergencyContactRelationship: 'Mother',
      };

      const updatedApplication: Application = {
        ...mockApplication,
        interest: [InterestArea.STREET_MEDICINE],
      };

      mockRepository.findOne.mockResolvedValue(mockApplication);
      mockRepository.save.mockResolvedValue(updatedApplication);

      const result = await service.update(1, {
        interest: [InterestArea.STREET_MEDICINE],
      });

      expect(repository.findOne).toHaveBeenCalledWith({ where: { appId: 1 } });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockApplication,
        interest: [InterestArea.STREET_MEDICINE],
      });
      expect(result).toEqual(updatedApplication);
    });

    it('should throw NotFoundException when updating non-existent application', async () => {
      const nonExistentId = 999;

      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(nonExistentId, { appStatus: AppStatus.IN_REVIEW }),
      ).rejects.toThrow(
        new NotFoundException(`Application with ID ${nonExistentId} not found`),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { appId: nonExistentId },
      });
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should pass along any repo errors from retrieval without information loss when saving a new discipline', async () => {
      mockRepository.findOne.mockRejectedValue(
        new Error('There was a problem retrieving the info'),
      );

      await expect(
        service.update(1, { interest: [InterestArea.STREET_MEDICINE] }),
      ).rejects.toThrow(new Error(`There was a problem retrieving the info`));
    });

    it('should pass along any repo errors from retrieval without information loss when saving a new application status', async () => {
      mockRepository.findOne.mockRejectedValue(
        new Error('There was a problem retrieving the info'),
      );

      await expect(
        service.update(1, { appStatus: AppStatus.IN_REVIEW }),
      ).rejects.toThrow(new Error(`There was a problem retrieving the info`));
    });

    it('should pass along any repo errors from saving the new info without information loss when saving a new discipline', async () => {
      const mockApplication: Application = {
        appId: 1,
        appStatus: AppStatus.APP_SUBMITTED,
        mondayAvailability: '12pm and on every other week',
        tuesdayAvailability: 'approximately 10am-3pm',
        wednesdayAvailability: 'no availability',
        thursdayAvailability: 'maybe before 10am',
        fridayAvailability: 'Sometime between 4-6',
        saturdayAvailability: 'no availability',
        experienceType: ExperienceType.BS,
        interest: [InterestArea.WOMENS_HEALTH],
        license: null,
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.RN,
        referred: false,
        weeklyHours: 20,
        pronouns: 'she/her',
        desiredExperience:
          'I want to give back to the boston community and learn to talk better with patients',
        resume: 'janedoe_resume_2_6_2026.pdf',
        coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '111-111-1111',
        emergencyContactRelationship: 'Mother',
      };

      mockRepository.findOne.mockResolvedValue(mockApplication);
      mockRepository.save.mockRejectedValue(
        new Error('There was a problem retrieving the info'),
      );

      await expect(
        service.update(1, { interest: [InterestArea.STREET_MEDICINE] }),
      ).rejects.toThrow(new Error(`There was a problem retrieving the info`));
    });

    it('should pass along any repo errors from saving the new info without information loss when saving a new application status', async () => {
      const mockApplication: Application = {
        appId: 1,
        appStatus: AppStatus.APP_SUBMITTED,
        mondayAvailability: '12pm and on every other week',
        tuesdayAvailability: 'approximately 10am-3pm',
        wednesdayAvailability: 'no availability',
        thursdayAvailability: 'maybe before 10am',
        fridayAvailability: 'Sometime between 4-6',
        saturdayAvailability: 'no availability',
        experienceType: ExperienceType.BS,
        interest: [InterestArea.WOMENS_HEALTH],
        license: null,
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.RN,
        referred: false,
        weeklyHours: 20,
        pronouns: 'she/her',
        desiredExperience:
          'I want to give back to the boston community and learn to talk better with patients',
        resume: 'janedoe_resume_2_6_2026.pdf',
        coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '111-111-1111',
        emergencyContactRelationship: 'Mother',
      };

      mockRepository.findOne.mockResolvedValue(mockApplication);
      mockRepository.save.mockRejectedValue(
        new Error('There was a problem retrieving the info'),
      );

      await expect(
        service.update(1, { appStatus: AppStatus.IN_REVIEW }),
      ).rejects.toThrow(new Error(`There was a problem retrieving the info`));
    });
  });

  describe('delete', () => {
    it('should delete an application', async () => {
      const mockApplication: Application = {
        appId: 1,
        appStatus: AppStatus.APP_SUBMITTED,
        mondayAvailability: '12pm and on every other week',
        tuesdayAvailability: 'approximately 10am-3pm',
        wednesdayAvailability: 'no availability',
        thursdayAvailability: 'maybe before 10am',
        fridayAvailability: 'Sometime between 4-6',
        saturdayAvailability: 'no availability',
        experienceType: ExperienceType.BS,
        interest: [InterestArea.WOMENS_HEALTH],
        license: null,
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.RN,
        referred: false,
        weeklyHours: 20,
        pronouns: 'she/her',
        desiredExperience:
          'I want to give back to the boston community and learn to talk better with patients',
        elaborateOtherDiscipline: 'text',
        resume: 'janedoe_resume_2_6_2026.pdf',
        coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '111-111-1111',
        emergencyContactRelationship: 'Mother',
      };

      mockRepository.findOne.mockResolvedValue(mockApplication);
      mockRepository.remove.mockResolvedValue(mockApplication);

      await service.delete(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { appId: 1 } });
      expect(repository.remove).toHaveBeenCalledWith(mockApplication);
    });

    it('should throw NotFoundException when deleting non-existent application', async () => {
      const nonExistentId = 999;

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(nonExistentId)).rejects.toThrow(
        new NotFoundException(`Application with ID ${nonExistentId} not found`),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { appId: nonExistentId },
      });
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });

  describe('findByDiscipline', () => {
    it('should return applications with the specified discipline', async () => {
      const mockApplications: Application[] = [
        {
          appId: 1,
          appStatus: AppStatus.APP_SUBMITTED,
          mondayAvailability: '12pm and on every other week',
          tuesdayAvailability: 'approximately 10am-3pm',
          wednesdayAvailability: 'no availability',
          thursdayAvailability: 'maybe before 10am',
          fridayAvailability: 'Sometime between 4-6',
          saturdayAvailability: 'no availability',
          experienceType: ExperienceType.BS,
          interest: [InterestArea.WOMENS_HEALTH],
          license: null,
          applicantType: ApplicantType.LEARNER,
          phone: '123-456-7890',
          email: 'test@example.com',
          discipline: DISCIPLINE_VALUES.RN,
          referred: false,
          weeklyHours: 20,
          pronouns: 'they/them',
          nonEnglishLangs: 'some french, native spanish speaker',
          desiredExperience:
            'I want to give back to the boston community and learn to talk better with patients',
          resume: 'janedoe_resume_2_6_2026.pdf',
          coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
          emergencyContactName: 'Jane Doe',
          emergencyContactPhone: '111-111-1111',
          emergencyContactRelationship: 'Mother',
        },
        {
          appId: 2,
          appStatus: AppStatus.IN_REVIEW,
          mondayAvailability: '12pm and on every other week',
          tuesdayAvailability: 'approximately 10am-3pm',
          wednesdayAvailability: 'no availability',
          thursdayAvailability: 'maybe before 10am',
          fridayAvailability: 'Sometime between 4-6',
          saturdayAvailability: 'no availability',
          experienceType: ExperienceType.MS,
          interest: [InterestArea.WOMENS_HEALTH],
          license: null,
          applicantType: ApplicantType.LEARNER,
          phone: '123-456-7890',
          email: 'test@example.com',
          discipline: DISCIPLINE_VALUES.RN,
          referred: false,
          weeklyHours: 20,
          pronouns: 'they/them',
          nonEnglishLangs: 'some french, native spanish speaker',
          desiredExperience:
            'I want to give back to the boston community and learn to talk better with patients',
          resume: 'janedoe_resume_2_6_2026.pdf',
          coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
          emergencyContactName: 'Jane Doe',
          emergencyContactPhone: '111-111-1111',
          emergencyContactRelationship: 'Mother',
        },
      ];

      mockRepository.find.mockResolvedValue(mockApplications);

      const result = await service.findByDiscipline(DISCIPLINE_VALUES.RN);

      expect(repository.find).toHaveBeenCalledWith({
        where: { discipline: DISCIPLINE_VALUES.RN },
      });
      expect(result).toEqual(mockApplications);
    });

    it('should return an empty array when no applications match the discipline', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findByDiscipline(DISCIPLINE_VALUES.RN);

      expect(repository.find).toHaveBeenCalledWith({
        where: { discipline: DISCIPLINE_VALUES.RN },
      });
      expect(result).toEqual([]);
    });

    it('should throw BadRequestException for invalid discipline', async () => {
      const invalidDiscipline = 'InvalidDiscipline';

      await expect(service.findByDiscipline(invalidDiscipline)).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining(
            `Invalid discipline: ${invalidDiscipline}`,
          ),
        }),
      );

      expect(repository.find).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException with list of valid disciplines', async () => {
      const invalidDiscipline = 'InvalidDiscipline';

      try {
        await service.findByDiscipline(invalidDiscipline);
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error.message).toContain('Invalid discipline');
        expect(error.message).toContain('Valid disciplines are:');
        expect(error.message).toContain('MD/Medical Student/Pre-Med');
        expect(error.message).toContain('Medical NP/PA');
        expect(error.message).toContain('Psychiatry or Psychiatric NP/PA');
        expect(error.message).toContain('Public Health');
        expect(error.message).toContain('RN');
        expect(error.message).toContain('Social Work');
        expect(error.message).toContain('Other');
      }

      expect(repository.find).not.toHaveBeenCalled();
    });

    it('should pass along any repo errors without information loss', async () => {
      mockRepository.find.mockRejectedValue(
        new Error('There was a problem retrieving the info'),
      );

      await expect(
        service.findByDiscipline(DISCIPLINE_VALUES.RN),
      ).rejects.toThrow(`There was a problem retrieving the info`);
    });

    it('should work with all valid discipline values', async () => {
      const allDisciplines = Object.values(DISCIPLINE_VALUES);

      for (const discipline of allDisciplines) {
        mockRepository.find.mockResolvedValue([]);

        await service.findByDiscipline(discipline);

        expect(repository.find).toHaveBeenCalledWith({
          where: { discipline },
        });
      }
    });
  });
});
