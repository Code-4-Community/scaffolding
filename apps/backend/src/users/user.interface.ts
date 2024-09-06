import { Status } from './types';

// Hash key/partition key for the User table
export interface UserKey {
  id: string;
}

// Interface for a User record
export interface User extends UserKey {
  status: Status;
  firstName: string;
  lastName: string;
  email: string;
}
