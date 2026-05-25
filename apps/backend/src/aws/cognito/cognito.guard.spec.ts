import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

import { IS_PUBLIC_KEY } from './cognito.decorator';
import { CognitoJWTGuard } from './cognito.guard';
import { CognitoJwtPayload } from './cognito.types';

jest.mock('jsonwebtoken');
// Fake the jwks-rsa module to return a mock public key
jest.mock('jwks-rsa', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getSigningKey: jest.fn().mockResolvedValue({
      getPublicKey: () => 'mock-public-key',
    }),
  })),
}));

// Environment variables to test
const ENV_KEYS = [
  'COGNITO_USER_POOL_ID',
  'COGNITO_CLIENT_ID',
  'COGNITO_REGION',
] as const;

const ACTIVE_ENV = {
  COGNITO_USER_POOL_ID: 'us-east-2_TestPool',
  COGNITO_CLIENT_ID: 'test-client-id',
  COGNITO_REGION: 'us-east-2',
};

function setActiveEnv(): void {
  Object.assign(process.env, ACTIVE_ENV);
}

// Helper to simulate execution context when request hits a route
function createContext(authorization?: string): {
  context: ExecutionContext;
  request: Request & { user?: CognitoJwtPayload };
} {
  // Request with authorization header (if provided)
  const request = {
    headers: authorization ? { authorization } : {},
  } as Request & { user?: CognitoJwtPayload };

  // Execution context with switchToHttp method that returns the request
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () => jest.fn(),
    getClass: () => jest.fn(),
  } as unknown as ExecutionContext;

  return { context, request };
}

describe('CognitoJWTGuard', () => {
  let guard: CognitoJWTGuard;
  let reflector: jest.Mocked<Pick<Reflector, 'getAllAndOverride'>>;

  // Wipe call history at start of each test
  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn().mockReturnValue(false) };
    guard = new CognitoJWTGuard(reflector as unknown as Reflector);
    (jwt.verify as jest.Mock).mockReset();
  });

  // Clean up environment variables and call history after each test
  afterEach(() => {
    ENV_KEYS.forEach((key) => delete process.env[key]);
    jest.clearAllMocks();
  });

  describe('When auth is active', () => {
    beforeEach(() => {
      setActiveEnv();
    });

    it('rejects routes without a Bearer token', async () => {
      const { context } = createContext();

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('rejects routes with non-Bearer authorization', async () => {
      const { context } = createContext('Basic abc1234567890');

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it('rejects routes with empty Bearer token', async () => {
      const { context } = createContext('Bearer ');

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it('rejects routes with an invalid token', async () => {
      (jwt.verify as jest.Mock).mockImplementation(
        (_token, _getKey, _options, callback) => {
          callback(new Error('invalid signature'), undefined);
        },
      );

      const { context } = createContext('Bearer bad-token');

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('allows routes with a valid access token (client_id)', async () => {
      const payload: CognitoJwtPayload = {
        sub: 'user-1',
        client_id: ACTIVE_ENV.COGNITO_CLIENT_ID,
        token_use: 'access',
        iss: `https://cognito-idp.${ACTIVE_ENV.COGNITO_REGION}.amazonaws.com/${ACTIVE_ENV.COGNITO_USER_POOL_ID}`,
        exp: 9999999999,
        iat: 1,
      };
      (jwt.verify as jest.Mock).mockImplementation(
        (_token, _getKey, _options, callback) => {
          callback(null, payload);
        },
      );

      const { context, request } = createContext('Bearer access-token');

      await expect(guard.canActivate(context)).resolves.toBe(true);
      expect(request.user).toEqual(payload);
    });

    it('rejects routes when client_id does not match', async () => {
      (jwt.verify as jest.Mock).mockImplementation(
        (_token, _getKey, _options, callback) => {
          callback(null, {
            sub: 'user-1',
            client_id: 'wrong-client-id',
            token_use: 'access',
            iss: `https://cognito-idp.${ACTIVE_ENV.COGNITO_REGION}.amazonaws.com/${ACTIVE_ENV.COGNITO_USER_POOL_ID}`,
            exp: 9999999999,
            iat: 1,
          });
        },
      );

      const { context } = createContext('Bearer access-token');

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('allows routes with a valid ID token (aud)', async () => {
      const payload: CognitoJwtPayload = {
        sub: 'user-1',
        aud: ACTIVE_ENV.COGNITO_CLIENT_ID,
        token_use: 'id',
        iss: `https://cognito-idp.${ACTIVE_ENV.COGNITO_REGION}.amazonaws.com/${ACTIVE_ENV.COGNITO_USER_POOL_ID}`,
        exp: 9999999999,
        iat: 1,
      };
      (jwt.verify as jest.Mock).mockImplementation(
        (_token, _getKey, _options, callback) => {
          callback(null, payload);
        },
      );

      const { context, request } = createContext('Bearer id-token');

      await expect(guard.canActivate(context)).resolves.toBe(true);
      expect(request.user).toEqual(payload);
    });

    it('rejects routes when audience does not match client id', async () => {
      (jwt.verify as jest.Mock).mockImplementation(
        (_token, _getKey, _options, callback) => {
          callback(null, {
            sub: 'user-1',
            aud: 'wrong-client',
            iss: `https://cognito-idp.${ACTIVE_ENV.COGNITO_REGION}.amazonaws.com/${ACTIVE_ENV.COGNITO_USER_POOL_ID}`,
            exp: 9999999999,
            iat: 1,
          });
        },
      );

      const { context } = createContext('Bearer token');

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('rejects routes when payload has no audience claim', async () => {
      (jwt.verify as jest.Mock).mockImplementation(
        (_token, _getKey, _options, callback) => {
          callback(null, {
            sub: 'user-1',
            iss: `https://cognito-idp.${ACTIVE_ENV.COGNITO_REGION}.amazonaws.com/${ACTIVE_ENV.COGNITO_USER_POOL_ID}`,
            exp: 9999999999,
            iat: 1,
          });
        },
      );

      const { context } = createContext('Bearer token');

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('allows @Public routes without a token', async () => {
      reflector.getAllAndOverride.mockImplementation(
        (key) => key === IS_PUBLIC_KEY,
      );

      const { context } = createContext();

      await expect(guard.canActivate(context)).resolves.toBe(true);
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it('allows @Public routes with any bearer token', async () => {
      reflector.getAllAndOverride.mockImplementation(
        (key) => key === IS_PUBLIC_KEY,
      );

      const { context, request } = createContext('Bearer bad-token');

      await expect(guard.canActivate(context)).resolves.toBe(true);
      expect(jwt.verify).not.toHaveBeenCalled();
      expect(request.user).toBeUndefined();
    });
    it('rejects routes when COGNITO_CLIENT_ID is missing', async () => {
      process.env.COGNITO_USER_POOL_ID = ACTIVE_ENV.COGNITO_USER_POOL_ID;
      process.env.COGNITO_REGION = ACTIVE_ENV.COGNITO_REGION;
      delete process.env.COGNITO_CLIENT_ID;

      const { context } = createContext('Bearer token');

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it('rejects routes when COGNITO_REGION is missing', async () => {
      process.env.COGNITO_USER_POOL_ID = ACTIVE_ENV.COGNITO_USER_POOL_ID;
      process.env.COGNITO_CLIENT_ID = ACTIVE_ENV.COGNITO_CLIENT_ID;
      delete process.env.COGNITO_REGION;

      const { context } = createContext('Bearer token');

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(jwt.verify).not.toHaveBeenCalled();
    });
  });

  describe('when auth is inactive', () => {
    beforeEach(() => {
      delete process.env.COGNITO_USER_POOL_ID;
    });

    it('allows requests without a token', async () => {
      const { context } = createContext();

      await expect(guard.canActivate(context)).resolves.toBe(true);
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it('allows requests with a bearer token', async () => {
      const { context, request } = createContext('Bearer bad-token');

      await expect(guard.canActivate(context)).resolves.toBe(true);
      expect(jwt.verify).not.toHaveBeenCalled();
      expect(request.user).toBeUndefined();
    });
  });
});
