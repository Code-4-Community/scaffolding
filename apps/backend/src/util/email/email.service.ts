import { Injectable, Logger } from '@nestjs/common';
import { AmazonSESWrapper } from './amazon-ses.wrapper';

/**
 * Interfaces with a service that interfaces with Amazon SES to manage email sending.
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(private amazonSESWrapper: AmazonSESWrapper) {}

  /**
   * Queues the email to be sent using the external email management service (AWS SES).
   *
   * @param recipientEmail the email address of the recipient.
   * @param subject the subject of the email.
   * @param bodyHTML the HTML body of the email.
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
   * Sends an email using the external email management service (AWS SES).
   *
   * @param recipientEmail the email address of the recipients.
   * @param subject the subject of the email.
   * @param bodyHtml the HTML body of the email.
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
