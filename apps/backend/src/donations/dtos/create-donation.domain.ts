import { donationType, recurringInterval } from '../donation.entity';

export class CreateDonationDTO {
  firstName: string;

  lastName: string;

  email: string;

  amount: number;

  isAnonymous: boolean = false;

  donationType: donationType;

  recurringInterval?: recurringInterval | null;

  dedicationMessage?: string | null;

  showDedicationPublicly?: boolean = false;
}
