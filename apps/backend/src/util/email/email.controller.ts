import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';

/**
 * Controller to expose callable HTTP endpoints to
 * manage email communications.
 */
@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  /**
   * Exposes an endpoint to send an email to a recipient.
   * @param body object optionally containing information about the
   *             contents of the email, and the recipient.
   * @returns object containing message 'Email queued'
   */
  @Post('send')
  async sendTestEmail(@Body() sendEmailDTO: SendEmailDto) {
    const { to, subject, body, attachments } = sendEmailDTO;
    await this.emailService.queueEmail(to, subject, body, attachments);
    return { message: 'Email queued' };
  }
}
