import { Entity, Column, PrimaryColumn } from 'typeorm';

/**
 * Represents the desired columns for the database table in the repository for the system's applicants.
 */
@Entity()
export class Applicant {
  /**
   * The Applicant's email.
   *
   * Example: 'jane.doe@northeastern.edu'.
   */
  @PrimaryColumn({ name: 'email' })
  email: string;

  /**
   * Corresponding application id of the applicant.
   */
  @Column({ name: 'app_id' })
  appId: number;
}
