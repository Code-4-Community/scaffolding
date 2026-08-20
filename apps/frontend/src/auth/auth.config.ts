import { Amplify } from 'aws-amplify';

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID;

/**
 * Checks whether an environment variable value is a defined, non-empty string.
 *
 * @param value The environment variable value to check.
 * @returns `true` if the value is a defined, non-empty string; `false` otherwise.
 *
 * Also tells TypeScript that provided `value` is a `string` if the function returns true.
 */
export function isNonEmptyEnv(value: string | undefined): value is string {
  if (value === undefined) {
    return false;
  }
  return value.trim() !== '';
}

// Checks if the authentication is enabled
export function isAuthEnabled(): boolean {
  return isNonEmptyEnv(userPoolId) && isNonEmptyEnv(userPoolClientId);
}

// Configure amplify with cognito if the information is present in the environment variables
export function configureAmplify(): void {
  if (!isNonEmptyEnv(userPoolId) || !isNonEmptyEnv(userPoolClientId)) {
    return;
  }

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: userPoolId,
        userPoolClientId: userPoolClientId,
      },
    },
  });
}
