import { EmailsModule } from './email.module';

describe('EmailsModule', () => {
  const ENV_VARS = [
    'SEND_AUTOMATED_EMAILS',
    'AWS_REGION',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_SES_SENDER_EMAIL',
  ] as const;

  const REQUIRED_WHEN_ENABLED = [
    'AWS_REGION',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_SES_SENDER_EMAIL',
  ] as const;

  const originalEnv: Record<string, string | undefined> = {};
  let module: EmailsModule;

  beforeEach(() => {
    for (const name of ENV_VARS) {
      originalEnv[name] = process.env[name];
    }

    // Default to a fully-configured, enabled setup; individual tests override.
    process.env.SEND_AUTOMATED_EMAILS = 'true';
    process.env.AWS_REGION = 'us-east-2';
    process.env.AWS_ACCESS_KEY_ID = 'test-access-key-id';
    process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-access-key';
    process.env.AWS_SES_SENDER_EMAIL = 'sender@example.com';

    module = new EmailsModule();
  });

  afterEach(() => {
    for (const name of ENV_VARS) {
      if (originalEnv[name] === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = originalEnv[name];
      }
    }
  });

  describe('onModuleInit', () => {
    it('does not throw when all required env vars are set and enabled', () => {
      expect(() => module.onModuleInit()).not.toThrow();
    });

    it('does not throw when disabled, even if required vars are missing', () => {
      process.env.SEND_AUTOMATED_EMAILS = 'false';
      for (const name of REQUIRED_WHEN_ENABLED) {
        delete process.env[name];
      }
      expect(() => module.onModuleInit()).not.toThrow();
    });

    it('does not throw when SEND_AUTOMATED_EMAILS is unset', () => {
      delete process.env.SEND_AUTOMATED_EMAILS;
      for (const name of REQUIRED_WHEN_ENABLED) {
        delete process.env[name];
      }
      expect(() => module.onModuleInit()).not.toThrow();
    });

    it.each(REQUIRED_WHEN_ENABLED)(
      'throws when enabled and %s is missing',
      (name) => {
        delete process.env[name];
        expect(() => module.onModuleInit()).toThrow(
          `Missing required environment variable: ${name}`,
        );
      },
    );

    it('throws when enabled and a required var is empty/whitespace-only', () => {
      process.env.AWS_SES_SENDER_EMAIL = '   ';
      expect(() => module.onModuleInit()).toThrow(
        'Missing required environment variable: AWS_SES_SENDER_EMAIL',
      );
    });
  });
});
