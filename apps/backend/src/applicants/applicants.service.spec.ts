import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { ApplicantsService } from './applicants.service';
import { Applicant } from './applicant.entity';
import { applicantFactory } from '../testing/factories/applicant.factory';

const mockApplicantsRepository: Partial<Repository<Applicant>> = {
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
};

const applicant1: Applicant = applicantFactory({
  appId: 1,
  firstName: 'John',
  lastName: 'Doe',
});
const applicant2: Applicant = applicantFactory({
  appId: 2,
  firstName: 'Jane',
  lastName: 'Doe',
});

describe('ApplicantsService', () => {
  let service: ApplicantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicantsService,
        {
          provide: getRepositoryToken(Applicant),
          useValue: mockApplicantsRepository,
        },
      ],
    }).compile();

    service = module.get<ApplicantsService>(ApplicantsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new applicant', async () => {
      const createData = {
        appId: 1,
        firstName: 'John',
        lastName: 'Doe',
        proposedStartDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
      };

      jest
        .spyOn(mockApplicantsRepository, 'create')
        .mockReturnValue(applicant1);
      jest
        .spyOn(mockApplicantsRepository, 'save')
        .mockResolvedValue(applicant1);

      const result = await service.create(
        createData.appId,
        createData.firstName,
        createData.lastName,
        createData.proposedStartDate,
        createData.endDate,
      );

      expect(result).toEqual(applicant1);
      expect(mockApplicantsRepository.create).toHaveBeenCalledWith(createData);
      expect(mockApplicantsRepository.save).toHaveBeenCalledWith(applicant1);
    });

    it('should throw error if appId is invalid', async () => {
      await expect(
        service.create(
          0,
          'John',
          'Doe',
          new Date('2024-01-01'),
          new Date('2024-06-30'),
        ),
      ).rejects.toThrow('Valid app ID is required');
    });

    it('should throw error if first name is empty', async () => {
      await expect(
        service.create(
          1,
          '',
          'Doe',
          new Date('2024-01-01'),
          new Date('2024-06-30'),
        ),
      ).rejects.toThrow('Applicant first name is required');
    });

    it('should throw error if last name is empty', async () => {
      await expect(
        service.create(
          1,
          'Jane',
          '',
          new Date('2024-01-01'),
          new Date('2024-06-30'),
        ),
      ).rejects.toThrow('Applicant last name is required');
    });

    it('should throw error if proposed start date is after end date', async () => {
      await expect(
        service.create(
          1,
          'John',
          'Doe',
          new Date('2024-06-30'),
          new Date('2024-01-01'),
        ),
      ).rejects.toThrow('proposed start date must be before end date');
    });

    it('should throw error if proposed start date is invalid', async () => {
      await expect(
        service.create(
          1,
          'John',
          'Doe',
          new Date('not-a-date'),
          new Date('2024-06-30'),
        ),
      ).rejects.toThrow('proposed start date and end date must be valid dates');
    });

    it('should throw error if end date is invalid', async () => {
      await expect(
        service.create(
          1,
          'John',
          'Doe',
          new Date('2024-01-01'),
          new Date('not-a-date'),
        ),
      ).rejects.toThrow('proposed start date and end date must be valid dates');
    });

    it('should error out without information loss if the repository throws an error during create', async () => {
      const createData = {
        appId: 1,
        firstName: 'John',
        lastName: 'Doe',
        proposedStartDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
      };

      jest
        .spyOn(mockApplicantsRepository, 'create')
        .mockImplementationOnce(() => {
          throw new Error('There was a problem retrieving the info');
        });

      await expect(
        service.create(
          createData.appId,
          createData.firstName,
          createData.lastName,
          createData.proposedStartDate,
          createData.endDate,
        ),
      ).rejects.toThrow(`There was a problem retrieving the info`);
    });

    it('should error out without information loss if the repository throws an error during save', async () => {
      const createData = {
        appId: 1,
        firstName: 'John',
        lastName: 'Doe',
        proposedStartDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
      };

      jest
        .spyOn(mockApplicantsRepository, 'save')
        .mockImplementationOnce(() => {
          throw new Error('There was a problem saving the info');
        });

      await expect(
        service.create(
          createData.appId,
          createData.firstName,
          createData.lastName,
          createData.proposedStartDate,
          createData.endDate,
        ),
      ).rejects.toThrow(`There was a problem saving the info`);
    });
  });

  describe('findOne', () => {
    it('should throw error if id is not provided', async () => {
      await expect(service.findOne(null)).rejects.toThrow(
        'Applicant ID is required',
      );
      expect(mockApplicantsRepository.findOneBy).not.toHaveBeenCalled();
    });

    it('should find a applicant by id', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'findOneBy')
        .mockResolvedValue(applicant1);

      const result = await service.findOne(1);

      expect(result).toEqual(applicant1);
      expect(mockApplicantsRepository.findOneBy).toHaveBeenCalledWith({
        appId: 1,
      });
    });

    it('should throw error if applicant is not found', async () => {
      jest.spyOn(mockApplicantsRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        'Applicant with ID 999 not found',
      );
    });

    it('should error out without information loss if the repository throws an error during retrieval', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'findOneBy')
        .mockRejectedValueOnce(
          new Error('There was a problem retrieving the info'),
        );

      await expect(service.findOne(1)).rejects.toThrow(
        'There was a problem retrieving the info',
      );
    });
  });

  describe('findAll', () => {
    it('should return all applicants', async () => {
      const applicants = [applicant1, applicant2];
      jest
        .spyOn(mockApplicantsRepository, 'find')
        .mockResolvedValue(applicants);

      const result = await service.findAll();

      expect(result).toEqual(applicants);
      expect(mockApplicantsRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no applicants exist', async () => {
      jest.spyOn(mockApplicantsRepository, 'find').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should error out without information loss if the repository throws an error during retrieval', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'find')
        .mockRejectedValueOnce(
          new Error('There was a problem retrieving the info'),
        );

      await expect(service.findAll()).rejects.toThrow(
        'There was a problem retrieving the info',
      );
    });
  });

  describe('findByAppId', () => {
    it('should find applicants by app id', async () => {
      const applicants = [applicant1];
      jest
        .spyOn(mockApplicantsRepository, 'find')
        .mockResolvedValue(applicants);

      const result = await service.findByAppId(1);

      expect(result).toEqual(applicants);
      expect(mockApplicantsRepository.find).toHaveBeenCalledWith({
        where: { appId: 1 },
      });
    });

    it('should return empty array when no applicants found for app id', async () => {
      jest.spyOn(mockApplicantsRepository, 'find').mockResolvedValue([]);

      const result = await service.findByAppId(999);

      expect(result).toEqual([]);
    });

    it('should throw error if appId is invalid', async () => {
      await expect(service.findByAppId(0)).rejects.toThrow(
        'Valid app ID is required',
      );
    });

    it('should error out without information loss if the repository throws an error during retrieval', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'find')
        .mockRejectedValueOnce(
          new Error('There was a problem retrieving the info'),
        );

      await expect(service.findByAppId(8)).rejects.toThrow(
        'There was a problem retrieving the info',
      );
    });
  });

  describe('updateproposedStartDate', () => {
    const updatedproposedStartDate = new Date('2024-02-01');
    const updatedApplicant = {
      ...applicant1,
      proposedStartDate: updatedproposedStartDate,
    };

    it('should update applicant proposed start date', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'findOneBy')
        .mockResolvedValue(applicant1);
      jest
        .spyOn(mockApplicantsRepository, 'save')
        .mockResolvedValue(updatedApplicant);

      const result = await service.updateproposedStartDate(
        1,
        updatedproposedStartDate,
      );

      expect(result).toEqual(updatedApplicant);
      expect(mockApplicantsRepository.findOneBy).toHaveBeenCalledWith({
        appId: 1,
      });
      expect(mockApplicantsRepository.save).toHaveBeenCalledWith({
        ...applicant1,
        proposedStartDate: updatedproposedStartDate,
      });
    });

    it('should throw error if applicant is not found', async () => {
      jest.spyOn(mockApplicantsRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.updateproposedStartDate(999, updatedproposedStartDate),
      ).rejects.toThrow('Applicant with ID 999 not found');
    });

    it('should throw error if proposed start date is after end date', async () => {
      const existingApplicant = {
        ...applicant1,
        endDate: new Date('2024-01-15'),
      };
      jest
        .spyOn(mockApplicantsRepository, 'findOneBy')
        .mockResolvedValue(existingApplicant);

      await expect(
        service.updateproposedStartDate(1, updatedproposedStartDate),
      ).rejects.toThrow('proposed start date must be before end date');
    });

    it('should throw error if no proposed start date provided', async () => {
      await expect(service.updateproposedStartDate(1, null)).rejects.toThrow(
        'proposed start date is required',
      );
    });

    it('should throw error if proposed start date is invalid', async () => {
      await expect(
        service.updateproposedStartDate(1, new Date('not-a-date')),
      ).rejects.toThrow('proposed start date must be a valid date');
    });

    it('should error out without information loss if the repository throws an error during retrieval', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'findOneBy')
        .mockRejectedValueOnce(
          new Error('There was a problem retrieving the info'),
        );

      await expect(
        service.updateproposedStartDate(999, updatedproposedStartDate),
      ).rejects.toThrow('There was a problem retrieving the info');
    });

    it('should error out without information loss if the repository throws an error during save', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'findOneBy')
        .mockResolvedValue(applicant1);
      jest
        .spyOn(mockApplicantsRepository, 'save')
        .mockRejectedValueOnce(
          new Error('There was a problem saving the info'),
        );

      await expect(
        service.updateproposedStartDate(1, updatedproposedStartDate),
      ).rejects.toThrow('There was a problem saving the info');
    });
  });

  describe('updateEndDate', () => {
    const updatedEndDate = new Date('2024-07-31');
    const updatedApplicant = { ...applicant1, endDate: updatedEndDate };

    it('should update applicant end date', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'findOneBy')
        .mockResolvedValue(applicant1);
      jest
        .spyOn(mockApplicantsRepository, 'save')
        .mockResolvedValue(updatedApplicant);

      const result = await service.updateEndDate(1, updatedEndDate);

      expect(result).toEqual(updatedApplicant);
      expect(mockApplicantsRepository.findOneBy).toHaveBeenCalledWith({
        appId: 1,
      });
      expect(mockApplicantsRepository.save).toHaveBeenCalledWith({
        ...applicant1,
        endDate: updatedEndDate,
      });
    });

    it('should throw error if applicant is not found', async () => {
      jest.spyOn(mockApplicantsRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.updateEndDate(999, updatedEndDate)).rejects.toThrow(
        'Applicant with ID 999 not found',
      );
    });

    it('should throw error if end date is before proposed start date', async () => {
      const existingApplicant = {
        ...applicant1,
        proposedStartDate: new Date('2024-08-15'),
      };
      jest
        .spyOn(mockApplicantsRepository, 'findOneBy')
        .mockResolvedValue(existingApplicant);

      await expect(service.updateEndDate(1, updatedEndDate)).rejects.toThrow(
        'End date must be after proposed start date',
      );
    });

    it('should throw error if no end date provided', async () => {
      await expect(service.updateEndDate(1, null)).rejects.toThrow(
        'End date is required',
      );
    });

    it('should throw error if end date is invalid', async () => {
      await expect(
        service.updateEndDate(1, new Date('not-a-date')),
      ).rejects.toThrow('End date must be a valid date');
    });

    it('should error out without information loss if the repository throws an error during retrieval', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'findOneBy')
        .mockRejectedValueOnce(
          new Error('There was a problem retrieving the info'),
        );

      await expect(service.updateEndDate(999, updatedEndDate)).rejects.toThrow(
        'There was a problem retrieving the info',
      );
    });

    it('should error out without information loss if the repository throws an error during save', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'findOneBy')
        .mockResolvedValue(applicant1);
      jest
        .spyOn(mockApplicantsRepository, 'save')
        .mockRejectedValueOnce(
          new Error('There was a problem saving the info'),
        );

      await expect(service.updateEndDate(1, updatedEndDate)).rejects.toThrow(
        'There was a problem saving the info',
      );
    });
  });

  describe('delete', () => {
    it('should delete a learner successfully', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'findOneBy')
        .mockResolvedValue(applicant1);
      jest
        .spyOn(mockApplicantsRepository, 'remove')
        .mockResolvedValue(applicant1);

      const result = await service.delete(1);

      // returns the deleted applicant
      expect(result).toEqual(applicant1);
      expect(mockApplicantsRepository.findOneBy).toHaveBeenCalledWith({
        appId: 1,
      });
      expect(mockApplicantsRepository.remove).toHaveBeenCalledWith(applicant1);
    });

    it('should throw NotFoundException if learner is not found', async () => {
      jest.spyOn(mockApplicantsRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow(
        new NotFoundException('Applicant with ID 999 not found'),
      );
      expect(mockApplicantsRepository.findOneBy).toHaveBeenCalledWith({
        appId: 999,
      });
      expect(mockApplicantsRepository.remove).not.toHaveBeenCalled();
    });

    it('should error out without information loss if the repository throws an error during retrieval', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'findOneBy')
        .mockRejectedValueOnce(
          new Error('There was a problem retrieving the info'),
        );

      await expect(service.delete(1)).rejects.toThrow(
        'There was a problem retrieving the info',
      );
      expect(mockApplicantsRepository.remove).not.toHaveBeenCalled();
    });

    it('should error out without information loss if the repository throws an error during removal', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'findOneBy')
        .mockResolvedValue(applicant1);
      jest
        .spyOn(mockApplicantsRepository, 'remove')
        .mockRejectedValueOnce(
          new Error('There was a problem removing the info'),
        );

      await expect(service.delete(1)).rejects.toThrow(
        'There was a problem removing the info',
      );
      expect(mockApplicantsRepository.findOneBy).toHaveBeenCalledWith({
        appId: 1,
      });
      expect(mockApplicantsRepository.remove).toHaveBeenCalledWith(applicant1);
    });
  });
});
