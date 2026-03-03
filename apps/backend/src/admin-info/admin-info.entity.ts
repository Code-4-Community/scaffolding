import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DISCIPLINE_VALUES } from '../disciplines/disciplines.constants';

/**
 * Represents the desired columns for the database table
 * in the repository for the system's admins.
 */
@Entity('admins')
export class Admin {
  /**
   * Email of the admin.
   *
   * Example: 'jane.doe@northeastern.edu'.
   */
  @PrimaryColumn()
  email: string;

  /**
   * Discipline of the admin.
   */
  @Column({ type: 'enum', enum: DISCIPLINE_VALUES })
  discipline: DISCIPLINE_VALUES;

  /**
   * When the admin was created stored in YYYY-MM-DD format.
   *
   * Example: new Date('2025-01-30').
   */
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  /**
   * When the admin was last updated stored in YYYY-MM-DD format.
   *
   * Example: new Date('2025-01-30').
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
