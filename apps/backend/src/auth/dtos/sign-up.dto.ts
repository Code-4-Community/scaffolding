import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Defines the expected shape of data when a user desires to sign up to the system.
 *
 * DTO - data transfer object (defines and validates the structure of data sent over the network).
 */
export class SignUpDto {
  /**
   * The first name of the user.
   *
   * Example: 'Jane'.
   */
  @IsString()
  @IsNotEmpty()
  firstName: string;

  /**
   * The last name of the user.
   *
   * Example: 'Doe'.
   */
  @IsString()
  @IsNotEmpty()
  lastName: string;

  /**
   * The email of the user.
   *
   * Example: 'Jane.doe@northeastern.edu'.
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * The password of the user.
   *
   * TODO: Clarify whether this is in plain text or in an encrypted format.
   */
  @IsString()
  @IsNotEmpty()
  password: string;
}
