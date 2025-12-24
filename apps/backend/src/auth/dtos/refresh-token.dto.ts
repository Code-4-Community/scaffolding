import { IsString } from 'class-validator';

/**
 * Defines the expected shape of data for initating a process for when the user
 * needs to refresh their session token
 *
 * DTO - data transfer object (defines and validates the structure of data sent over the network)
 */
export class RefreshTokenDto {
  // TODO: Clarify what this is
  @IsString()
  refreshToken: string;

  // TODO: Clarify what this is
  @IsString()
  userSub: string;
}
