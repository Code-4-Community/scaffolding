import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

import { IS_PUBLIC_KEY } from './cognito.decorator';
import { CognitoJWTGuard } from './cognito.guard';
import { AccessTokenPayload } from './cognito.types';

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

// Only the user pool ID and client ID are required to enable auth. COGNITO_REGION
// is optional: when unset it is derived from the user pool ID (format <region>_<id>).
const REQUIRED_ENV_KEYS = [
  'COGNITO_USER_POOL_ID',
  'COGNITO_CLIENT_ID',
] as const;

const ACTIVE_ENV = {
  COGNITO_USER_POOL_ID: 'us-east-2_TestPool',
  COGNITO_CLIENT_ID: 'test-client-id',
  COGNITO_REGION: 'us-east-2',
};

function setActiveEnv(): void {
  Object.assign(process.env, ACTIVE_ENV);
}

// Builds a structurally valid Cognito access token payload (sub/iss/exp/iat present).
// Pass overrides to set the client_id/token_use claims or to break a required claim.
function buildPayload(
  overrides: Partial<AccessTokenPayload> = {},
): Record<string, unknown> {
  return {
    sub: 'user-1',
    iss: `https://cognito-idp.${ACTIVE_ENV.COGNITO_REGION}.amazonaws.com/${ACTIVE_ENV.COGNITO_USER_POOL_ID}`,
    exp: 9999999999,
    iat: 1,
    ...overrides,
  };
}

// Makes the mocked jwt.verify succeed with the given decoded value.
function mockVerifyResolves(decoded: unknown): void {
  (jwt.verify as jest.Mock).mockImplementation(
    (_token, _getKey, _options, callback) => callback(null, decoded),
  );
}

// Makes the mocked jwt.verify fail with the given error.
function mockVerifyRejects(error: Error): void {
  (jwt.verify as jest.Mock).mockImplementation(
    (_token, _getKey, _options, callback) => callback(error, undefined),
  );
}

// Builds ExecutionContext and request with given Authorization header so the guard can be exercised
function createContext(authorization?: string): {
  context: ExecutionContext;
  request: Request & { user?: AccessTokenPayload };
} {
  // Build request with authorization header (if provided)
  const request = {
    headers: authorization ? { authorization } : {},
  } as Request & { user?: AccessTokenPayload };

  // Build execution context with switchToHttp method that returns the request
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

    // Rejections that happen before jwt.verify is ever called, based purely on
    // the Authorization header.
    describe('Bearer token extraction', () => {
      it('rejects routes without a Bearer token', async () => {
        const { context } = createContext();

        await expect(guard.canActivate(context)).rejects.toThrow(
          UnauthorizedException,
        );
        expect(jwt.verify).not.toHaveBeenCalled();
      });

      it('rejects routes with non-Bearer authorization', async () => {
        const { context } = createContext('Basic abc1234567890');

        await expect(guard.canActivate(context)).rejects.toThrow(
          UnauthorizedException,
        );
        expect(jwt.verify).not.toHaveBeenCalled();
      });

      it('rejects routes with an empty Bearer token', async () => {
        const { context } = createContext('Bearer ');

        await expect(guard.canActivate(context)).rejects.toThrow(
          UnauthorizedException,
        );
        expect(jwt.verify).not.toHaveBeenCalled();
      });

      it('rejects routes with a whitespace-only Bearer token', async () => {
        const { context } = createContext('Bearer    ');

        await expect(guard.canActivate(context)).rejects.toThrow(
          UnauthorizedException,
        );
        expect(jwt.verify).not.toHaveBeenCalled();
      });
    });

    // Rejections from jwt.verify itself or from a decoded value that is not a
    // well-formed access token payload object.
    describe('token verification and payload shape', () => {
      it('rejects routes when token verification fails', async () => {
        mockVerifyRejects(new Error('invalid signature'));

        const { context } = createContext('Bearer bad-token');

        await expect(guard.canActivate(context)).rejects.toThrow(
          UnauthorizedException,
        );
      });

      it('rejects routes when the decoded token is a string', async () => {
        mockVerifyResolves('not-an-object');

        const { context } = createContext('Bearer weird-token');

        await expect(guard.canActivate(context)).rejects.toThrow(
          UnauthorizedException,
        );
      });

      it('rejects routes when the payload is missing a required claim', async () => {
        // sub is required; an otherwise-valid access token without it must be rejected.
        mockVerifyResolves(
          buildPayload({
            sub: undefined,
            token_use: 'access',
            client_id: ACTIVE_ENV.COGNITO_CLIENT_ID,
          }),
        );

        const { context } = createContext('Bearer malformed-token');

        await expect(guard.canActivate(context)).rejects.toThrow(
          UnauthorizedException,
        );
      });
    });

    // Rejections from the access-token authorization checks: the token must be
    // an access token (token_use) whose client_id matches our app client.
    describe('token type and value validation', () => {
      it('rejects ID tokens (token_use is not "access")', async () => {
        // Only access tokens are accepted; an ID token carrying the right
        // client_id must still be rejected.
        mockVerifyResolves(
          buildPayload({
            token_use: 'id' as AccessTokenPayload['token_use'],
            client_id: ACTIVE_ENV.COGNITO_CLIENT_ID,
          }),
        );

        const { context } = createContext('Bearer id-token');

        await expect(guard.canActivate(context)).rejects.toThrow(
          UnauthorizedException,
        );
      });

      it('rejects access tokens whose client_id does not match', async () => {
        mockVerifyResolves(
          buildPayload({ token_use: 'access', client_id: 'wrong-client-id' }),
        );

        const { context } = createContext('Bearer access-token');

        await expect(guard.canActivate(context)).rejects.toThrow(
          UnauthorizedException,
        );
      });

      it('rejects access tokens with no client_id claim', async () => {
        mockVerifyResolves(buildPayload({ token_use: 'access' }));

        const { context } = createContext('Bearer access-token');

        await expect(guard.canActivate(context)).rejects.toThrow(
          UnauthorizedException,
        );
      });

      it('allows routes with a valid access token (client_id)', async () => {
        const payload = buildPayload({
          client_id: ACTIVE_ENV.COGNITO_CLIENT_ID,
          token_use: 'access',
        });
        mockVerifyResolves(payload);

        const { context, request } = createContext('Bearer access-token');

        await expect(guard.canActivate(context)).resolves.toBe(true);
        expect(request.user).toEqual(payload);
      });
    });

    // Routes marked @Public bypass token extraction and verification entirely.
    describe('@Public routes', () => {
      beforeEach(() => {
        reflector.getAllAndOverride.mockImplementation(
          (key) => key === IS_PUBLIC_KEY,
        );
      });

      it('allows @Public routes without a token', async () => {
        const { context, request } = createContext();

        await expect(guard.canActivate(context)).resolves.toBe(true);
        expect(jwt.verify).not.toHaveBeenCalled();
        expect(request.user).toBeUndefined();
      });

      it('allows @Public routes without verifying any bearer token', async () => {
        const { context, request } = createContext('Bearer bad-token');

        await expect(guard.canActivate(context)).resolves.toBe(true);
        expect(jwt.verify).not.toHaveBeenCalled();
        expect(request.user).toBeUndefined();
      });
    });
  });

  describe('when auth is inactive', () => {
    it('allows requests without a token', async () => {
      const { context } = createContext();

      await expect(guard.canActivate(context)).resolves.toBe(true);
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it('ignores a bearer token when auth is disabled', async () => {
      const { context, request } = createContext('Bearer any-token');

      await expect(guard.canActivate(context)).resolves.toBe(true);
      expect(jwt.verify).not.toHaveBeenCalled();
      expect(request.user).toBeUndefined();
    });

    // Auth requires the user pool ID and client ID; a single missing one disables it.
    it.each(REQUIRED_ENV_KEYS)(
      'disables auth when %s is missing',
      async (missingKey) => {
        setActiveEnv();
        delete process.env[missingKey];

        const { context } = createContext('Bearer token');

        await expect(guard.canActivate(context)).resolves.toBe(true);
        expect(jwt.verify).not.toHaveBeenCalled();
      },
    );
  });

  // COGNITO_REGION is optional: when unset the config derives it from the user
  // pool ID, so auth stays active and tokens are still verified.
  describe('when COGNITO_REGION is missing (region derived)', () => {
    it('keeps auth active and verifies the token', async () => {
      setActiveEnv();
      delete process.env.COGNITO_REGION;

      const payload = buildPayload({
        client_id: ACTIVE_ENV.COGNITO_CLIENT_ID,
        token_use: 'access',
      });
      mockVerifyResolves(payload);

      const { context, request } = createContext('Bearer access-token');

      await expect(guard.canActivate(context)).resolves.toBe(true);
      expect(jwt.verify).toHaveBeenCalled();
      expect(request.user).toEqual(payload);
    });
  });
});
