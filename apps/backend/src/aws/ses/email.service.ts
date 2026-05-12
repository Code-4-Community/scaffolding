import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import Bottleneck from 'bottleneck';
import { AmazonSESWrapper, SendEmailResult } from './awsSes.wrapper';
import { SendEmailDTO } from './sendEmail.dto';

@Injectable()
export class EmailsService {
  private readonly EMAILS_SENT_PER_SECOND = 14;
  private readonly logger = new Logger(EmailsService.name);
  private readonly limiter: Bottleneck;

  constructor(private amazonSESWrapper: AmazonSESWrapper) {
    this.limiter = new Bottleneck({
      minTime: Math.ceil(1000 / this.EMAILS_SENT_PER_SECOND),
      maxConcurrent: 1,
    });
  }

  /**
   * Sends a separate email to each recipient in the DTO through Amazon SES.
   *
   * Sends are rate-limited to approximately 14 per second to stay under
   * the SES per-account send quota.
   *
   * The DTO is validated at the start of the call via class-validator. Any
   * decorator failure (bad email, oversized attachment, subject with CR/LF,
   * etc.) causes the method to reject with a ValidationError[] before any
   * SES request is made.
   *
   * Sending is skipped (with a warning) when SEND_AUTOMATED_EMAILS is not
   * set to 'true'.
   *
   * @param dto the email payload - validated against SendEmailDTO's decorators
   * @returns one SendEmailResult per recipient (sent or failed), or void when skipped
   * @throws ValidationError[] if the DTO fails validation
   */
  public async sendEmails(
    dto: SendEmailDTO,
  ): Promise<SendEmailResult[] | void> {
    // Since most emails are sent service-to-service, NestJS's global ValidationPipe
    // (which runs on a @Body() dto in a controller) never actually occurs
    //
    // We also need to convert the plain object to an instance of the dto so we can validate it
    const validated = plainToInstance(SendEmailDTO, dto);
    await validateOrReject(validated);

    if (process.env.SEND_AUTOMATED_EMAILS !== 'true') {
      this.logger.warn('SEND_AUTOMATED_EMAILS is not "true". Email not sent.');
      return;
    }

    return this.limiter.schedule(() =>
      this.amazonSESWrapper.sendEmails(validated),
    );
  }
}
