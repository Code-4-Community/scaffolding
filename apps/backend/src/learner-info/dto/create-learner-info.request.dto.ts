import { IsBoolean, IsEnum, IsNumber, IsDefined, Min } from 'class-validator';
import { ExperienceType, InterestArea, School } from '../types';

/**
 * Defines the expected shape of data for creating a learner info
 *
 * DTO - data transfer object (defines and validates the structure of data sent over the network).
 */
export class CreateLearnerInfoDto {
  /**
   * The id corresponding to the application this information belongs to
   */
  @IsNumber()
  @Min(0)
  @IsDefined()
  appId!: number;

  /**
   * School of the applicant; includes well-known medical schools or an 'other' option.
   *
   * Example: School.STANFORD_MEDICINE.
   */
  @IsEnum(School)
  @IsDefined()
  school!: School;
}
