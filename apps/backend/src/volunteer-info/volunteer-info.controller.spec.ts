import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { volunteerInfoController } from './volunteer-info.controller';
import { VolunteerInfoService } from './volunteer-info.service';
import { VolunteerInfo } from './volunteer-info.entity';
import { CreateVolunteerInfoDto } from './dto/create-volunteer-info.request.dto';
import { BadRequestException } from '@nestjs/common';

describe('volunteerInfoController', () => {
  let controller: volunteerInfoController;

  const mockVolunteerInfoService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [volunteerInfoController],
      providers: [
        {
          provide: VolunteerInfoService,
          useValue: mockVolunteerInfoService,
        },
        {
          provide: getRepositoryToken(VolunteerInfo),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<volunteerInfoController>(volunteerInfoController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /', () => {
    it('should create a new volunteer info', async () => {
      const createVolunteerInfo: CreateVolunteerInfoDto = {
        appId: 0,
        license: 'example',
      };

      mockVolunteerInfoService.create.mockResolvedValue(
        createVolunteerInfo as VolunteerInfo,
      );

      // Call controller method
      const result = await controller.createVolunteerInfo(createVolunteerInfo);

      // Verify results
      expect(result).toEqual(createVolunteerInfo as VolunteerInfo);
      expect(mockVolunteerInfoService.create).toHaveBeenCalledWith(
        createVolunteerInfo,
      );
    });

    it('should pass along any service errors without information loss', async () => {
      mockVolunteerInfoService.create.mockRejectedValue(
        new Error('There was a problem retrieving the info'),
      );
      const createVolunteerInfoDto: CreateVolunteerInfoDto = {
        appId: 0,
        license: 'example',
      };

      await expect(
        controller.createVolunteerInfo(createVolunteerInfoDto),
      ).rejects.toThrow(new Error(`There was a problem retrieving the info`));
    });

    it('should not accept negative appId', async () => {
      const createVolunteerInfoDto: CreateVolunteerInfoDto = {
        appId: 0,
        license: 'example',
      };

      mockVolunteerInfoService.create.mockRejectedValue(
        new BadRequestException('appId must not be negative'),
      );

      await expect(
        controller.createVolunteerInfo(createVolunteerInfoDto),
      ).rejects.toThrow(new BadRequestException(`appId must not be negative`));
    });
  });
});
