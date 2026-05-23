import { CognitoService } from './cognito.service';
import { CognitoJwtPayload } from './cognito.types';

describe('CognitoService', () => {
  let service: CognitoService;

  beforeEach(() => {
    service = new CognitoService();
  });

  // Clean up environment variables after each test
  afterEach(() => {
    delete process.env.COGNITO_USER_POOL_ID;
  });

  it('returns null when there is no user pool ID env variable', () => {
    delete process.env.COGNITO_USER_POOL_ID;

    expect(service.getUser({ headers: {} } as never)).toBeNull();
  });

  it('returns the JWT payload when auth is active and user is on the request', () => {
    process.env.COGNITO_USER_POOL_ID = 'us-east-2_TestPool';
    const payload: CognitoJwtPayload = {
      sub: 'user-1',
      client_id: 'test-client',
      iss: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_TestPool',
      exp: 9999999999,
      iat: 1,
    };
    const request = { user: payload } as never;

    expect(service.getUser(request)).toEqual(payload);
  });

  // edge case:
  it('returns null when auth is active but request has no user', () => {
    process.env.COGNITO_USER_POOL_ID = 'us-east-2_TestPool';

    expect(service.getUser({ headers: {} } as never)).toBeNull();
  });
});
