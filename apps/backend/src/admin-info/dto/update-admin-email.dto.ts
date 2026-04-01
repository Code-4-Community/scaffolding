import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Defines the expected shape of data for updating an admin's email.
 */
export class UpdateAdminInfoEmailDto {
  /**
   * The new email to change to.
   *
   * Example: 'jane.doe@northeastern.edu'.
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
