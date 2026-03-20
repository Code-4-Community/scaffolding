import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VolunteerInfoService } from './volunteer-info.service';
import { VolunteerInfo } from './volunteer-info.entity';
import { BadRequestException } from '@nestjs/common';

describe('volunteerInfoService', () => {
  let service: VolunteerInfoService;
  let repository: Repository<VolunteerInfo>;

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
        VolunteerInfoService,
        {
          provide: getRepositoryToken(VolunteerInfo),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<VolunteerInfoService>(VolunteerInfoService);
    repository = module.get<Repository<VolunteerInfo>>(
      getRepositoryToken(VolunteerInfo),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new volunteer info', async () => {
      const volunteerInfo: VolunteerInfo = {
        appId: 0,
        license: 'example',
      };

      mockRepository.save.mockResolvedValue(volunteerInfo);

      const result = await service.create(volunteerInfo);

      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(volunteerInfo);
    });

    it('should pass along any repo errors without information loss', async () => {
      mockRepository.save.mockRejectedValue(
        new Error('There was a problem retrieving the info'),
      );
      const volunteerInfo: VolunteerInfo = {
        appId: 0,
        license: 'example',
      };

      await expect(service.create(volunteerInfo)).rejects.toThrow(
        new Error(`There was a problem retrieving the info`),
      );
    });

    it('should not accept negative appId', async () => {
      const volunteerInfo: VolunteerInfo = {
        appId: -1,
        license: 'example',
      };

      mockRepository.save.mockResolvedValue(volunteerInfo);
      await expect(service.create(volunteerInfo)).rejects.toThrow();
    });

    it('should reject duplicate appId', async () => {
      const volunteerInfo: VolunteerInfo = {
        appId: 2,
        license: 'example',
      };

      mockRepository.findOne.mockResolvedValue(volunteerInfo);

      await expect(service.create(volunteerInfo)).rejects.toThrow(
        new BadRequestException(
          `Volunteer Info with AppId ${volunteerInfo.appId} already exists`,
        ),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { appId: volunteerInfo.appId },
      });
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});
