import { Request } from 'express';

import { CognitoService } from './cognito.service';
import { AccessTokenPayload } from './cognito.types';

type TestRequest = Request & { user?: AccessTokenPayload };

const ENV_KEYS = [
  'COGNITO_USER_POOL_ID',
  'COGNITO_CLIENT_ID',
  'COGNITO_REGION',
] as const;

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
      process.env.COGNITO_USER_POOL_ID = 'us-east-2_TestPool';
      process.env.COGNITO_CLIENT_ID = '4h57k9lmno1pqrstuv2wxyz3ab';
      process.env.COGNITO_REGION = 'us-east-2';
      service = new CognitoService();
    });

    // Clean up environment variables after each test
    afterEach(() => {
      ENV_KEYS.forEach((key) => delete process.env[key]);
    });

    // Auth requires the user pool ID and client ID; a single missing one disables
    // it, so getUser returns null regardless of the request.
    it.each(REQUIRED_ENV_KEYS)(
      'returns null when %s is missing (auth disabled)',
      (missingKey) => {
        delete process.env[missingKey];

        expect(service.getUser({ headers: {} } as TestRequest)).toBeNull();
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
