import { Logger } from '@nestjs/common';

// Importing the module pulls in CognitoJWTGuard, and through it jwks-rsa, whose
// `jose` dependency ships ESM that Jest cannot parse. Nothing here exercises the
// guard, so stub the module out -- cognito.guard.spec.ts does the same.
jest.mock('jwks-rsa', () => ({
  __esModule: true,
  default: jest.fn(() => ({ getSigningKey: jest.fn() })),
}));

import { CognitoModule } from './cognito.module';

// Environment variables that decide whether auth is enabled, plus NODE_ENV,
// which decides how loudly a disabled state is reported.
const ENV_KEYS = [
  'COGNITO_USER_POOL_ID',
  'COGNITO_CLIENT_ID',
  'COGNITO_REGION',
  'NODE_ENV',
] as const;

const ACTIVE_ENV = {
  COGNITO_USER_POOL_ID: 'us-east-2_TestPool',
  COGNITO_CLIENT_ID: 'test-client-id',
  COGNITO_REGION: 'us-east-2',
};

const DISABLED_MESSAGE =
  'Cognito auth disabled: env vars missing. All routes open.';

function setActiveEnv(): void {
  Object.assign(process.env, ACTIVE_ENV);
}

describe('CognitoModule', () => {
  let module: CognitoModule;
  let error: jest.SpyInstance;
  let warn: jest.SpyInstance;
  let log: jest.SpyInstance;

  // Snapshot of the keys this suite mutates, so tests cannot leak into each
  // other or into the rest of the run. Jest sets NODE_ENV='test' by default,
  // and that value has to be restored like any other.
  const originalEnv: Partial<Record<(typeof ENV_KEYS)[number], string>> = {};

  beforeEach(() => {
    ENV_KEYS.forEach((key) => {
      originalEnv[key] = process.env[key];
      delete process.env[key];
    });

    module = new CognitoModule();
    error = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    log = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    ENV_KEYS.forEach((key) => {
      const value = originalEnv[key];
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });
    jest.restoreAllMocks();
  });

  describe('When auth is enabled', () => {
    beforeEach(() => {
      setActiveEnv();
    });

    it('logs that auth is enabled and raises nothing', () => {
      module.onModuleInit();

      expect(log).toHaveBeenCalledWith('Cognito auth enabled');
      expect(warn).not.toHaveBeenCalled();
      expect(error).not.toHaveBeenCalled();
    });

    // The severity branch keys off NODE_ENV, but it is only reached when auth
    // is disabled -- a correctly configured production app stays quiet.
    it('stays quiet in production', () => {
      process.env.NODE_ENV = 'production';

      module.onModuleInit();

      expect(log).toHaveBeenCalledWith('Cognito auth enabled');
      expect(error).not.toHaveBeenCalled();
    });
  });

  describe('When auth is disabled', () => {
    // Auth is off for every test here: no COGNITO_* vars are set.

    it('logs at error level in production', () => {
      process.env.NODE_ENV = 'production';

      module.onModuleInit();

      expect(error).toHaveBeenCalledWith(DISABLED_MESSAGE);
      expect(warn).not.toHaveBeenCalled();
      expect(log).not.toHaveBeenCalled();
    });

    it('logs at warn level in development', () => {
      process.env.NODE_ENV = 'development';

      module.onModuleInit();

      expect(warn).toHaveBeenCalledWith(DISABLED_MESSAGE);
      expect(error).not.toHaveBeenCalled();
      expect(log).not.toHaveBeenCalled();
    });

    // Nothing in this repo sets NODE_ENV, so an unset value is the common case.
    // It must degrade to the dev-safe warning rather than the error, otherwise
    // every local run would report a problem that isn't one.
    it('logs at warn level when NODE_ENV is unset', () => {
      expect(process.env.NODE_ENV).toBeUndefined();

      module.onModuleInit();

      expect(warn).toHaveBeenCalledWith(DISABLED_MESSAGE);
      expect(error).not.toHaveBeenCalled();
    });

    // Partial configuration is still disabled configuration: getCognitoConfig()
    // returns null unless BOTH the pool ID and the client ID are present.
    it('escalates in production when only the user pool ID is set', () => {
      process.env.NODE_ENV = 'production';
      process.env.COGNITO_USER_POOL_ID = ACTIVE_ENV.COGNITO_USER_POOL_ID;

      module.onModuleInit();

      expect(error).toHaveBeenCalledWith(DISABLED_MESSAGE);
      expect(log).not.toHaveBeenCalled();
    });
  });
});
