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
          interest: InterestArea.WOMENS_HEALTH,
          license: 'n/a',
          applicantType: ApplicantType.LEARNER,
          phone: '123-456-7890',
          school: School.HARVARD_MEDICAL_SCHOOL,
          email: 'test@example.com',
          discipline: DISCIPLINE_VALUES.Nursing,
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
        interest: InterestArea.MEDICAL_RESPITE_INPATIENT,
        license: 'n/a',
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        school: School.HARVARD_MEDICAL_SCHOOL,
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.Nursing,
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
        interest: InterestArea.STREET_MEDICINE,
        license: 'n/a',
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        school: School.HARVARD_MEDICAL_SCHOOL,
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.Nursing,
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
        interest: InterestArea.ADDICTION_MEDICINE,
        license: 'n/a',
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        school: School.HARVARD_MEDICAL_SCHOOL,
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.Nursing,
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
        interest: InterestArea.PRIMARY_CARE,
        license: 'n/a',
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        school: School.HARVARD_MEDICAL_SCHOOL,
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.Nursing,
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
        interest: InterestArea.BEHAVIORAL_HEALTH,
        license: 'n/a',
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-78901231',
        school: School.HARVARD_MEDICAL_SCHOOL,
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.Nursing,
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
        interest: InterestArea.VETERANS_SERVICES,
        license: 'n/a',
        applicantType: ApplicantType.LEARNER,
        phone: '123-4562',
        school: School.HARVARD_MEDICAL_SCHOOL,
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.Nursing,
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
        interest: InterestArea.FAMILY_AND_YOUTH_SERVICES,
        license: 'n/a',
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-8-90',
        school: School.HARVARD_MEDICAL_SCHOOL,
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.Nursing,
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
        interest: InterestArea.HEP_C_CARE,
        license: 'n/a',
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        school: School.HARVARD_MEDICAL_SCHOOL,
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.Nursing,
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
        interest: InterestArea.HIV_SERVICES,
        license: 'n/a',
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-78901231',
        school: School.HARVARD_MEDICAL_SCHOOL,
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.Nursing,
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
        interest: InterestArea.CASE_MANAGEMENT,
        license: 'n/a',
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        school: School.HARVARD_MEDICAL_SCHOOL,
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.Nursing,
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

    it('should update application interest', async () => {
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
        interest: InterestArea.WOMENS_HEALTH,
        license: 'n/a',
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        school: School.HARVARD_MEDICAL_SCHOOL,
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.Nursing,
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
        interest: InterestArea.DENTAL,
        resume: 'janedoe_resume_2_6_2026.pdf',
        coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
      };

      mockRepository.findOne.mockResolvedValue(mockApplication);
      mockRepository.save.mockResolvedValue(updatedApplication);

      const result = await service.update(1, {
        interest: InterestArea.DENTAL,
      });

      expect(repository.findOne).toHaveBeenCalledWith({ where: { appId: 1 } });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockApplication,
        interest: InterestArea.DENTAL,
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

    it('should pass along any repo errors from retrieval without information loss when saving a new interest', async () => {
      mockRepository.findOne.mockRejectedValue(
        new Error('There was a problem retrieving the info'),
      );

      await expect(
        service.update(1, { interest: InterestArea.DENTAL }),
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

    it('should pass along any repo errors from saving the new info without information loss when saving a new interest', async () => {
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
        interest: InterestArea.DENTAL,
        license: 'n/a',
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        school: School.HARVARD_MEDICAL_SCHOOL,
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.Nursing,
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
        service.update(1, { interest: InterestArea.DENTAL }),
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
        interest: InterestArea.DENTAL,
        license: 'n/a',
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        school: School.HARVARD_MEDICAL_SCHOOL,
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.Nursing,
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
        interest: InterestArea.DENTAL,
        license: 'n/a',
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        school: School.HARVARD_MEDICAL_SCHOOL,
        email: 'test@example.com',
        discipline: DISCIPLINE_VALUES.Nursing,
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
});
