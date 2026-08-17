import { Global, Module, OnModuleInit } from '@nestjs/common';
import { AWSS3Service } from './aws-s3.service';

// Required s3 env values
const REQUIRED_ENV_VARS = ['AWS_ACCESS_KEY', 'AWS_SECRET_KEY'] as const;

@Global()
@Module({
  providers: [AWSS3Service],
  exports: [AWSS3Service],
})
export class AWSS3Module implements OnModuleInit {
  onModuleInit(): void {
    for (const name of REQUIRED_ENV_VARS) {
      const value = process.env[name];
      // Treat unset and empty/whitespace-only values as missing.
      if (!value || value.trim().length === 0) {
        throw new Error(`Missing required environment variable: ${name}`);
      }
    }
  }
}
