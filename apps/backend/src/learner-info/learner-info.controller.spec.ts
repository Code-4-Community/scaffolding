import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LearnerInfoController } from './learner-info.controller';
import { LearnerInfoService } from './learner-info.service';
import { LearnerInfo } from './learner-info.entity';
import { CreateLearnerInfoDto } from './dto/create-learner-info.request.dto';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { ExperienceType, InterestArea, School } from './types';

const mockLearnerInfoService: Partial<LearnerInfoService> = {
  create: jest.fn(),
};

const mockAuthService = {
  getUser: jest.fn(),
};

const mockUsersService = {
  find: jest.fn(),
};

describe('LearnerInfoController', () => {
  let controller: LearnerInfoController;

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
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
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
        daysAvailable: [DaysOfTheWeek.MONDAY, DaysOfTheWeek.TUESDAY],
        experienceType: ExperienceType.BS,
        fileUploads: [],
        interest: InterestArea.NURSING,
        license: null,
        isInternational: false,
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        school: School.HARVARD_MEDICAL_SCHOOL,
        weeklyHours: 20,
      };

      await expect(service.create(mockApplication)).rejects.toThrow(
        new Error(`There was a problem retrieving the info`),
      );
    });

    it('should not accept negative appId', async () => {
      const createApplicationDto: CreateApplicationDto = {
        appStatus: AppStatus.APP_SUBMITTED,
        daysAvailable: [DaysOfTheWeek.MONDAY, DaysOfTheWeek.TUESDAY],
        experienceType: ExperienceType.BS,
        fileUploads: [],
        interest: InterestArea.NURSING,
        license: null,
        isInternational: false,
        applicantType: ApplicantType.LEARNER,
        phone: '123-456-7890',
        school: School.HARVARD_MEDICAL_SCHOOL,
        referred: false,
        referredEmail: null,
        weeklyHours: 0,
      };

      const savedApplication: Application = {
        appId: 1,
        ...createApplicationDto,
      };

      mockRepository.save.mockResolvedValue(savedApplication);
      await expect(service.create(createApplicationDto)).rejects.toThrow();
    });
  });
});
