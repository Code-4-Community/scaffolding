import {
  IsString,
  IsNotEmpty,
  IsDefined,
  Matches,
  IsInt,
  IsPositive,
} from 'class-validator';

/**
 * Defines the expected shape of data for creating a applicant.
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
   * The applicant's first name.
   *
   * Example: 'Jane'.
   */
  @IsString()
  @IsNotEmpty()
  firstName: string;

  /**
   * The applicant's last name.
   *
   * Example: 'Jane'.
   */
  @IsString()
  @IsNotEmpty()
  lastName: string;

  /**
   * The expected proposed start date for the applicant's commitment, stored in YYYY-MM-DD format.
   *
   * Example: '2024-06-30'.
   */
  @IsString()
  @IsDefined()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  proposedStartDate: string;

  /**
   * The expected end date for the applicant's commitment, stored in YYYY-MM-DD format.
   *
   * Example: '2024-06-30'.
   */
  @IsString()
  @IsDefined()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  endDate: string;
}
