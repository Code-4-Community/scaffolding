import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';
import { AppStatus, ExperienceType, InterestArea, School } from '../types';

/**
 * Defines the expected shape of data for creating an application
 *
 * DTO - data transfer object (defines and validates the structure of data sent over the network)
 */
export class CreateApplicationDto {
  /**
   * Status of the application
   *
   * Example: AppStatus.APP_SUBMITTED
   */
  @IsEnum(AppStatus)
  appStatus: AppStatus;

  /**
   * Availability of the applicant
   *
   * Example: 'Monday, Tuesday'
   */
  @IsString()
  daysAvailable: string;

  /**
   * Experience type/ level of the applicant
   *
   * ExperienceType.BS
   */
  @IsEnum(ExperienceType)
  experienceType: ExperienceType;

  @IsArray()
  @IsString({ each: true })
  fileUploads: string[];

  /**
   * Applicant's area of interest
   *
   * Example: InterestArea.NURSING
   */
  @IsEnum(InterestArea)
  interest: InterestArea;

  @IsString()
  license: string;

  /**
   * Whether or not the applicant is international
   *
   * Example: true
   */
  @IsBoolean()
  isInternational: boolean;

  /**
   * Whether or not the applicant is a learner, e.g. a student
   *
   * Example: true
   */
  @IsBoolean()
  isLearner: boolean;

  /**
   * Phone number of the applicant
   *
   * Example: "123-456-7890'
   */
  @IsString()
  phone: string;

  /**
   * School of the applicant, includes well-known medical schools, or an other option
   *
   * Example: School.STANFORD_MEDICINE
   */
  @IsEnum(School)
  school: School;

  /**
   * Whether or not the applicant was referred by someone else
   *
   * Example: false
   */
  @IsBoolean()
  @IsOptional()
  referred?: boolean;

  /**
   * The email of the person who referred this applicant, if applicable
   *
   * Example: jane.doe@example.com
   */
  @IsString()
  @IsOptional()
  referredEmail?: string;

  /**
   * Applicant's desired commitment in amount of hours per week
   *
   * Example: 20
   */
  @IsNumber()
  weeklyHours: number;
}
