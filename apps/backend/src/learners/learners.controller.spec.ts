import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LearnersController } from './learners.controller';
import { LearnersService } from './learners.service';
import { Learner } from './learner.entity';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { learnerFactory } from '../testing/factories/learner.factory';

const mockLearnersService: Partial<LearnersService> = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  findByAppId: jest.fn(),
};

const mockAuthService = {
  getUser: jest.fn(),
};

const mockUsersService = {
  find: jest.fn(),
};

const defaultLearner: Learner = learnerFactory({ id: 1, name: 'John Doe' });

describe('LearnersController', () => {
  let controller: LearnersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearnersController],
      providers: [
        {
          provide: LearnersService,
          useValue: mockLearnersService,
        },
        {
          provide: getRepositoryToken(Learner),
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
        {
          provide: CurrentUserInterceptor,
          useValue: {
            intercept: jest
              .fn()
              .mockImplementation((context, handler) => handler.handle()),
          },
        },
      ],
    }).compile();

    controller = module.get<LearnersController>(LearnersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createLearner', () => {
    it('should create a new learner', async () => {
      const createLearnerDto = {
        appId: 1,
        name: 'John Doe',
        startDate: '2024-01-01',
        endDate: '2024-06-30',
      };

      jest
        .spyOn(mockLearnersService, 'create')
        .mockResolvedValue(defaultLearner);

      const result = await controller.createLearner(createLearnerDto);

      expect(result).toEqual(defaultLearner);
      expect(mockLearnersService.create).toHaveBeenCalledWith(
        1,
        'John Doe',
        new Date('2024-01-01'),
        new Date('2024-06-30'),
      );
    });

    it('should handle service errors when creating learner', async () => {
      const createLearnerDto = {
        appId: 1,
        name: 'John Doe',
        startDate: '2024-01-01',
        endDate: '2024-06-30',
      };

      const errorMessage = 'Failed to create learner';
      jest
        .spyOn(mockLearnersService, 'create')
        .mockRejectedValue(new Error(errorMessage));

      await expect(controller.createLearner(createLearnerDto)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe('getAllLearners', () => {
    it('should return all learners', async () => {
      const learners = [
        defaultLearner,
        learnerFactory({ id: 2, name: 'Jane Doe' }),
      ];
      jest.spyOn(mockLearnersService, 'findAll').mockResolvedValue(learners);

      const result = await controller.getAllLearners();

      expect(result).toEqual(learners);
      expect(mockLearnersService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no learners exist', async () => {
      jest.spyOn(mockLearnersService, 'findAll').mockResolvedValue([]);

      const result = await controller.getAllLearners();

      expect(result).toEqual([]);
    });
  });

  describe('getLearner', () => {
    it('should return a specific learner', async () => {
      jest
        .spyOn(mockLearnersService, 'findOne')
        .mockResolvedValue(defaultLearner);

      const result = await controller.getLearner(1);

      expect(result).toEqual(defaultLearner);
      expect(mockLearnersService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an error if learner is not found', async () => {
      const errorMessage = 'Learner with ID 999 not found';
      jest
        .spyOn(mockLearnersService, 'findOne')
        .mockRejectedValue(new Error(errorMessage));

      await expect(controller.getLearner(999)).rejects.toThrow(errorMessage);
    });
  });
});
