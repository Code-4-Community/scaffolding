import { AWSS3Module } from './aws-s3.module';

describe('AWSS3Module', () => {
  let module: AWSS3Module;
  let warnSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    process.env.AWS_ACCESS_KEY_ID = 'test-access-key';
    process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';
    module = new AWSS3Module();

    warnSpy = jest
      .spyOn(module['logger'], 'warn')
      .mockImplementation(() => undefined);
    logSpy = jest
      .spyOn(module['logger'], 'log')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log and not warn when required env vars are set', () => {
    module.onModuleInit();

    expect(warnSpy).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('S3 configured');
  });

  it('should warn if AWS_ACCESS_KEY_ID is missing', () => {
    delete process.env.AWS_ACCESS_KEY_ID;

    expect(() => module.onModuleInit()).not.toThrow();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('AWS_ACCESS_KEY_ID'),
    );
  });

  it('should warn if AWS_SECRET_ACCESS_KEY is missing', () => {
    delete process.env.AWS_SECRET_ACCESS_KEY;

    expect(() => module.onModuleInit()).not.toThrow();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('AWS_SECRET_ACCESS_KEY'),
    );
  });

  it('should warn if an env var is whitespace-only', () => {
    process.env.AWS_ACCESS_KEY_ID = '   ';

    expect(() => module.onModuleInit()).not.toThrow();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('AWS_ACCESS_KEY_ID'),
    );
  });

  it('should list every missing env var in a single warning', () => {
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;

    module.onModuleInit();

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY'),
    );
  });
});
