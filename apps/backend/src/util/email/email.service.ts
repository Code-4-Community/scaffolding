import { Injectable, Logger } from '@nestjs/common';
import { AmazonSESWrapper } from './amazon-ses.wrapper';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(private amazonSESWrapper: AmazonSESWrapper) {}

  /**
   * Queues the email to be sent.
   *
   * @param recipientEmail the email address of the recipient
   * @param subject the subject of the email
   * @param bodyHTML the HTML body of the email
   */
  public async queueEmail(
    recipientEmail: string,
    subject: string,
    bodyHTML: string,
  ): Promise<void> {
    try {
      await this.sendEmail(recipientEmail, subject, bodyHTML);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to queue/send email to ${recipientEmail} (subject: ${subject})`,
        err?.stack,
      );
      throw error;
    }
  }

  /**
   * Sends an email.
   *
   * @param recipientEmail the email address of the recipients
   * @param subject the subject of the email
   * @param bodyHtml the HTML body of the email
   */
  private async sendEmail(
    recipientEmail: string,
    subject: string,
    bodyHTML: string,
  ): Promise<unknown> {
    try {
      return await this.amazonSESWrapper.sendEmails(
        [recipientEmail],
        subject,
        bodyHTML,
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to send email to ${recipientEmail} (subject: ${subject})`,
        err?.stack,
      );
      throw error;
    }
  }
}
