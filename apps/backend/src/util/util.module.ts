import { Module } from '@nestjs/common';
import { amazonSESClientFactory } from './email/amazon-ses-client.factory';
import { AmazonSESWrapper } from './email/amazon-ses.wrapper';
import { EmailService } from './email/email.service';
import { EmailController } from './email/email.controller';

@Module({
  providers: [EmailService, amazonSESClientFactory, AmazonSESWrapper],
  exports: [EmailService],
  controllers: [EmailController],
})
export class UtilModule {}
