import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

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
