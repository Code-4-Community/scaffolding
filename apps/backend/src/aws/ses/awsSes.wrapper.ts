import { Inject, Injectable } from '@nestjs/common';
import {
  SESv2Client,
  SendEmailCommand,
  SendEmailCommandOutput,
} from '@aws-sdk/client-sesv2';
import MailComposer from 'nodemailer/lib/mail-composer';
import Mail from 'nodemailer/lib/mailer';
import { AMAZON_SES_CLIENT } from './awsSesClient.factory';
import { EmailAttachmentDto, SendEmailDTO } from './sendEmail.dto';

/**
 * Outcome of attempting to send to one recipient. Discriminated by `status`
 */
export type SendEmailResult =
  | { recipient: string; status: 'sent'; output: SendEmailCommandOutput }
  | { recipient: string; status: 'failed'; error: string };

@Injectable()
export class AmazonSESWrapper {
  private readonly senderEmail: string;

  /**
   * @param client SESv2 client from `awsSesClient.factory.ts`
   */
  constructor(@Inject(AMAZON_SES_CLIENT) private readonly client: SESv2Client) {
    const senderEmail = process.env.AWS_SES_SENDER_EMAIL;
    if (!senderEmail) throw new Error('AWS_SES_SENDER_EMAIL is not defined');
    this.senderEmail = senderEmail;
  }

  /**
   * Sends a separate email to each recipient in the DTO via Amazon SES, so
   * recipients cannot see each other's addresses. Every recipient is
   * attempted The caller gets one SendEmailResult per recipient in
   * input order describing whether the send succeeded or failed.
   *
   * @param dto the email payload
   * @returns one SendEmailResult per recipient, in input order
   */
  async sendEmails(dto: SendEmailDTO): Promise<SendEmailResult[]> {
    const results: SendEmailResult[] = [];
    // Send emails one at a time, recording each outcome so a partial failure
    // doesn't silently drop the recipients that come after it.
    for (const recipient of dto.toEmails) {
      try {
        const output = await this.sendOne(
          recipient,
          dto.subject,
          dto.bodyHtml,
          dto.attachments,
        );
        results.push({ recipient, status: 'sent', output });
      } catch (err) {
        results.push({
          recipient,
          status: 'failed',
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
    return results;
  }

  /**
   * Sends a single email to one recipient. Composes the MIME message (so
   * attachments are supported) and dispatches it via SendEmailCommand.
   * Used internally by sendEmails to fan out one message per recipient.
   *
   * @param recipient the recipient address
   * @param subject the subject of the email
   * @param bodyHtml the HTML body of the email
   * @param attachments any attachments to include in the email
   * @returns the SES response, containing MessageId (SES's unique id for the sent message)
   * and metadata (HTTP status, AWS request id, retry counts)
   * @throws Error if MIME composition fails (bad attachment, oversized payload)
   * or if SES rejects the send (bad recipient, throttling, unverified sender, quota exceeded).
   */
  private async sendOne(
    recipient: string,
    subject: string,
    bodyHtml: string,
    attachments?: EmailAttachmentDto[],
  ): Promise<SendEmailCommandOutput> {
    const mailOptions: Mail.Options = {
      from: this.senderEmail,
      to: recipient,
      subject,
      html: bodyHtml,
    };

    if (attachments) {
      mailOptions.attachments = attachments.map((a) => ({
        filename: a.filename,
        content: a.content,
      }));
    }

    try {
      const messageData = await new MailComposer(mailOptions).compile().build();
      const command = new SendEmailCommand({
        Destination: { ToAddresses: [recipient] },
        Content: { Raw: { Data: messageData } },
      });
      return await this.client.send(command);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }
}
