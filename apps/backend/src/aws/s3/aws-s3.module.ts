import { Global, Logger, Module, OnModuleInit } from '@nestjs/common';
import { AWSS3Service } from './aws-s3.service';

// Required s3 env values.
// Add one entry per bucket here: 
const REQUIRED_ENV_VARS = ['AWS_ACCESS_KEY', 'AWS_SECRET_KEY'] as const;

@Global()
@Module({
  providers: [AWSS3Service],
  exports: [AWSS3Service],
})
export class AWSS3Module implements OnModuleInit {
  private readonly logger = new Logger(AWSS3Module.name);

  onModuleInit(): void {
    // Treat unset and empty/whitespace-only values as missing.
    const missing = REQUIRED_ENV_VARS.filter((name) => {
      const value = process.env[name];
      return !value || value.trim().length === 0;
    });

    if (missing.length > 0) {
      this.logger.warn(
        `S3 not fully configured: missing env vars (${missing.join(
          ', ',
        )}). S3 uploads and downloads will fail.`,
      );
    } else {
      this.logger.log('S3 configured');
    }
  }
}
