import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ExperienceType, InterestArea, School } from './types';

/**
 * Represents the desired columns for the database table in the repository for the system's learner info.
 */
@Entity('learner_info')
export class LearnerInfo {
  /**
   * The id corresponding to the application this information belongs to
   */
  @PrimaryColumn()
  appId!: number;

  /**
   * School of the applicant; includes well-known medical schools or an 'other' option.
   *
   * Example: School.STANFORD_MEDICINE.
   */
  @Column({ type: 'enum', enum: School })
  school!: School;
}
