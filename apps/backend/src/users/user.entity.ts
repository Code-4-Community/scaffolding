import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from './types';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  status: Status;

  @Column()
  profilePicture: string;

  @Column()
  linkedin: string;

  @Column()
  github: string;

  @Column()
  team: string;

  @Column()
  role: string;
}
