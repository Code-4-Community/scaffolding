import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearnerInfoService } from './learner-info.service';
import { LearnerInfo } from './learner-info.entity';
import { CreateLearnerInfoDto } from './dto/create-learner-info.request.dto';
import { ExperienceType, InterestArea, School } from './types';

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
      const createLearnerInfoDto: CreateLearnerInfoDto = {
        appId: 0,
        school: School.HARVARD_MEDICAL_SCHOOL,
        interest: InterestArea.NURSING,
        experienceType: ExperienceType.BS,
        isInternational: false,
      };

      mockRepository.save.mockResolvedValue(createLearnerInfoDto);

      const result = await service.create(createLearnerInfoDto);

      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(createLearnerInfoDto);
    });

    it('should pass along any repo errors without information loss', async () => {
      mockRepository.save.mockRejectedValue(
        new Error('There was a problem retrieving the info'),
      );
      const createLearnerInfoDto: CreateLearnerInfoDto = {
        appId: 0,
        school: School.HARVARD_MEDICAL_SCHOOL,
        interest: InterestArea.NURSING,
        experienceType: ExperienceType.BS,
        isInternational: false,
      };

      await expect(service.create(createLearnerInfoDto)).rejects.toThrow(
        new Error(`There was a problem retrieving the info`),
      );
    });

    it('should not accept negative appId', async () => {
      const createLearnerInfoDto: CreateLearnerInfoDto = {
        appId: -1,
        school: School.HARVARD_MEDICAL_SCHOOL,
        interest: InterestArea.NURSING,
        experienceType: ExperienceType.BS,
        isInternational: false,
      };

      mockRepository.save.mockResolvedValue(createLearnerInfoDto);
      await expect(service.create(createLearnerInfoDto)).rejects.toThrow();
    });
  });
});
