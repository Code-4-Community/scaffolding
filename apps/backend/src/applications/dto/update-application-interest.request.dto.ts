import { IsArray, IsDefined, IsEnum } from 'class-validator';
import { InterestArea } from '../types';

/**
 * Defines the expected shape of data for updating an applicant's application interest areas.
 *
 * DTO - data transfer object (defines and validates the structure of data sent over the network).
 */
export class UpdateApplicationInterestDto {
  /**
   * Applicant's new areas of interest (multiple select).
   *
   * Example: [InterestArea.NURSING, InterestArea.HARM_REDUCTION].
   */
  @IsArray()
  @IsEnum(InterestArea, {
    each: true,
    message: `Each interest must be one of: ${Object.values(InterestArea).join(
      ', ',
    )}`,
  })
  @IsDefined()
  interest: InterestArea[];
}
