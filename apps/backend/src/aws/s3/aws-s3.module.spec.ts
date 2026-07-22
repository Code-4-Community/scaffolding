import { AWSS3Module } from './aws-s3.module';

describe('AWSS3Module', () => {
  let module: AWSS3Module;

  beforeEach(() => {
    process.env.AWS_ACCESS_KEY = 'test-access-key';
    process.env.AWS_SECRET_KEY = 'test-secret-key';
    module = new AWSS3Module();
  });

  it('should not throw when required env vars are set', () => {
    expect(() => module.onModuleInit()).not.toThrow();
  });

  it('should throw if AWS_ACCESS_KEY is missing', () => {
    delete process.env.AWS_ACCESS_KEY;

    expect(() => module.onModuleInit()).toThrow(
      'Missing required environment variable: AWS_ACCESS_KEY',
    );
  });

  it('should throw if AWS_SECRET_KEY is missing', () => {
    delete process.env.AWS_SECRET_KEY;

    expect(() => module.onModuleInit()).toThrow(
      'Missing required environment variable: AWS_SECRET_KEY',
    );
  });

  it('should throw if an env var is whitespace-only', () => {
    process.env.AWS_ACCESS_KEY = '   ';

    expect(() => module.onModuleInit()).toThrow(
      'Missing required environment variable: AWS_ACCESS_KEY',
    );
  });
});
