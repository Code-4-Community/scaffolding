import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';

/**
 * Controller to expose callable HTTP endpoints to
 * manage email communications
 */
@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  /**
   * Exposes an endpoint to send a test email to a recipient
   * @param body object optionally containing information about the
   *             contents of the test email, and the recipient.
   *             Currently the data passed into the body is not actually being used.
   * @returns object containing message 'Email queued'
   * @throws BadRequestException if the desired email for testing is not specified
   *         Anything that the external email management client, in this case AWS SES, throws.
   *
   */
  @Post('test')
  async sendTestEmail(
    @Body()
    body: {
      recipientEmail: string;
      subject?: string;
      bodyHTML?: string;
    },
  ) {
    // REPLACE recipientEmail WITH desired email for testing
    const {
      recipientEmail = 'insertemailhere@domain.com',
      subject = 'Test email',
      bodyHTML = '<p>Test email</p>',
    } = body;

    if (!recipientEmail) {
      throw new BadRequestException('recipientEmail is required');
    }

    await this.emailService.queueEmail(recipientEmail, subject, bodyHTML);
    return { message: 'Email queued' };
  }
}
