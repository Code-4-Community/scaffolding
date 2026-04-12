import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { CurrentUserInterceptor } from '../../interceptors/current-user.interceptor';
import { RolesGuard } from '../../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserType } from '../../users/types';
import { Roles } from '../../auth/roles.decorator';

/**
 * Controller to expose callable HTTP endpoints to
 * manage email communications.
 */
@Controller('email')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(CurrentUserInterceptor)
export class EmailController {
  constructor(private emailService: EmailService) {}

  /**
   * Exposes an endpoint to send an email to a recipient.
   * @param body object optionally containing information about the
   *             contents of the email, and the recipient.
   * @returns object containing message 'Email queued'
   */
  @Post('send')
  @Roles(UserType.ADMIN)
  async sendEmail(@Body() sendEmailDTO: SendEmailDto) {
    const { to, subject, body, attachments } = sendEmailDTO;
    await this.emailService.queueEmail(to, subject, body, attachments);
    return { message: 'Email queued' };
  }
}
