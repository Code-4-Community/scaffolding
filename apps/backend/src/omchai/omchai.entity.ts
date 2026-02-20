import { Anthology } from 'src/anthology/anthology.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

export enum OmchaiRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  CONSULTED = 'CONSULTED',
  HELPER = 'HELPER',
  APPROVER = 'APPROVER',
  INFORMED = 'INFORMED',
}

@Entity()
export class Omchai {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'anthology_id' })
  anthologyId: number;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({
    type: 'enum',
    enum: OmchaiRole,
  })
  role: OmchaiRole;

  @Column({ type: 'date', name: 'datetime_assigned' })
  datetimeAssigned: Date;
}
