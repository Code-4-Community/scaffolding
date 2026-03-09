import { Entity, Column, PrimaryColumn } from 'typeorm';
import { School } from './types';

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

  /**
   * Name of school if chose other
   *
   * Example: Northeastern University
   */
  @Column({ type: 'varchar', nullable: true })
  otherSchool?: string;

  /**
   * Name of the department in the school studied in if relevent
   *
   * Example: Infectious Diseases
   */
  @Column({ type: 'varchar', nullable: true })
  schoolDepartment?: string;

  /**
   * Applying as themselves or applying as a supervisor
   *
   * Example: true
   */
  @Column({ type: 'boolean' })
  isSupervisorApplying: boolean;

  /**
   * Whether the applicant is over 18 years old
   *
   * Example: true
   */
  @Column({ type: 'boolean' })
  isLegalAdult: boolean;

  /**
   * The birthdate of the applicant, only required if they are under 18
   *
   * Example: new Date('2024-06-30').
   */
  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  /**
   * Course requirements if volunteering fulfills some course requirement
   *
   * Example: 15 hours of patient facing work per week
   */
  @Column({ type: 'varchar', nullable: true })
  courseRequirements?: string;

  /**
   * Instructor's information if needed.
   *
   * Example: Jane Doe at khoury college of computer sciences, contact: doe.ja@northeastern.edu
   */
  @Column({ type: 'varchar', nullable: true })
  instructorInfo?: string;

  /**
   * S3 file name of course syllabus if relevant to volunteering
   *
   * Example: cs_3500_2_7_2026.pdf
   *
   * Note: In the code when accessing the files we would prepend the s3 address, e.g.
   * a full link looks like this:
   * https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp
   * But since "https://shelter-link-shelters.s3.us-east-2.amazonaws.com/" would look the same
   * for every single file we can just store the file with its extension e.g. "test_photo.webp"
   */
  @Column({ type: 'varchar', nullable: true })
  syllabus?: string;
}
