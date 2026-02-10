import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { Application } from './application.entity';
import {
  AppStatus,
  ExperienceType,
  InterestArea,
  School,
  ApplicantType,
} from './types';
import { DISCIPLINE_VALUES } from '../disciplines/disciplines.constants';

const mockApplicationsService: Partial<ApplicationsService> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByDiscipline: jest.fn(),
};

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

describe('ApplicationsController', () => {
  let controller: ApplicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [
        {
          provide: ApplicationsService,
          useValue: mockApplicationsService,
        },
      ],
    }).compile();

    controller = module.get<ApplicationsController>(ApplicationsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getApplicationsByDiscipline', () => {
    it('should return applications with the specified discipline', async () => {
      const mockApplications: Application[] = [
        mockApplication,
        {
          ...mockApplication,
          appId: 2,
          email: 'test2@example.com',
        },
      ];

      jest
        .spyOn(mockApplicationsService, 'findByDiscipline')
        .mockResolvedValue(mockApplications);

      const result = await controller.getApplicationsByDiscipline(
        DISCIPLINE_VALUES.RN,
        {},
      );

      expect(result).toEqual(mockApplications);
      expect(mockApplicationsService.findByDiscipline).toHaveBeenCalledWith(
        DISCIPLINE_VALUES.RN,
      );
    });

    it('should return an empty array when no applications match the discipline', async () => {
      jest
        .spyOn(mockApplicationsService, 'findByDiscipline')
        .mockResolvedValue([]);

      const result = await controller.getApplicationsByDiscipline(
        DISCIPLINE_VALUES.RN,
        {},
      );

      expect(result).toEqual([]);
      expect(mockApplicationsService.findByDiscipline).toHaveBeenCalledWith(
        DISCIPLINE_VALUES.RN,
      );
    });

    it('should throw BadRequestException for invalid discipline', async () => {
      const invalidDiscipline = 'InvalidDiscipline';
      const errorMessage = `Invalid discipline: ${invalidDiscipline}. Valid disciplines are: ${Object.values(
        DISCIPLINE_VALUES,
      ).join(', ')}`;

      jest
        .spyOn(mockApplicationsService, 'findByDiscipline')
        .mockRejectedValue(new BadRequestException(errorMessage));

      await expect(
        controller.getApplicationsByDiscipline(invalidDiscipline, {}),
      ).rejects.toThrow(BadRequestException);

      expect(mockApplicationsService.findByDiscipline).toHaveBeenCalledWith(
        invalidDiscipline,
      );
    });

    it('should pass along service errors without information loss', async () => {
      const errorMessage = 'There was a problem retrieving the info';

      jest
        .spyOn(mockApplicationsService, 'findByDiscipline')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.getApplicationsByDiscipline(DISCIPLINE_VALUES.RN, {}),
      ).rejects.toThrow(errorMessage);

      expect(mockApplicationsService.findByDiscipline).toHaveBeenCalledWith(
        DISCIPLINE_VALUES.RN,
      );
    });

    it('should work with all valid discipline values', async () => {
      const allDisciplines = Object.values(DISCIPLINE_VALUES);

      for (const discipline of allDisciplines) {
        jest
          .spyOn(mockApplicationsService, 'findByDiscipline')
          .mockResolvedValue([]);

        await controller.getApplicationsByDiscipline(discipline, {});

        expect(mockApplicationsService.findByDiscipline).toHaveBeenCalledWith(
          discipline,
        );
      }
    });
  });
});
