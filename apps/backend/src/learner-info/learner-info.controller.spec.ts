import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LearnerInfoController } from './learner-info.controller';
import { LearnerInfoService } from './learner-info.service';
import { LearnerInfo } from './learner-info.entity';
import { CreateLearnerInfoDto } from './dto/create-learner-info.request.dto';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

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
});
