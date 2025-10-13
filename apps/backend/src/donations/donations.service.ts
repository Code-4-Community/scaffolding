import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDonationDTO, DonationResponseDTO } from './dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation, donationType } from './donation.entity';
import { Repository } from 'typeorm';
import { PublicDonationDTO } from './dtos';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private donationRepository: Repository<Donation>,
  ) {}

  async create(
    createDonationDTO: CreateDonationDTO,
  ): Promise<DonationResponseDTO> {
    if (createDonationDTO.amount <= 0) {
      throw new BadRequestException('Donation amount must be positive.');
    }

    if (
      createDonationDTO.donationType == donationType.Recurring &&
      !createDonationDTO.recurringInterval
    ) {
      throw new BadRequestException(
        'Recurring donation must specify interval.',
      );
    }

    if (
      createDonationDTO.donationType == donationType.OneTime &&
      createDonationDTO.recurringInterval
    ) {
      throw new BadRequestException(
        'One time donation does not have recurring interval.',
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(createDonationDTO.email.trim())) {
      throw new BadRequestException('Invalid email format.');
    }

    const donation = await this.donationRepository.create(createDonationDTO);
    const savedDonation = await this.donationRepository.save(donation);

    return {
      id: savedDonation.id,
      stored: donation,
      createdAt: savedDonation.createdAt.toISOString(),
      updatedAt: savedDonation.updatedAt.toISOString(),
    };
  }

  async findAll(): Promise<DonationResponseDTO[]> {
    const donations: Donation[] = await this.donationRepository.find();

    const donationResponseDtos: DonationResponseDTO[] = donations.map(
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

    return donationResponseDtos;
  }

  async findPublic(): Promise<PublicDonationDTO[]> {
    const publicDonationDtos = this.donationRepository.find({
      where: { showDedicationPublicly: true },
    });

    return (await publicDonationDtos).map((dto) => {
      return {
        id: dto.id,

        amount: dto.amount,

        donationType: dto.donationType,

        dedicationMessage: dto.dedicationMessage,

        isAnonymous: dto.isAnonymous,

        donorName: dto.isAnonymous
          ? 'Anonymous'
          : dto.firstName + ' ' + dto.lastName,

        createdAt: dto.createdAt.toISOString(),
      };
    });
  }

  async findOne(id: number): Promise<DonationResponseDTO | null> {
    const donation = await this.donationRepository.findOne({
      where: { id },
    });

    if (donation === undefined || donation === null) {
      return null;
    }

    return {
      id: donation.id,
      createdAt: donation.createdAt.toISOString(),
      stored: {
        firstName: donation.firstName,
        lastName: donation.lastName,
        email: donation.email,
        amount: donation.amount,
        isAnonymous: donation.isAnonymous,
        donationType: donation.donationType,
        dedicationMessage: donation.dedicationMessage,
        recurringInterval: donation.recurringInterval,
        showDedicationPublicly: donation.showDedicationPublicly,
      },
      updatedAt: donation.updatedAt.toISOString(),
    };
  }

  async getTotalDonations(): Promise<{ total: number; count: number }> {
    const donations = await this.findAll();
    const total = donations.reduce(
      (donationsTotal: number, currentDonation: DonationResponseDTO) => {
        return donationsTotal + currentDonation.stored.amount;
      },
      0,
    );
    return { total: total, count: donations.length };
  }
}
