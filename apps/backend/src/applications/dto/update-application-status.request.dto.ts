import { IsDefined, IsEnum } from 'class-validator';
import { AppStatus } from '../types';

/**
 * Defines the expected shape of data for updating an applicant's application status.
 *
 * DTO - data transfer object (defines and validates the structure of data sent over the network).
 */
export class UpdateApplicationStatusDto {
  /**
   * The applicant's new stage or status in the application process.
   *
   * Example: AppStatus.IN_REVIEW.
   */
  @IsEnum(AppStatus, {
    message: `Status must be one of: ${Object.values(AppStatus).join(', ')}`,
  })
  @IsDefined()
  appStatus: AppStatus;
}
