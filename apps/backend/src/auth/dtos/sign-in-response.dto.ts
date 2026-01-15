// TODO: Add validators from 'class-validator' package or find out why there aren't validators here?

import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Defines the expected shape of data to be passed into API requests.
 *
 * DTO - data transfer object (defines and validates the structure of data sent over the network).
 */
export class SignInResponseDto {
  /**
   * The JWT access token to be passed in API requests.
   * @example eyJ...
   */
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  /**
   * The JWT refresh token to maintain user sessions by requesting new access tokens.
   * @example eyJ...
   */
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  /**
   * The JWT ID token that carries the user's information.
   * @example eyJ...
   */
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
