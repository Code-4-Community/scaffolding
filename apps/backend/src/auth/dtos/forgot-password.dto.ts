import { IsEmail } from 'class-validator';

/**
 * Defines the expected shape of data for initiating a process for when the user
 * forgets their password.
 *
 * DTO - data transfer object (defines and validates the structure of data sent over the network).
 */
export class ForgotPasswordDto {
  /**
   * The email of the user to initiate the forgot password process for.
   *
   * Example: 'Jane.Doe@northeastern.edu'.
   */
  @IsEmail()
  email: string;
}
