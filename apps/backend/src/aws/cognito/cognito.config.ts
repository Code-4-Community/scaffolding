import { CognitoConfig } from './cognito.types';
import { getMissingEnvVars, isNonEmptyEnv } from '../../utils/env';

// Env var that must be set to "true" to intentionally run without authentication.
const AUTH_DISABLED_ENV = 'AUTH_DISABLED';

/**
 * Cognito env vars that must all be set whenever auth is not explicitly disabled.
 */
export const REQUIRED_ENV_VARS_WHEN_ENABLED = [
  'COGNITO_USER_POOL_ID',
  'COGNITO_CLIENT_ID',
] as const;

// Optional, but a value here still means somebody configured Cognito.
const OPTIONAL_ENV_VARS_WHEN_ENABLED = ['COGNITO_REGION'] as const;

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

/**
 * Reports whether auth was explicitly disabled via `AUTH_DISABLED=true`.
 *
 * @throws {AuthConfigurationError} If the flag is set to an unrecognized value.
 */
export function isAuthDisabled(): boolean {
  return parseAuthDisabled();
}

// Reports whether any Cognito env var is set. Used only to warn about a config
// that sets up Cognito and then disables auth anyway.
export function hasAnyCognitoEnv(): boolean {
  return [
    ...REQUIRED_ENV_VARS_WHEN_ENABLED,
    ...OPTIONAL_ENV_VARS_WHEN_ENABLED,
  ].some((key) => isNonEmptyEnv(process.env[key]));
}

/**
 * Resolves the Cognito configuration from the environment.
 *
 * Auth is only ever left off by explicit opt-in.
 *
 * Returns `null` if and only if `AUTH_DISABLED=true`
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

  // Trimmed so that a padded value cannot reach `issuer` and produce a URL that no
  // token will ever match.
  const userPoolId = process.env.COGNITO_USER_POOL_ID?.trim() ?? '';
  const clientId = process.env.COGNITO_CLIENT_ID?.trim() ?? '';
  let region = process.env.COGNITO_REGION?.trim() ?? '';

  // Auth was not disabled, so every required variable has to be present.
  const missing = getMissingEnvVars(REQUIRED_ENV_VARS_WHEN_ENABLED);
  if (missing.length > 0) {
    throw new AuthConfigurationError(
      `Cognito auth is misconfigured: missing or empty env vars ` +
        `(${missing.join(
          ', ',
        )}). Set them, or set ${AUTH_DISABLED_ENV}=true to ` +
        `intentionally run with all routes unauthenticated.`,
    );
  }

  // COGNITO_REGION is optional: when unset, derive it from the user pool ID
  // (format: <region>_<id>). Without an underscore there is nothing to derive.
  if (region === '') {
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
