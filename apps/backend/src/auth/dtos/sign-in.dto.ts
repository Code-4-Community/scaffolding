import { IsEmail, IsString } from 'class-validator';

/**
 * Defines the expected shape of data when a user desires to sign in.
 *
 * DTO - data transfer object (defines and validates the structure of data sent over the network).
 */
export class SignInDto {
  /**
   * The email of the user that wants to sign in.
   *
   * Example: 'jane.doe@northeastern.edu'.
   */
  @IsEmail()
  email: string;

  /**
   * The attempted password of the user that wants to sign in.
   *
   * TODO: find out if this is in plain text or encrypted.
   */
  @IsString()
  password: string;
}
