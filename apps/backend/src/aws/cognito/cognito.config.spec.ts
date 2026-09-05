import {
  AuthConfigurationError,
  getCognitoConfig,
  hasAnyCognitoEnv,
  isAuthDisabled,
  REQUIRED_ENV_VARS_WHEN_ENABLED,
} from './cognito.config';

const ENV_KEYS = [
  'AUTH_DISABLED',
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

// Snapshot the auth env once so each test can mutate it freely without
// clobbering a value the developer had set in their own shell.
const ORIGINAL_ENV: Record<string, string | undefined> = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]]),
);

function clearEnv(): void {
  ENV_KEYS.forEach((key) => delete process.env[key]);
}

function setActiveEnv(): void {
  clearEnv();
  Object.assign(process.env, ACTIVE_ENV);
}

describe('cognito.config', () => {
  beforeEach(() => {
    clearEnv();
  });

  // The module owns the list; this asserts the spec's copy still matches it.
  it('declares exactly the required env vars this spec exercises', () => {
    expect([...REQUIRED_ENV_VARS_WHEN_ENABLED]).toEqual([...REQUIRED_ENV_KEYS]);
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
  });

  describe('when the Cognito configuration is complete', () => {
    it('resolves the config and enables auth', () => {
      setActiveEnv();

      expect(getCognitoConfig()).toEqual({
        region: 'us-east-2',
        userPoolId: 'us-east-2_TestPool',
        clientId: 'test-client-id',
        issuer:
          'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_TestPool',
      });
      expect(isAuthDisabled()).toBe(false);
    });

    // COGNITO_REGION is optional and derived from the <region>_<id> pool ID.
    it('derives the region from the user pool ID when COGNITO_REGION is unset', () => {
      setActiveEnv();
      delete process.env.COGNITO_REGION;

      expect(getCognitoConfig()).toMatchObject({ region: 'us-east-2' });
      expect(isAuthDisabled()).toBe(false);
    });

    // AUTH_DISABLED=false is the same as leaving it unset.
    it.each(['false', 'FALSE', '  false  '])(
      'keeps auth enabled when AUTH_DISABLED is %p',
      (value) => {
        setActiveEnv();
        process.env.AUTH_DISABLED = value;

        expect(getCognitoConfig()).not.toBeNull();
        expect(isAuthDisabled()).toBe(false);
      },
    );
  });

  // Auth is only ever off by explicit opt-in, never as a fallback.
  describe('when auth is explicitly disabled', () => {
    it.each(['true', 'TRUE', '  true  '])(
      'disables auth when AUTH_DISABLED is %p',
      (value) => {
        process.env.AUTH_DISABLED = value;

        expect(getCognitoConfig()).toBeNull();
        expect(isAuthDisabled()).toBe(true);
      },
    );

    // The opt-out wins over a present config so that a developer can toggle auth
    // off without deleting their Cognito values.
    it('disables auth even when the Cognito config is complete', () => {
      setActiveEnv();
      process.env.AUTH_DISABLED = 'true';

      expect(getCognitoConfig()).toBeNull();
    });
  });

  // Anything unusable that was not explicitly opted out of is a misconfiguration.
  describe('when the configuration is unusable', () => {
    it.each(REQUIRED_ENV_KEYS)('throws when %s is missing', (missingKey) => {
      setActiveEnv();
      delete process.env[missingKey];

      expect(() => getCognitoConfig()).toThrow(AuthConfigurationError);
      // The message has to name the culprit, since a mistyped variable name is
      // indistinguishable from a missing one from inside the process.
      expect(() => getCognitoConfig()).toThrow(missingKey);
    });

    it.each(REQUIRED_ENV_KEYS)('throws when %s is empty', (emptyKey) => {
      setActiveEnv();
      process.env[emptyKey] = '   ';

      expect(() => getCognitoConfig()).toThrow(AuthConfigurationError);
    });

    it('throws listing every missing variable in a single message', () => {
      expect(() => getCognitoConfig()).toThrow(
        /COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID/,
      );
    });

    it('throws when COGNITO_REGION is unset and cannot be derived', () => {
      setActiveEnv();
      delete process.env.COGNITO_REGION;
      process.env.COGNITO_USER_POOL_ID = 'no-underscore-here';

      expect(() => getCognitoConfig()).toThrow(/COGNITO_REGION is unset/);
    });

    // A typo in the flag must not be read as "not disabled"
    it.each(['ture', 'yes', '1', 'disabled'])(
      'throws when AUTH_DISABLED is %p',
      (value) => {
        setActiveEnv();
        process.env.AUTH_DISABLED = value;

        expect(() => getCognitoConfig()).toThrow(
          /AUTH_DISABLED must be either "true" or "false"/,
        );
      },
    );
  });

  describe('hasAnyCognitoEnv', () => {
    it('is false when no Cognito variable is set', () => {
      expect(hasAnyCognitoEnv()).toBe(false);
    });

    it.each([...REQUIRED_ENV_KEYS, 'COGNITO_REGION'])(
      'is true when only %s is set',
      (key) => {
        process.env[key] = 'some-value';

        expect(hasAnyCognitoEnv()).toBe(true);
      },
    );
  });

  // CognitoJWTGuard serves a request unverified when the config is null or has typos
  describe('the null-iff-AUTH_DISABLED invariant', () => {
    const NOT_DISABLED_FLAGS = [undefined, 'false', 'FALSE', '  false  '];
    const BROKEN_CONFIGS: Array<[string, () => void]> = [
      ['nothing set', () => clearEnv()],
      [
        'only the user pool ID set',
        () => {
          clearEnv();
          process.env.COGNITO_USER_POOL_ID = ACTIVE_ENV.COGNITO_USER_POOL_ID;
        },
      ],
      [
        'only the client ID set',
        () => {
          clearEnv();
          process.env.COGNITO_CLIENT_ID = ACTIVE_ENV.COGNITO_CLIENT_ID;
        },
      ],
      [
        'required values blank',
        () => {
          setActiveEnv();
          process.env.COGNITO_USER_POOL_ID = '   ';
          process.env.COGNITO_CLIENT_ID = '   ';
        },
      ],
      [
        'region absent and not derivable',
        () => {
          setActiveEnv();
          delete process.env.COGNITO_REGION;
          process.env.COGNITO_USER_POOL_ID = 'no-underscore-here';
        },
      ],
    ];

    describe.each(NOT_DISABLED_FLAGS)('with AUTH_DISABLED=%p', (flag) => {
      it.each(BROKEN_CONFIGS)(
        'throws rather than returning null when %s',
        (_label, applyEnv) => {
          applyEnv();
          if (flag === undefined) {
            delete process.env.AUTH_DISABLED;
          } else {
            process.env.AUTH_DISABLED = flag;
          }

          expect(() => getCognitoConfig()).toThrow(AuthConfigurationError);
          expect(isAuthDisabled()).toBe(false);
        },
      );
    });

    it.each(['ture', 'yes', '1', 'disabled'])(
      'throws rather than returning null when AUTH_DISABLED is %p',
      (flag) => {
        clearEnv();
        process.env.AUTH_DISABLED = flag;

        expect(() => getCognitoConfig()).toThrow(AuthConfigurationError);
      },
    );

    it.each(['true', 'TRUE', '  true  '])(
      'returns null only for the explicit opt-out AUTH_DISABLED=%p',
      (flag) => {
        clearEnv();
        process.env.AUTH_DISABLED = flag;

        expect(getCognitoConfig()).toBeNull();
        expect(isAuthDisabled()).toBe(true);
      },
    );
  });
});
