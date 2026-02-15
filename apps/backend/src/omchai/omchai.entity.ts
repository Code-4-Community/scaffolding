import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'int' })
  anthology_id: number;

  @Column({ type: 'int' })
  user_id: number;

  @Column({
    type: 'enum',
    enum: OmchaiRole,
  })
  role: OmchaiRole;

  @Column({ type: 'date' })
  datetime_assigned: Date;
}
