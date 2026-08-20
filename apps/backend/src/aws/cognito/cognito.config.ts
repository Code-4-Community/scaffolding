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

  // Returns null if any of the required environment variables are not set
  if (!isNonEmptyEnv(userPoolId) || !isNonEmptyEnv(clientId)) {
    return null;
  }

  // COGNITO_REGION is optional: when unset, derive it from the user pool ID
  // (format: <region>_<id>). Without an underscore there is nothing to derive.
  if (!isNonEmptyEnv(region)) {
    if (!userPoolId.includes('_')) {
      return null;
    }
    region = userPoolId.split('_')[0];
  }

  return {
    region,
    userPoolId,
    clientId,
    issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
  };
}
