import { donationType } from '../donation.entity';

export class PublicDonationDTO {
  id: number;

  amount: number;

  donationType: donationType;

  dedicationMessage?: string | null;

  isAnonymous: boolean;

  donorName?: string | null;

  createdAt: string;
}
