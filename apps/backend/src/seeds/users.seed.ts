import { Role } from '../users/types';

interface UserSeedItem {
  id: number;
  role: Role;
  firstName: string;
  lastName: string;
  email: string;
  title?: string;
}

export const UsersSeed: UserSeedItem[] = [
  {
    id: 1,
    role: Role.ADMIN,
    firstName: 'Richie',
    lastName: 'Jacobs',
    email: 'richie.jacobs@gmail.com',
    title: 'Publishing Manager',
  },
  {
    id: 2,
    role: Role.ADMIN,
    firstName: 'Kanyin',
    lastName: 'Brown',
    email: 'kanyin.brown@gmail.com',
    title: 'Volunteer Manager',
  },
  {
    id: 3,
    role: Role.ADMIN,
    firstName: 'Mirn',
    lastName: 'Miller',
    email: 'mirn.miller@gmail.com',
    title: 'Program Manager',
  },
  {
    id: 4,
    role: Role.STANDARD,
    firstName: 'Kelly',
    lastName: 'Williams',
    email: 'kelly.williams@gmail.com',
    title: 'Community Partner',
  },
  {
    id: 5,
    role: Role.STANDARD,
    firstName: 'Tony',
    lastName: 'King',
    email: 'tony.king@gmail.com',
    title: 'Director of Communications',
  },
  {
    id: 6,
    role: Role.ADMIN,
    firstName: 'Jordan',
    lastName: 'Hayes',
    email: 'jordan.hayes@gmail.com',
    title: 'Director of Programs',
  },
  {
    id: 7,
    role: Role.ADMIN,
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'alex.rivera@gmail.com',
    title: 'Operations Manager',
  },
  {
    id: 8,
    role: Role.STANDARD,
    firstName: 'Sam',
    lastName: 'Chen',
    email: 'sam.chen@gmail.com',
    title: 'Event Coordinator',
  },
  {
    id: 9,
    role: Role.STANDARD,
    firstName: 'Maya',
    lastName: 'Osei',
    email: 'maya.osei@gmail.com',
    title: 'School Partner',
  },
  {
    id: 10,
    role: Role.STANDARD,
    firstName: 'Chris',
    lastName: 'Park',
    email: 'chris.park@gmail.com',
    title: 'Development Manager',
  },
];
