import { Entity, Column, PrimaryColumn } from 'typeorm';

/**
 * Represents the desired columns for the database table in the repository for the system's candidates.
 */
@Entity()
export class CandidateInfo {
  /**
   * The candidate's email.
   *
   * Example: 'jane.doe@northeastern.edu'.
   */
  @PrimaryColumn({ name: 'email' })
  email: string;

  /**
   * Corresponding application id of the candidate.
   */
  @Column({ name: 'app_id' })
  appId: number;
}
