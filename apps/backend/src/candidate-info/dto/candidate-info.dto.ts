import {
  IsString,
  IsNotEmpty,
  IsDefined,
  IsInt,
  IsPositive,
  IsEmail,
} from 'class-validator';

/**
 * Defines the expected shape of data for creating an applicant (candidate info).
 *
 * DTO - data transfer object (defines and validates the structure of data sent over the network).
 */
export class CreateApplicantDto {
  /**
   * Corresponding application id number.
   */
  @IsInt()
  @IsPositive()
  @IsDefined()
  appId: number;

  /**
   * The applicant's email (primary key for candidate info).
   *
   * Example: 'jane.doe@example.com'.
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
