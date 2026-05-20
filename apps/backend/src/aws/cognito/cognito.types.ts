// Type for the payload of our Cognito JWT token: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-id-token.html

export interface CognitoJwtPayload {
  sub: string; // Subject (unique identifier for the user)
  'cognito:groups': string[]; // Groups (ex: ['admin', 'user'])
  iss: string; // Issuer (ex: https://cognito-idp.<Region>.amazonaws.com/<your user pool ID>)
  token_use: 'id'; // Token use (Amplify sends ID tokens to identify the user)
  aud: string; // User pool app client that authenticated the user (ex: <your client ID>)
  exp: number; // Expiration time (Unix timestamp)
  iat: number; // Issued at time (Unix timestamp)
  email: string; // Email (ex: test@example.com)
}
