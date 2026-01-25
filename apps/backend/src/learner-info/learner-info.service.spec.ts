import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearnerInfoService } from './learner-info.service';
import { LearnerInfo } from './learner-info.entity';

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
});
