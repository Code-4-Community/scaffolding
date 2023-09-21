import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import type { Status } from './types';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  status: Status;
}
