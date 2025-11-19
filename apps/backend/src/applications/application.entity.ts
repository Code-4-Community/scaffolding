import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { AppStatus, ExperienceType, InterestArea, School } from './types';
import { Discipline } from '../disciplines/disciplines.entity';

@Entity('application')
export class Application {
  @PrimaryGeneratedColumn()
  appId!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'int', nullable: true })
  disciplineId?: number;

  @ManyToOne(() => Discipline, { nullable: true })
  @JoinColumn({ name: 'disciplineId' })
  discipline?: Discipline;

  @Column({ type: 'enum', enum: AppStatus, default: AppStatus.APP_SUBMITTED })
  appStatus!: AppStatus;

  @Column({ type: 'varchar' })
  daysAvailable!: string;

  @Column({ type: 'enum', enum: ExperienceType })
  experienceType!: ExperienceType;

  @Column('text', { array: true, default: [] })
  fileUploads!: string[];

  @Column({ type: 'enum', enum: InterestArea })
  interest!: InterestArea;

  @Column({ type: 'varchar' })
  license!: string;

  @Column({ type: 'boolean', default: false })
  isInternational!: boolean;

  @Column({ type: 'boolean', default: false })
  isLearner!: boolean;

  @Column({ type: 'varchar' })
  phone!: string;

  @Column({ type: 'enum', enum: School })
  school!: School;

  @Column({ type: 'boolean', default: false, nullable: true })
  referred?: boolean;

  @Column({ type: 'varchar', nullable: true })
  referredEmail?: string;

  @Column({ type: 'int' })
  weeklyHours!: number;
}
