import { recurringInterval } from '../../donations/donation.entity';

export function normalizeInterval(
  input: string | null,
): recurringInterval | null {
  if (!input) {
    return null;
  }

  const normalized = input.toLowerCase().trim();

  return Object.values(recurringInterval).includes(
    normalized as recurringInterval,
  )
    ? (normalized as recurringInterval)
    : null;
}

export function normalizeDonorName(
  input: string | null,
  anonymous: boolean,
): string | null {
  return anonymous ? null : input;
}

export function normalizeDonationAmount(amount: string | number): number {
  const num = Number(amount);

  return isFinite(num) ? num : 0;
}
