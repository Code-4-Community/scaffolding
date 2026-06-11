// We only use access tokens to verify the user's identity and allow access to protected resources.
// Cognito access token: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-access-token.html
export interface AccessTokenPayload {
  sub: string; // Subject (unique identifier for the user)
  'cognito:groups'?: string[]; // Groups (ex: ['admin', 'user'])
  iss: string; // Issuer (ex: https://cognito-idp.<Region>.amazonaws.com/<your user pool ID>)
  token_use: 'access'; // Token use (ID or access token from Cognito)
  client_id?: string; // Client ID used during authentication (ex: <your client ID>)
  exp: number; // Expiration time (Unix timestamp)
  iat: number; // Issued at time (Unix timestamp)
  email?: string; // Email (ex: test@example.com)
}

/**
 * Runtime type guard for {@link AccessTokenPayload}.
 *
 * @param value - The value to check, typically a decoded JWT payload.
 * @returns `true` if `value` matches the {@link AccessTokenPayload} shape.
 */
export function isAccessTokenPayload(
  value: unknown,
): value is AccessTokenPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const payload = value as Record<string, unknown>;
  return (
    typeof payload.sub === 'string' &&
    typeof payload.iss === 'string' &&
    typeof payload.token_use === 'string' &&
    typeof payload.exp === 'number' &&
    typeof payload.iat === 'number'
  );
}
