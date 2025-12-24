import { IsPositive } from 'class-validator';

/**
 * Defines the expected shape of data for deleteing a user
 *
 * DTO - data transfer object (defines and validates the structure of data sent over the network)
 */
export class DeleteUserDto {
  /**
   * The id of the user within the repository to delete
   */
  @IsPositive()
  userId: number;
}
