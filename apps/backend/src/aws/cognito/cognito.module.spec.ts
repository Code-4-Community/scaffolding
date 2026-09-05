import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AuthConfigurationError } from './cognito.config';
import { CognitoModule } from './cognito.module';

// The module pulls in the guard, which imports jwks-rsa. Its ESM `jose`
// dependency cannot be parsed by Jest, so it is stubbed out here.
jest.mock('jwks-rsa', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getSigningKey: jest.fn().mockResolvedValue({
      getPublicKey: () => 'mock-public-key',
    }),
  })),
}));

const ENV_KEYS = [
  'AUTH_DISABLED',
  'COGNITO_USER_POOL_ID',
  'COGNITO_CLIENT_ID',
  'COGNITO_REGION',
] as const;

const ACTIVE_ENV = {
  COGNITO_USER_POOL_ID: 'us-east-2_TestPool',
  COGNITO_CLIENT_ID: 'test-client-id',
  COGNITO_REGION: 'us-east-2',
};

// Snapshot the auth env once so each test can mutate it freely without
// clobbering a value the developer had set in their own shell.
const ORIGINAL_ENV: Record<string, string | undefined> = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]]),
);

describe('CognitoModule', () => {
  let module: CognitoModule;
  let warn: jest.SpyInstance;
  let log: jest.SpyInstance;

  beforeEach(() => {
    ENV_KEYS.forEach((key) => delete process.env[key]);
    module = new CognitoModule();
    warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    log = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    ENV_KEYS.forEach((key) => {
      const original = ORIGINAL_ENV[key];
      if (original === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = original;
      }
    });
    jest.restoreAllMocks();
  });

  it('logs that auth is enabled when the config is complete', () => {
    Object.assign(process.env, ACTIVE_ENV);

    expect(() => module.onModuleInit()).not.toThrow();
    expect(log).toHaveBeenCalledWith('Cognito auth enabled');
    expect(warn).not.toHaveBeenCalled();
  });

  it('warns instead of throwing when auth is explicitly disabled', () => {
    process.env.AUTH_DISABLED = 'true';

    expect(() => module.onModuleInit()).not.toThrow();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('AUTH_DISABLED=true');
    expect(log).not.toHaveBeenCalled();
  });

  // Catches an AUTH_DISABLED=true that was left behind in an environment that is otherwise fully configured for Cognito.
  it('adds a second warning when Cognito is configured but auth is disabled', () => {
    Object.assign(process.env, ACTIVE_ENV);
    process.env.AUTH_DISABLED = 'true';

    module.onModuleInit();

    expect(warn).toHaveBeenCalledTimes(2);
    expect(warn.mock.calls[1][0]).toContain('ignored');
  });

  // Misconfiguration must stop the application from starting rather than bringing it up with every route unauthenticated.
  it('throws when the config is unusable and auth was not disabled', () => {
    expect(() => module.onModuleInit()).toThrow(AuthConfigurationError);
    expect(warn).not.toHaveBeenCalled();
    expect(log).not.toHaveBeenCalled();
  });

  it('throws when only part of the Cognito config is present', () => {
    process.env.COGNITO_USER_POOL_ID = ACTIVE_ENV.COGNITO_USER_POOL_ID;

    expect(() => module.onModuleInit()).toThrow(/COGNITO_CLIENT_ID/);
  });

  // The point of the shared REQUIRED_ENV_VARS_WHEN_ENABLED list: one message naming
  // every missing variable, rather than failing on whichever is checked first.
  it('throws listing every missing Cognito variable at once', () => {
    expect(() => module.onModuleInit()).toThrow(
      /COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID/,
    );
  });

  // Proves the throw actually aborts a real Nest bootstrap instead of being swallowed.
  it('aborts Nest initialization when the config is unusable', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CognitoModule],
    }).compile();

    await expect(moduleRef.init()).rejects.toThrow(AuthConfigurationError);
  });

  it('completes Nest initialization when auth is explicitly disabled', async () => {
    process.env.AUTH_DISABLED = 'true';

    const moduleRef = await Test.createTestingModule({
      imports: [CognitoModule],
    }).compile();

    await expect(moduleRef.init()).resolves.toBeDefined();
    await moduleRef.close();
  });

  it('throws when AUTH_DISABLED has an unrecognized value', () => {
    Object.assign(process.env, ACTIVE_ENV);
    process.env.AUTH_DISABLED = 'ture';

    expect(() => module.onModuleInit()).toThrow(AuthConfigurationError);
  });
});
