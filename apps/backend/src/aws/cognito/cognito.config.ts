// Checks if the authentication is enabled
export function isAuthEnabled(): boolean {
  return (
    isNonEmptyEnv(process.env.COGNITO_USER_POOL_ID) &&
    isNonEmptyEnv(process.env.COGNITO_CLIENT_ID) &&
    isNonEmptyEnv(process.env.COGNITO_REGION)
  );
}

// Gets the Cognito configuration information
export function getCognitoConfig(): {
  region: string;
  userPoolId: string;
  clientId: string;
  issuer: string;
} | null {
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

// Checks if the value is a non-empty string
function isNonEmptyEnv(value: string | undefined): value is string {
  if (value === undefined) {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  return normalized !== '';
}
