import { Button } from '@chakra-ui/react';

export type StatusVariant =
  | 'submitted'
  | 'review'
  | 'formsSent'
  | 'accepted'
  | 'declined'
  | 'noAvailability'
  | 'active'
  | 'inactive';

type StatusPillProps = {
  variant: StatusVariant;
  children: React.ReactNode;
};

export const StatusPillConfig: Record<
  StatusVariant,
  { label: string; background: string; border: string }
> = {
  submitted: {
    label: 'Submitted',
    background: '#FFF9E6',
    border: '#B8AF98',
  },
  review: {
    label: 'Review',
    background: '#DBEAFE',
    border: '#2563EB',
  },
  formsSent: {
    label: 'Forms Sent',
    background: '#E9D5FF',
    border: '#9333EA',
  },
  accepted: {
    label: 'Accepted',
    background: '#F1F7EC',
    border: '#6AB242',
  },
  declined: {
    label: 'Declined',
    background: '#FFD1D2',
    border: '#E91E21',
  },
  noAvailability: {
    label: 'No Availability',
    background: '#0000004D',
    border: '#000000',
  },
  active: {
    label: 'Active',
    background: '#A7F3D0',
    border: '#047857',
  },
  inactive: {
    label: 'Inactive',
    background: '#F1F5F9',
    border: '#686868',
  },
};

export default function StatusPill({ variant, children }: StatusPillProps) {
  const style = StatusPillConfig[variant];

  return (
    <Button
      display="inline-flex"
      px="12px"
      py="5px"
      justifyContent="center"
      alignItems="center"
      gap="6px"
      borderRadius="36px"
      border={`1px solid ${style.border}`}
      bg={style.background}
      fontWeight="normal"
      height="28px"
      color="black"
    >
      {children}
    </Button>
  );
}
