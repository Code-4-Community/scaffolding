import { Status } from 'src/users/types';
import { User } from 'src/users/user.entity';
import { DeepPartial } from 'typeorm';

export const UsersSeed: DeepPartial<User>[] = [
  {
    id: 1,
    status: Status.ADMIN,
    firstName: 'Richie',
  },
  {
    id: 2,
    status: Status.ADMIN,
    firstName: 'Kanyin',
  },
  {
    id: 3,
    status: Status.ADMIN,
    firstName: 'Mirn',
  },
  {
    id: 4,
    status: Status.ADMIN,
    firstName: 'Ms. F',
  },
  {
    id: 5,
    status: Status.ADMIN,
    firstName: 'Tony',
    lastName: 'King',
  },
];
