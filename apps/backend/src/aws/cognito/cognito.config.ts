import { CognitoConfig } from './cognito.types';
import { isNonEmptyEnv } from '../../utils/env';

// Checks if the authentication is enabled
export function isAuthEnabled(): boolean {
  return getCognitoConfig() !== null;
}

// Gets the Cognito configuration information
export function getCognitoConfig(): CognitoConfig | null {
  let region = process.env.COGNITO_REGION;
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const clientId = process.env.COGNITO_CLIENT_ID;

  // Returns null if any of the environment variables are not set
  if (!isNonEmptyEnv(userPoolId) || !isNonEmptyEnv(clientId)) {
    return null;
  }

  // If region is not set, derive it from the user pool ID (format: <region>_<id>)
  if (!isNonEmptyEnv(region)) {
    region = userPoolId.split('_')[0];
  }

  return {
    region,
    userPoolId,
    clientId,
    issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
  };
}
