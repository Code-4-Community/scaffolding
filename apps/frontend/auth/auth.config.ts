import { Amplify } from 'aws-amplify';

const userPoolId = process.env.VITE_COGNITO_USER_POOL_ID;
const userPoolClientId = process.env.VITE_COGNITO_USER_POOL_CLIENT_ID;

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
  isNonEmptyEnv(userPoolId) && isNonEmptyEnv(userPoolClientId);

// Configure amplify with cognito if the information is present in the environment variables
export function configureAmplify(): void {
  if (!isNonEmptyEnv(userPoolId)) {
    return;
  }
  if (!isNonEmptyEnv(userPoolClientId)) {
    return;
  }

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
      },
    },
  });
}
