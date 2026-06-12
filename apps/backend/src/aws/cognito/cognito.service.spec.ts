import { Request } from 'express';

import { CognitoService } from './cognito.service';
import { AccessTokenPayload } from './cognito.types';

type TestRequest = Request & { user?: AccessTokenPayload };

const ENV_KEYS = [
  'COGNITO_USER_POOL_ID',
  'COGNITO_CLIENT_ID',
  'COGNITO_REGION',
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

    // Auth requires all three env vars; a single missing one disables it,
    // so getUser returns null regardless of the request.
    it.each(ENV_KEYS)(
      'returns null when %s is missing (auth disabled)',
      (missingKey) => {
        delete process.env[missingKey];

        expect(service.getUser({ headers: {} } as TestRequest)).toBeNull();
      },
    );

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
