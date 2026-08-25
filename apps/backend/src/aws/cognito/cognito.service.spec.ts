import { Request } from 'express';

import { AuthConfigurationError } from './cognito.config';
import { CognitoService } from './cognito.service';
import { AccessTokenPayload } from './cognito.types';

type TestRequest = Request & { user?: AccessTokenPayload };

const ENV_KEYS = [
  'AUTH_DISABLED',
  'COGNITO_USER_POOL_ID',
  'COGNITO_CLIENT_ID',
  'COGNITO_REGION',
] as const;

// Snapshot the auth env once so each test can mutate it freely without
// clobbering a value the developer had set in their own shell.
const ORIGINAL_ENV: Record<string, string | undefined> = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]]),
);

function restoreEnv(): void {
  ENV_KEYS.forEach((key) => {
    const original = ORIGINAL_ENV[key];
    if (original === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = original;
    }
  });
}

// Only the user pool ID and client ID are required to enable auth. COGNITO_REGION
// is optional: when unset it is derived from the user pool ID (format <region>_<id>).
const REQUIRED_ENV_KEYS = [
  'COGNITO_USER_POOL_ID',
  'COGNITO_CLIENT_ID',
] as const;

describe('CognitoService', () => {
  describe('getUser', () => {
    let service: CognitoService;

    beforeEach(() => {
      delete process.env.AUTH_DISABLED;
      process.env.COGNITO_USER_POOL_ID = 'us-east-2_TestPool';
      process.env.COGNITO_CLIENT_ID = '4h57k9lmno1pqrstuv2wxyz3ab';
      process.env.COGNITO_REGION = 'us-east-2';
      service = new CognitoService();
    });

    // Restore environment variables after each test
    afterEach(() => {
      restoreEnv();
    });

    // Auth is only ever off by explicit opt-in, in which case there is no user
    // to return regardless of the request.
    it('returns null when auth is explicitly disabled', () => {
      process.env.AUTH_DISABLED = 'true';

      expect(service.getUser({ headers: {} } as TestRequest)).toBeNull();
    });

    // Without the explicit opt-out an unusable config is a misconfiguration, and
    // reporting "no user" for it would quietly hide the problem from callers.
    it.each(REQUIRED_ENV_KEYS)(
      'throws when %s is missing and auth was not disabled',
      (missingKey) => {
        delete process.env[missingKey];

        expect(() => service.getUser({ headers: {} } as TestRequest)).toThrow(
          AuthConfigurationError,
        );
      },
    );

    // COGNITO_REGION is optional (derived from the user pool ID), so auth stays
    // enabled without it and getUser still returns an attached payload.
    it('returns the JWT payload when COGNITO_REGION is missing (region derived)', () => {
      delete process.env.COGNITO_REGION;

      const payload: AccessTokenPayload = {
        sub: 'user-1',
        client_id: 'test-client',
        token_use: 'access',
        iss: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_TestPool',
        exp: 9999999999,
        iat: 1,
      };
      const request = { user: payload } as TestRequest;

      expect(service.getUser(request)).toEqual(payload);
    });

    it('returns the JWT payload when auth is active and user is on the request', () => {
      const payload: AccessTokenPayload = {
        sub: 'user-1',
        client_id: 'test-client',
        token_use: 'access',
        iss: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_TestPool',
        exp: 9999999999,
        iat: 1,
      };
      const request = { user: payload } as TestRequest;

      expect(service.getUser(request)).toEqual(payload);
    });

    it('returns null when auth is active and user is not on the request', () => {
      expect(service.getUser({ headers: {} } as TestRequest)).toBeNull();
    });
  });
});
