import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApplicantsController } from './candidate-info.controller';
import { ApplicantsService } from './candidate-info.service';
import { Applicant } from './candidate-info.entity';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { applicantFactory } from '../testing/factories/applicant.factory';

const mockApplicantsService: Partial<ApplicantsService> = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  findByAppId: jest.fn(),
  delete: jest.fn(),
};

const mockAuthService = {
  getUser: jest.fn(),
};

const mockUsersService = {
  find: jest.fn(),
};

const defaultApplicant: Applicant = applicantFactory({
  appId: 1,
  email: 'john@example.com',
});

describe('ApplicantsController', () => {
  let controller: ApplicantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicantsController],
      providers: [
        {
          provide: ApplicantsService,
          useValue: mockApplicantsService,
        },
        {
          provide: getRepositoryToken(Applicant),
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

    controller = module.get<ApplicantsController>(ApplicantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createApplicant', () => {
    it('should create a new applicant', async () => {
      const createApplicantDto = {
        appId: 1,
        email: 'john@example.com',
      };

      jest
        .spyOn(mockApplicantsService, 'create')
        .mockResolvedValue(defaultApplicant);

      const result = await controller.createApplicant(createApplicantDto);

      expect(result).toEqual(defaultApplicant);
      expect(mockApplicantsService.create).toHaveBeenCalledWith(
        1,
        'john@example.com',
      );
    });

    it('should handle service errors when creating applicant', async () => {
      const createApplicantDto = {
        appId: 1,
        email: 'john@example.com',
      };

      const errorMessage = 'Failed to create applicant';
      jest
        .spyOn(mockApplicantsService, 'create')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.createApplicant(createApplicantDto),
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('getAllApplicants', () => {
    it('should return all applicants', async () => {
      const applicants = [
        defaultApplicant,
        applicantFactory({ appId: 2, email: 'jane@example.com' }),
      ];
      jest
        .spyOn(mockApplicantsService, 'findAll')
        .mockResolvedValue(applicants);

      const result = await controller.getAllApplicants();

      expect(result).toEqual(applicants);
      expect(mockApplicantsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no applicants exist', async () => {
      jest.spyOn(mockApplicantsService, 'findAll').mockResolvedValue([]);

      const result = await controller.getAllApplicants();

      expect(result).toEqual([]);
    });

    it('should error out without information loss if the service throws an error', async () => {
      jest
        .spyOn(mockApplicantsService, 'findAll')
        .mockRejectedValue(
          new Error('There was a problem retrieving the info'),
        );

      await expect(controller.getAllApplicants()).rejects.toThrow(
        `There was a problem retrieving the info`,
      );
    });
  });

  describe('getApplicantByEmail', () => {
    it('should return a specific applicant by email', async () => {
      jest
        .spyOn(mockApplicantsService, 'findOne')
        .mockResolvedValue(defaultApplicant);

      const result = await controller.getApplicantByEmail('john@example.com');

      expect(result).toEqual(defaultApplicant);
      expect(mockApplicantsService.findOne).toHaveBeenCalledWith(
        'john@example.com',
      );
    });

    it('should throw an error if applicant is not found', async () => {
      const errorMessage =
        'Applicant with email notfound@example.com not found';
      jest
        .spyOn(mockApplicantsService, 'findOne')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.getApplicantByEmail('notfound@example.com'),
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('getApplicantsByAppId', () => {
    it('should return applicants for the given app id', async () => {
      const applicants = [defaultApplicant];
      jest
        .spyOn(mockApplicantsService, 'findByAppId')
        .mockResolvedValue(applicants);

      const result = await controller.getApplicantsByAppId(1);

      expect(result).toEqual(applicants);
      expect(mockApplicantsService.findByAppId).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteApplicant', () => {
    it('should delete an applicant by email', async () => {
      jest
        .spyOn(mockApplicantsService, 'delete')
        .mockResolvedValue(defaultApplicant);

      const result = await controller.deleteApplicant('john@example.com');

      expect(result).toEqual(defaultApplicant);
      expect(mockApplicantsService.delete).toHaveBeenCalledWith(
        'john@example.com',
      );
    });

    it('should handle service errors when deleting applicant', async () => {
      const errorMessage = 'Failed to delete applicant';
      jest
        .spyOn(mockApplicantsService, 'delete')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.deleteApplicant('john@example.com'),
      ).rejects.toThrow('Failed to delete applicant');
    });

    it('should throw an error if applicant is not found', async () => {
      const errorMessage =
        'Applicant with email notfound@example.com not found';
      jest
        .spyOn(mockApplicantsService, 'delete')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.deleteApplicant('notfound@example.com'),
      ).rejects.toThrow(errorMessage);
    });
  });
});
