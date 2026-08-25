import { CognitoConfig } from './cognito.types';
import { isNonEmptyEnv } from '../../utils/env';

// Env var that must be set to "true" to intentionally run without authentication.
const AUTH_DISABLED_ENV = 'AUTH_DISABLED';

// Cognito env vars that must both be set whenever auth is not explicitly disabled.
const REQUIRED_COGNITO_ENV = ['COGNITO_USER_POOL_ID', 'COGNITO_CLIENT_ID'];

/**
 * Thrown when the authentication environment is in a state we refuse to guess at:
 * - auth was not explicitly disabled, but the Cognito configuration is unusable.
 * This intentionally fails the application's startup rather than falling back to serving every route unauthenticated (see {@link getCognitoConfig}).
 */
export class AuthConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthConfigurationError';
  }
}

/**
 * Reads the {@link AUTH_DISABLED_ENV} opt-out flag.
 * Only `true` and `false` (any casing, surrounded by optional whitespace) are accepted. Typos throw errors as to not be silently read as "not disabled".
 *
 * @returns `true` if auth was explicitly disabled, `false` otherwise.
 * @throws {AuthConfigurationError} If the flag is set to an unrecognized value.
 */
function parseAuthDisabled(): boolean {
  const raw = process.env[AUTH_DISABLED_ENV];
  if (!isNonEmptyEnv(raw)) {
    return false;
  }

  const normalized = raw.trim().toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;

  throw new AuthConfigurationError(
    `${AUTH_DISABLED_ENV} must be either "true" or "false" (received "${raw}").`,
  );
}

// Reports whether any Cognito env var is set. Used only to warn about a config
// that sets up Cognito and then disables auth anyway.
export function hasAnyCognitoEnv(): boolean {
  return [...REQUIRED_COGNITO_ENV, 'COGNITO_REGION'].some((key) =>
    isNonEmptyEnv(process.env[key]),
  );
}

// Checks if the authentication is enabled
export function isAuthEnabled(): boolean {
  return getCognitoConfig() !== null;
}

/**
 * Resolves the Cognito configuration from the environment.
 *
 * Auth is only ever left off by explicit opt-in. Any other unusable
 * configuration is a misconfiguration (a mistyped or undelivered env var), and
 * silently serving every route unauthenticated is the worst possible response
 * to it, so we throw and let the application fail to start.
 *
 * @returns The resolved config, or `null` when auth is explicitly disabled via
 *   `AUTH_DISABLED=true`.
 * @throws {AuthConfigurationError} If auth was not explicitly disabled and the
 *   Cognito configuration is missing or unusable.
 */
export function getCognitoConfig(): CognitoConfig | null {
  // Explicitly disabled: the only supported way to run without auth.
  if (parseAuthDisabled()) {
    return null;
  }

  let region = process.env.COGNITO_REGION;
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const clientId = process.env.COGNITO_CLIENT_ID;

  // Auth was not disabled, so every required variable has to be present.
  if (!isNonEmptyEnv(userPoolId) || !isNonEmptyEnv(clientId)) {
    const missing = REQUIRED_COGNITO_ENV.filter(
      (key) => !isNonEmptyEnv(process.env[key]),
    );
    throw new AuthConfigurationError(
      `Cognito auth is misconfigured: ${missing.join(' and ')} ` +
        `${missing.length === 1 ? 'is' : 'are'} missing or empty. ` +
        `Set ${missing.join(' and ')}, or set ${AUTH_DISABLED_ENV}=true to ` +
        `intentionally run with all routes unauthenticated.`,
    );
  }

  // COGNITO_REGION is optional: when unset, derive it from the user pool ID
  // (format: <region>_<id>). Without an underscore there is nothing to derive.
  if (!isNonEmptyEnv(region)) {
    if (!userPoolId.includes('_')) {
      throw new AuthConfigurationError(
        `Cognito auth is misconfigured: COGNITO_REGION is unset and cannot be ` +
          `derived from COGNITO_USER_POOL_ID ("${userPoolId}"), which is not in ` +
          `the expected <region>_<id> format. Set COGNITO_REGION explicitly, or ` +
          `set ${AUTH_DISABLED_ENV}=true to intentionally run with all routes ` +
          `unauthenticated.`,
      );
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
