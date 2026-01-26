import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearnerInfoService } from './learner-info.service';
import { LearnerInfo } from './learner-info.entity';
import { ExperienceType, InterestArea, School } from './types';
import { NotFoundException } from '@nestjs/common';

describe('LearnerInfoService', () => {
  let service: LearnerInfoService;
  let repository: Repository<LearnerInfo>;

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
        LearnerInfoService,
        {
          provide: getRepositoryToken(LearnerInfo),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LearnerInfoService>(LearnerInfoService);
    repository = module.get<Repository<LearnerInfo>>(
      getRepositoryToken(LearnerInfo),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new learner info', async () => {
      const LearnerInfo: LearnerInfo = {
        appId: 0,
        school: School.HARVARD_MEDICAL_SCHOOL,
        interest: InterestArea.NURSING,
        experienceType: ExperienceType.BS,
        isInternational: false,
      };

      mockRepository.save.mockResolvedValue(LearnerInfo);

      const result = await service.create(LearnerInfo);

      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(LearnerInfo);
    });

    it('should pass along any repo errors without information loss', async () => {
      mockRepository.save.mockRejectedValue(
        new Error('There was a problem retrieving the info'),
      );
      const LearnerInfo: LearnerInfo = {
        appId: 0,
        school: School.HARVARD_MEDICAL_SCHOOL,
        interest: InterestArea.NURSING,
        experienceType: ExperienceType.BS,
        isInternational: false,
      };

      await expect(service.create(LearnerInfo)).rejects.toThrow(
        new Error(`There was a problem retrieving the info`),
      );
    });

    it('should not accept negative appId', async () => {
      const LearnerInfo: LearnerInfo = {
        appId: -1,
        school: School.HARVARD_MEDICAL_SCHOOL,
        interest: InterestArea.NURSING,
        experienceType: ExperienceType.BS,
        isInternational: false,
      };

      mockRepository.save.mockResolvedValue(LearnerInfo);
      await expect(service.create(LearnerInfo)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('should return a single application', async () => {
      const LearnerInfo: LearnerInfo = {
        appId: 1,
        school: School.HARVARD_MEDICAL_SCHOOL,
        interest: InterestArea.NURSING,
        experienceType: ExperienceType.BS,
        isInternational: false,
      };

      mockRepository.findOne.mockResolvedValue(LearnerInfo);

      const result = await service.findById(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { appId: 1 } });
      expect(result).toEqual(LearnerInfo);
    });

    it('should throw NotFoundException when application is not found', async () => {
      const nonExistentId = 999;

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(nonExistentId)).rejects.toThrow(
        new NotFoundException(
          `Learner Info with AppId ${nonExistentId} not found`,
        ),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { appId: nonExistentId },
      });
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

  describe('update', () => {
    it('should update learner info interest', async () => {
      const learnerInfo: LearnerInfo = {
        appId: 1,
        school: School.HARVARD_MEDICAL_SCHOOL,
        interest: InterestArea.NURSING,
        experienceType: ExperienceType.BS,
        isInternational: false,
      };

      const updatedApplication: LearnerInfo = {
        ...learnerInfo,
        interest: InterestArea.HARM_REDUCTION,
      };

      mockRepository.findOne.mockResolvedValue(learnerInfo);
      mockRepository.save.mockResolvedValue(updatedApplication);

      const result = await service.update(1, {
        interest: InterestArea.HARM_REDUCTION,
      });

      expect(repository.findOne).toHaveBeenCalledWith({ where: { appId: 1 } });
      expect(repository.save).toHaveBeenCalledWith({
        ...learnerInfo,
        interest: InterestArea.HARM_REDUCTION,
      });
      expect(result).toEqual(updatedApplication);
    });

    it('should throw NotFoundException when updating non-existent application', async () => {
      const nonExistentId = 999;

      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(999, { interest: InterestArea.HARM_REDUCTION }),
      ).rejects.toThrow(
        new NotFoundException(
          `Learner Info with AppId ${nonExistentId} not found`,
        ),
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
        service.update(1, { interest: InterestArea.HARM_REDUCTION }),
      ).rejects.toThrow(new Error(`There was a problem retrieving the info`));
    });

    it('should pass along any repo errors from saving the new info without information loss when saving a new interest', async () => {
      const learnerInfo: LearnerInfo = {
        appId: 1,
        school: School.HARVARD_MEDICAL_SCHOOL,
        interest: InterestArea.NURSING,
        experienceType: ExperienceType.BS,
        isInternational: false,
      };

      mockRepository.findOne.mockResolvedValue(learnerInfo);
      mockRepository.save.mockRejectedValue(
        new Error('There was a problem retrieving the info'),
      );

      await expect(
        service.update(1, { interest: InterestArea.HARM_REDUCTION }),
      ).rejects.toThrow(new Error(`There was a problem retrieving the info`));
    });
  });
});
