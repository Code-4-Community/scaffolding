import { Module, OnModuleInit } from '@nestjs/common';
import { EmailsService } from './email.service';
import { AmazonSESWrapper } from './awsSes.wrapper';
import { AmazonSESClientFactory } from './awsSesClient.factory';

// Env vars required only when SES dispatch is enabled (SEND_AUTOMATED_EMAILS === 'true')
const REQUIRED_ENV_VARS_WHEN_ENABLED = [
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_SES_SENDER_EMAIL',
] as const;

@Module({
  providers: [AmazonSESWrapper, AmazonSESClientFactory, EmailsService],
  exports: [EmailsService],
})
export class EmailsModule implements OnModuleInit {
  onModuleInit(): void {
    // Email sending is disabled: skip validation so teams not using SES can
    // boot without any AWS config.
    if (process.env.SEND_AUTOMATED_EMAILS?.toLowerCase() !== 'true') {
      return;
    }

    for (const name of REQUIRED_ENV_VARS_WHEN_ENABLED) {
      const value = process.env[name];
      // Treat unset and empty/whitespace-only values as missing.
      if (!value || value.trim().length === 0) {
        throw new Error(`Missing required environment variable: ${name}`);
      }
    }
  }
}
