import { Role } from 'src/users/types';
import { User } from 'src/users/user.entity';
import { DeepPartial } from 'typeorm';

export const UsersSeed: DeepPartial<User>[] = [
  {
    role: Role.ADMIN,
    firstName: 'Richie',
    lastName: 'Jacobs',
    email: 'richie.jacobs@gmail.com',
    title: 'Publishing Manager',
  },
  {
    role: Role.ADMIN,
    firstName: 'Kanyin',
    lastName: 'Brown',
    email: 'kanyin.brown@gmail.com',
    title: 'Volunteer Manager',
  },
  {
    role: Role.ADMIN,
    firstName: 'Mirn',
    lastName: 'Miller',
    email: 'mirn.miller@gmail.com',
    title: 'Program Manager',
  },
  {
    role: Role.STANDARD,
    firstName: 'Kelly',
    lastName: 'Williams',
    email: 'kelly.williams@gmail.com',
    title: 'Community Partner',
  },
  {
    role: Role.STANDARD,
    firstName: 'Tony',
    lastName: 'King',
    email: 'tony.king@gmail.com',
    title: 'Director of Communications',
  },
  {
    role: Role.STANDARD,
    firstName: 'Sasha',
    lastName: 'Nguyen',
    email: 'sasha.nguyen@gmail.com',
    title: 'Program Assistant',
  },
  {
    role: Role.STANDARD,
    firstName: 'Jamie',
    lastName: 'Rivera',
    email: 'jamie.rivera@gmail.com',
    title: 'Publishing Fellow',
  },
];
