import { IsEmail, IsString } from 'class-validator';

/**
 * Defines the expected shape of data when verifying a user
 *
 * DTO - data transfer object (defines and validates the structure of data sent over the network)
 */
export class VerifyUserDto {
  /**
   * The email of the user to verify
   *
   * Example: 'Jane.doe@northeastern.edu'
   */
  @IsEmail()
  email: string;

  /**
   * The verification code to confirm with the external auth provider
   *
   * TODO: Clarify how this code is obtained and if there is a standard format
   */
  @IsString()
  verificationCode: string;
}
