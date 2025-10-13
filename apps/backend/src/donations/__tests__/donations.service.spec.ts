import { Test } from '@nestjs/testing';
import { DonationsService } from '../donations.service';
import { Donation, donationType, recurringInterval } from '../donation.entity';
import { Repository } from 'typeorm/repository/Repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateDonationDTO, DonationResponseDTO } from '../dtos';
import { BadRequestException } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';

// mock donations

// invalid donation: non positive donation amount
const invalidAmountDonation: CreateDonationDTO = {
  firstName: 'John',

  lastName: 'Smith',

  email: 'john.smith@gmail.com',

  amount: -500,

  isAnonymous: true,

  donationType: donationType.OneTime,
};

// invalid donation: recurring donation but no interval
const invalidRecurringDonation: CreateDonationDTO = {
  firstName: 'John',

  lastName: 'Smith',

  email: 'john.smith@gmail.com',

  amount: 500,

  isAnonymous: true,

  donationType: donationType.Recurring,
};

// invalid donation: one time but interval
const invalidOneTimeDonation: CreateDonationDTO = {
  firstName: 'John',

  lastName: 'Smith',

  email: 'john.smith@gmail.com',

  amount: 500,

  isAnonymous: true,

  donationType: donationType.OneTime,

  recurringInterval: recurringInterval.BiMonthly,
};

// invalid donation: email is not well formed
const invalidEmailDonation: CreateDonationDTO = {
  firstName: 'John',

  lastName: 'Smith',

  email: 'gmail',

  amount: 500,

  isAnonymous: true,

  donationType: donationType.OneTime,
};

// valid donation
const validCreateDonation1: CreateDonationDTO = {
  firstName: 'John',

  lastName: 'Smith',

  email: 'john.smith@gmail.com',

  amount: 500,

  isAnonymous: true,

  donationType: donationType.OneTime,

  dedicationMessage: '',

  showDedicationPublicly: false,
};

// valid donation
const validDonation1: Donation = {
  id: 0,

  firstName: 'John',

  lastName: 'Smith',

  email: 'john.smith@gmail.com',

  amount: 500,

  isAnonymous: true,

  donationType: donationType.OneTime,

  dedicationMessage: '',

  showDedicationPublicly: false,

  createdAt: new Date(2025, 6, 4),

  updatedAt: new Date(2026, 7, 1),

  recurringInterval: undefined,
};

const validDonation2: Donation = {
  id: 1,

  firstName: 'Sally',

  lastName: 'Smith',

  email: 'sally.smith@gmail.com',

  amount: 700,

  isAnonymous: false,

  donationType: donationType.OneTime,

  showDedicationPublicly: true,

  createdAt: new Date(2025, 6, 4),

  updatedAt: new Date(2026, 7, 1),

  recurringInterval: undefined,

  dedicationMessage: '',
};

const allDonations: Donation[] = [validDonation1, validDonation2];

const expectedDonations: DonationResponseDTO[] = allDonations.map(
  (donation) => {
    return {
      id: donation.id,

      stored: {
        firstName: donation.firstName,
        lastName: donation.lastName,
        email: donation.email,
        amount: donation.amount,
        isAnonymous: donation.isAnonymous,
        donationType: donation.donationType,
        recurringInterval: donation.recurringInterval,
        dedicationMessage: donation.dedicationMessage,
        showDedicationPublicly: donation.showDedicationPublicly,
      },

      createdAt: donation.createdAt.toISOString(),

      updatedAt: donation.updatedAt.toISOString(),
    };
  },
);

describe('DonationsService', () => {
  let service: DonationsService;
  let repo: jest.Mocked<Repository<Donation>>;

  beforeAll(async () => {
    const repoMock = {
      save: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<Donation>>;

    const app = await Test.createTestingModule({
      providers: [
        DonationsService,
        { provide: getRepositoryToken(Donation), useValue: repoMock },
      ],
    }).compile();

    service = app.get<DonationsService>(DonationsService);
    repo = app.get(getRepositoryToken(Donation));
    repo.find.mockResolvedValue(allDonations);
    repo.find.mockImplementation((options?: FindManyOptions<Donation>) => {
      const where = options?.where;
      const isPublicQuery =
        where &&
        !Array.isArray(where) &&
        (where as FindOptionsWhere<Donation>).showDedicationPublicly === true;
      const publicDonations = allDonations.filter(
        (donation) => donation.showDedicationPublicly,
      );
      return Promise.resolve(isPublicQuery ? publicDonations : allDonations);
    });
    repo.save.mockResolvedValue(validDonation1);
    repo.findOne.mockImplementation(
      async (options?: FindOneOptions<Donation>) => {
        const where = options?.where;
        if (where && !Array.isArray(where)) {
          const id = (where as FindOptionsWhere<Donation>).id;
          if (id !== undefined && id !== null) {
            const donation = allDonations.find((d) => d.id === id);
            return donation ?? null;
          }
        }

        return null;
      },
    );
  });

  describe('Create donation method', () => {
    it('should throw an error if the donation amount is not positive', async () => {
      await expect(service.create(invalidAmountDonation)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if the donation email is not well formed', async () => {
      await expect(service.create(invalidEmailDonation)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if one time donation has recurring interval', async () => {
      await expect(service.create(invalidOneTimeDonation)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if recurring donation does not have interval set', async () => {
      await expect(service.create(invalidRecurringDonation)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return createDonationDTO if valid donation created', async () => {
      repo.create.mockReturnValue(validDonation1);
      repo.save.mockResolvedValue(validDonation1);
      const createReturned = await service.create(validCreateDonation1);

      expect(createReturned.stored).toEqual({
        id: createReturned.id,
        firstName: validCreateDonation1.firstName,
        lastName: validCreateDonation1.lastName,
        email: validCreateDonation1.email,
        amount: validCreateDonation1.amount,
        isAnonymous: validCreateDonation1.isAnonymous,
        donationType: validCreateDonation1.donationType,
        recurringInterval: validCreateDonation1.recurringInterval,
        dedicationMessage: validCreateDonation1.dedicationMessage,
        showDedicationPublicly: validCreateDonation1.showDedicationPublicly,
        createdAt: new Date(createReturned.createdAt),
        updatedAt: new Date(createReturned.updatedAt),
      });
    });
  });

  describe('Find all donations method', () => {
    it('should return createDonationDTO if valid donation', async () => {
      const findDonations = await service.findAll();
      expect(findDonations).toEqual(expectedDonations);
    });
  });

  describe('Find public donations method', () => {
    it('should return all public donations', async () => {
      const publicDonations = await service.findPublic();
      expect(publicDonations).toEqual([
        {
          id: validDonation2.id,

          amount: validDonation2.amount,

          donationType: validDonation2.donationType,

          dedicationMessage: validDonation2.dedicationMessage,

          isAnonymous: validDonation2.isAnonymous,

          donorName: validDonation2.isAnonymous
            ? 'Anonymous'
            : validDonation2.firstName + ' ' + validDonation2.lastName,

          createdAt: validDonation2.createdAt.toISOString(),
        },
      ]);
    });
  });

  describe('Find one donation method', () => {
    it('should find donation by id', async () => {
      const findDonation0 = await service.findOne(0);
      const findDonation1 = await service.findOne(1);
      const findDonation2 = await service.findOne(2);

      expect(findDonation0).toEqual(
        expectedDonations.find((d) => d.id === 0) ?? null,
      );
      expect(findDonation1).toEqual(
        expectedDonations.find((d) => d.id === 1) ?? null,
      );
      expect(findDonation2).toEqual(
        expectedDonations.find((d) => d.id === 2) ?? null,
      );
    });
  });

  describe('Get total donations method', () => {
    it('should find total amount and count of all donations', async () => {
      const { total, count } = await service.getTotalDonations();
      expect({ total, count }).toEqual({
        total: validDonation1.amount + validDonation2.amount,
        count: 2,
      });
    });
  });
});
