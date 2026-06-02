import { Request } from 'express';

import { CognitoService } from './cognito.service';
import { CognitoJwtPayload } from './cognito.types';

type TestRequest = Request & { user?: CognitoJwtPayload };

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
      delete process.env.COGNITO_USER_POOL_ID;
      delete process.env.COGNITO_REGION;
      delete process.env.COGNITO_CLIENT_ID;
    });

    it('returns null when there is no user pool ID env variable, but client id and region exist', () => {
      delete process.env.COGNITO_USER_POOL_ID;

      expect(service.getUser({ headers: {} } as TestRequest)).toBeNull();
    });

    it('returns null when there is no region env variable, but client id and user pool ID exist', () => {
      delete process.env.COGNITO_REGION;

      expect(service.getUser({ headers: {} } as TestRequest)).toBeNull();
    });

    it('returns null when there is no client ID env variable, but user pool id and region exist', () => {
      delete process.env.COGNITO_CLIENT_ID;

      expect(service.getUser({ headers: {} } as TestRequest)).toBeNull();
    });

    it('returns the JWT payload when auth is active and user is on the request', () => {
      const payload: CognitoJwtPayload = {
        sub: 'user-1',
        client_id: 'test-client',
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
