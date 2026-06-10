// Cognito ID token: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-id-token.html
// Cognito access token: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-access-token.html

export interface CognitoJwtPayload {
  sub: string; // Subject (unique identifier for the user)
  'cognito:groups'?: string[]; // Groups (ex: ['admin', 'user'])
  iss: string; // Issuer (ex: https://cognito-idp.<Region>.amazonaws.com/<your user pool ID>)
  token_use: 'id' | 'access'; // Token use (ID or access token from Cognito)
  aud?: string | string[]; // Audience: Client ID this token is intended for (ex: <your client ID>)
  client_id?: string; // Client ID used during authentication (ex: <your client ID>)
  exp: number; // Expiration time (Unix timestamp)
  iat: number; // Issued at time (Unix timestamp)
  email?: string; // Email (ex: test@example.com)
}

// Runtime type guard for CognitoJwtPayload. jwt.verify proves the token is
// authentic, but not that the decoded claims have the shape we expect, so we
// validate the required fields here before trusting the payload.
export function isCognitoJwtPayload(
  value: unknown,
): value is CognitoJwtPayload {
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
