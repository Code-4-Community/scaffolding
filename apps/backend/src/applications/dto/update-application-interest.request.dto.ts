import { IsEnum } from 'class-validator';
import { InterestArea } from '../types';

/**
 * Defines the expected shape of data for updating an applicant's application interest area
 *
 * DTO - data transfer object (defines and validates the structure of data sent over the network)
 */
export class UpdateApplicationInterestDto {
  /**
   * Applicant's new area of interest
   *
   * Example: InterestArea.NURSING
   */
  @IsEnum(InterestArea, {
    message: `Interest must be one of: ${Object.values(InterestArea).join(
      ', ',
    )}`,
  })
  interest: InterestArea;
}
