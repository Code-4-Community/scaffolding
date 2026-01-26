import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LearnerInfoController } from './learner-info.controller';
import { LearnerInfoService } from './learner-info.service';
import { LearnerInfo } from './learner-info.entity';
import { CreateLearnerInfoDto } from './dto/create-learner-info.request.dto';
import { ExperienceType, InterestArea, School } from './types';
import { BadRequestException } from '@nestjs/common';

describe('LearnerInfoController', () => {
  let controller: LearnerInfoController;

  const mockLearnerInfoService = {
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearnerInfoController],
      providers: [
        {
          provide: LearnerInfoService,
          useValue: mockLearnerInfoService,
        },
        {
          provide: getRepositoryToken(LearnerInfo),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<LearnerInfoController>(LearnerInfoController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /', () => {
    it('should create a new learner info', async () => {
      const createLearnerInfo: CreateLearnerInfoDto = {
        appId: 0,
        school: School.HARVARD_MEDICAL_SCHOOL,
        interest: InterestArea.NURSING,
        experienceType: ExperienceType.BS,
        isInternational: false,
      };

      mockLearnerInfoService.create.mockResolvedValue(createLearnerInfo);

      // Call controller method
      const result = await controller.createLearnerInfo(createLearnerInfo);

      // Verify results
      expect(result).toEqual(createLearnerInfo);
      expect(mockLearnerInfoService.create).toHaveBeenCalledWith(
        createLearnerInfo,
      );
    });

    it('should pass along any service errors without information loss', async () => {
      mockLearnerInfoService.create.mockRejectedValue(
        new Error('There was a problem retrieving the info'),
      );
      const createLearnerInfoDto: CreateLearnerInfoDto = {
        appId: 0,
        school: School.HARVARD_MEDICAL_SCHOOL,
        interest: InterestArea.NURSING,
        experienceType: ExperienceType.BS,
        isInternational: false,
      };

      await expect(
        controller.createLearnerInfo(createLearnerInfoDto),
      ).rejects.toThrow(new Error(`There was a problem retrieving the info`));
    });

    it('should not accept negative appId', async () => {
      const createLearnerInfoDto: CreateLearnerInfoDto = {
        appId: -1,
        school: School.HARVARD_MEDICAL_SCHOOL,
        interest: InterestArea.NURSING,
        experienceType: ExperienceType.BS,
        isInternational: false,
      };

      mockLearnerInfoService.create.mockRejectedValue(
        new BadRequestException('appId must not be negative'),
      );

      await expect(
        controller.createLearnerInfo(createLearnerInfoDto),
      ).rejects.toThrow(new BadRequestException(`appId must not be negative`));
    });
  });

  describe('PATCH /:appId/interest', () => {
    it('should update learner info interest', async () => {
      const createLearnerInfo: CreateLearnerInfoDto = {
        appId: 1,
        school: School.HARVARD_MEDICAL_SCHOOL,
        interest: InterestArea.NURSING,
        experienceType: ExperienceType.BS,
        isInternational: false,
      };

      mockLearnerInfoService.update.mockResolvedValue(
        createLearnerInfo as LearnerInfo,
      );

      // Call controller method
      const result = await controller.updateApplicationInterest(1, {
        interest: InterestArea.HARM_REDUCTION,
      });

      // Verify results
      expect(result).toEqual(createLearnerInfo);
      expect(mockLearnerInfoService.update).toHaveBeenCalledWith(1, {
        interest: InterestArea.HARM_REDUCTION,
      });
    });

    it('should throw NotFoundException with no information loss when updating non-existent application', async () => {
      const nonExistentId = 999;

      mockLearnerInfoService.update.mockRejectedValue(
        new BadRequestException(
          `Application with ID ${nonExistentId} not found`,
        ),
      );
      await expect(
        controller.updateApplicationInterest(999, {
          interest: InterestArea.HARM_REDUCTION,
        }),
      ).rejects.toThrow(
        new BadRequestException(
          `Application with ID ${nonExistentId} not found`,
        ),
      );
    });
  });
});
