import { CognitoConfig } from './cognito.types';
import { isNonEmptyEnv } from '../../utils/env';

// Checks if the authentication is enabled
export function isAuthEnabled(): boolean {
  return (
    isNonEmptyEnv(process.env.COGNITO_USER_POOL_ID) &&
    isNonEmptyEnv(process.env.COGNITO_CLIENT_ID) &&
    isNonEmptyEnv(process.env.COGNITO_REGION)
  );
}

// Gets the Cognito configuration information
export function getCognitoConfig(): CognitoConfig | null {
  const region = process.env.COGNITO_REGION;
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const clientId = process.env.COGNITO_CLIENT_ID;

  if (!isAuthEnabled()) {
    return null;
  }

  return {
    region,
    userPoolId,
    clientId,
    issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
  };
}
