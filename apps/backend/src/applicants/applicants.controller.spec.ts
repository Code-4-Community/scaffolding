import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApplicantsController } from './applicants.controller';
import { ApplicantsService } from './applicants.service';
import { Applicant } from './applicant.entity';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { applicantFactory } from '../testing/factories/applicant.factory';

const mockApplicantsService: Partial<ApplicantsService> = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  findByAppId: jest.fn(),
  updateStartDate: jest.fn(),
  updateEndDate: jest.fn(),
};

const mockAuthService = {
  getUser: jest.fn(),
};

const mockUsersService = {
  find: jest.fn(),
};

const defaultApplicant: Applicant = applicantFactory({
  appId: 1,
  firstName: 'John',
  lastName: 'Doe',
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
        firstName: 'John',
        lastName: 'Doe',
        startDate: '2024-01-01',
        endDate: '2024-06-30',
      };

      jest
        .spyOn(mockApplicantsService, 'create')
        .mockResolvedValue(defaultApplicant);

      const result = await controller.createApplicant(createApplicantDto);

      expect(result).toEqual(defaultApplicant);
      expect(mockApplicantsService.create).toHaveBeenCalledWith(
        1,
        'John',
        'Doe',
        new Date('2024-01-01'),
        new Date('2024-06-30'),
      );
    });

    it('should handle service errors when creating applicant', async () => {
      const createApplicantDto = {
        appId: 1,
        firstName: 'John',
        lastName: 'Doe',
        startDate: '2024-01-01',
        endDate: '2024-06-30',
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
        applicantFactory({ appId: 2, firstName: 'Jane', lastName: 'Doe' }),
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

  describe('getApplicant', () => {
    it('should return a specific applicant', async () => {
      jest
        .spyOn(mockApplicantsService, 'findOne')
        .mockResolvedValue(defaultApplicant);

      const result = await controller.getApplicant(1);

      expect(result).toEqual(defaultApplicant);
      expect(mockApplicantsService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an error if applicant is not found', async () => {
      const errorMessage = 'Applicant with ID 999 not found';
      jest
        .spyOn(mockApplicantsService, 'findOne')
        .mockRejectedValue(new Error(errorMessage));

      await expect(controller.getApplicant(999)).rejects.toThrow(errorMessage);
    });
  });

  describe('updateStartDate', () => {
    const updatedStartDate = '2024-02-01';
    const updatedApplicant = {
      ...defaultApplicant,
      startDate: new Date(updatedStartDate),
    };

    it('should update the start date of a applicant', async () => {
      jest
        .spyOn(mockApplicantsService, 'updateStartDate')
        .mockResolvedValue(updatedApplicant);

      const result = await controller.updateStartDate(1, updatedStartDate);

      expect(result).toEqual(updatedApplicant);
      expect(mockApplicantsService.updateStartDate).toHaveBeenCalledWith(
        1,
        new Date(updatedStartDate),
      );
    });

    it('should handle service errors when updating start date', async () => {
      const errorMessage = 'Start date must be before end date';
      jest
        .spyOn(mockApplicantsService, 'updateStartDate')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.updateStartDate(1, updatedStartDate),
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('updateEndDate', () => {
    const updatedEndDate = '2024-07-31';
    const updatedApplicant = {
      ...defaultApplicant,
      endDate: new Date(updatedEndDate),
    };

    it('should update the end date of a applicant', async () => {
      jest
        .spyOn(mockApplicantsService, 'updateEndDate')
        .mockResolvedValue(updatedApplicant);

      const result = await controller.updateEndDate(1, updatedEndDate);

      expect(result).toEqual(updatedApplicant);
      expect(mockApplicantsService.updateEndDate).toHaveBeenCalledWith(
        1,
        new Date(updatedEndDate),
      );
    });

    it('should handle service errors when updating end date', async () => {
      const errorMessage = 'End date must be after start date';
      jest
        .spyOn(mockApplicantsService, 'updateEndDate')
        .mockRejectedValue(new Error(errorMessage));

      await expect(controller.updateEndDate(1, updatedEndDate)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe('deleteApplicant', () => {
    it('should delete a applicant', async () => {
      jest
        .spyOn(mockApplicantsService, 'delete')
        .mockResolvedValue(defaultApplicant);

      const result = await controller.deleteApplicant(1);
    });

    it('should handle service errors when deleting applicant', async () => {
      const errorMessage = 'Failed to delete applicant';
      jest
        .spyOn(mockApplicantsService, 'delete')
        .mockRejectedValue(new Error(errorMessage));
    });

    it('should throw an error if applicant is not found', async () => {
      const errorMessage = 'Applicant with ID 999 not found';
      jest
        .spyOn(mockApplicantsService, 'delete')
        .mockRejectedValue(new Error(errorMessage));
    });
  });
});
