// Cognito ID token: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-id-token.html
// Cognito access token: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-access-token.html

export interface CognitoJwtPayload {
  sub: string; // Subject (unique identifier for the user)
  'cognito:groups'?: string[]; // Groups (ex: ['admin', 'user'])
  iss: string; // Issuer (ex: https://cognito-idp.<Region>.amazonaws.com/<your user pool ID>)
  token_use?: 'id' | 'access'; // Token use (ID or access token from Cognito)
  aud?: string; // Audience: Client ID this token is intended for (ex: <your client ID>)
  client_id?: string; // Client ID used during authentication (ex: <your client ID>)
  exp: number; // Expiration time (Unix timestamp)
  iat: number; // Issued at time (Unix timestamp)
  email?: string; // Email (ex: test@example.com)
}
