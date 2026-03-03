import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { ApplicantsService } from './candidate-info.service';
import { Applicant } from './candidate-info.entity';
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
  email: 'john@example.com',
});
const applicant2: Applicant = applicantFactory({
  appId: 2,
  email: 'jane@example.com',
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
        email: 'john@example.com',
      };

      jest
        .spyOn(mockApplicantsRepository, 'create')
        .mockReturnValue(applicant1);
      jest
        .spyOn(mockApplicantsRepository, 'save')
        .mockResolvedValue(applicant1);

      const result = await service.create(createData.appId, createData.email);

      expect(result).toEqual(applicant1);
      expect(mockApplicantsRepository.create).toHaveBeenCalledWith(createData);
      expect(mockApplicantsRepository.save).toHaveBeenCalledWith(applicant1);
    });

    it('should throw error if appId is invalid', async () => {
      await expect(service.create(0, 'john@example.com')).rejects.toThrow(
        'Valid app ID is required',
      );
    });

    it('should throw error if email is empty', async () => {
      await expect(service.create(1, '')).rejects.toThrow(
        'Applicant email is required',
      );
    });

    it('should error out without information loss if the repository throws an error during create', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'create')
        .mockImplementationOnce(() => {
          throw new Error('There was a problem retrieving the info');
        });

      await expect(service.create(1, 'john@example.com')).rejects.toThrow(
        `There was a problem retrieving the info`,
      );
    });

    it('should error out without information loss if the repository throws an error during save', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'save')
        .mockImplementationOnce(() => {
          throw new Error('There was a problem saving the info');
        });

      await expect(service.create(1, 'john@example.com')).rejects.toThrow(
        `There was a problem saving the info`,
      );
    });
  });

  describe('findOne', () => {
    it('should throw error if email is not provided', async () => {
      await expect(service.findOne('')).rejects.toThrow(
        'Applicant email is required',
      );
      expect(mockApplicantsRepository.findOneBy).not.toHaveBeenCalled();
    });

    it('should find an applicant by email', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'findOneBy')
        .mockResolvedValue(applicant1);

      const result = await service.findOne('john@example.com');

      expect(result).toEqual(applicant1);
      expect(mockApplicantsRepository.findOneBy).toHaveBeenCalledWith({
        email: 'john@example.com',
      });
    });

    it('should throw error if applicant is not found', async () => {
      jest.spyOn(mockApplicantsRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne('notfound@example.com')).rejects.toThrow(
        'Applicant with email notfound@example.com not found',
      );
    });

    it('should error out without information loss if the repository throws an error during retrieval', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'findOneBy')
        .mockRejectedValueOnce(
          new Error('There was a problem retrieving the info'),
        );

      await expect(service.findOne('john@example.com')).rejects.toThrow(
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

  describe('delete', () => {
    it('should delete an applicant successfully', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'findOneBy')
        .mockResolvedValue(applicant1);
      jest
        .spyOn(mockApplicantsRepository, 'remove')
        .mockResolvedValue(applicant1);

      const result = await service.delete('john@example.com');

      expect(result).toEqual(applicant1);
      expect(mockApplicantsRepository.findOneBy).toHaveBeenCalledWith({
        email: 'john@example.com',
      });
      expect(mockApplicantsRepository.remove).toHaveBeenCalledWith(applicant1);
    });

    it('should throw NotFoundException if applicant is not found', async () => {
      jest.spyOn(mockApplicantsRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.delete('notfound@example.com')).rejects.toThrow(
        new NotFoundException(
          'Applicant with email notfound@example.com not found',
        ),
      );
      expect(mockApplicantsRepository.findOneBy).toHaveBeenCalledWith({
        email: 'notfound@example.com',
      });
      expect(mockApplicantsRepository.remove).not.toHaveBeenCalled();
    });

    it('should error out without information loss if the repository throws an error during retrieval', async () => {
      jest
        .spyOn(mockApplicantsRepository, 'findOneBy')
        .mockRejectedValueOnce(
          new Error('There was a problem retrieving the info'),
        );

      await expect(service.delete('john@example.com')).rejects.toThrow(
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

      await expect(service.delete('john@example.com')).rejects.toThrow(
        'There was a problem removing the info',
      );
      expect(mockApplicantsRepository.findOneBy).toHaveBeenCalledWith({
        email: 'john@example.com',
      });
      expect(mockApplicantsRepository.remove).toHaveBeenCalledWith(applicant1);
    });
  });
});
