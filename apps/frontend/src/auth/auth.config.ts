import { Amplify } from 'aws-amplify';

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID;
const region = import.meta.env.VITE_COGNITO_REGION;

// Fail out if the values are not set in the environment variables even if they exist
function isNonEmptyEnv(value: string | undefined): value is string {
  if (value === undefined || value === '') {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  return (
    normalized !== '' && normalized !== 'null' && normalized !== 'undefined'
  );
}

// Check if the cognito information is present in the environment variables
export const cognitoInformationPresent =
  isNonEmptyEnv(userPoolId) &&
  isNonEmptyEnv(userPoolClientId) &&
  isNonEmptyEnv(region);

// Configure amplify with cognito if the information is present in the environment variables
export function configureAmplify(): void {
  if (!cognitoInformationPresent) {
    return;
  }

  const poolId: string = userPoolId;
  const clientId: string = userPoolClientId;

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: poolId,
        userPoolClientId: clientId,
      },
    },
  });
}
