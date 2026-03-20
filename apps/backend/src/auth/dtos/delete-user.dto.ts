import { IsEmail } from 'class-validator';

/**
 * Defines the expected shape of data for deleting a user.
 */
export class DeleteUserDto {
  /**
   * The email of the user to delete.
   */
  @IsEmail()
  email: string;
}
