import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { EmailService } from '../../util/email/email.service';

/**
 * Exception filter that sends an error notification email when
 * `POST /api/applications` fails after the body is parsed.
 *
 * Handles all other exceptions and sends an email to the
 * applicant if the request body includes an `email` recipient.
 */
@Catch(Error)
export class ApplicationCreationErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApplicationCreationErrorFilter.name);

  constructor(private readonly emailService: EmailService) {}

  /**
   * Nest entrypoint: sends an error notification email to the applicant if the request body includes an `email` recipient.
   *
   * @param exception The exception that was thrown.
   * @param host Nest execution context; used to read the HTTP request and write the response.
   * @returns Resolves after the response is sent (email failures are logged and do not change the HTTP outcome).
   */
  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // BadRequestException is handled by ApplicationValidationEmailFilter (see controller @UseFilters order + Nest's filter reversal).
    try {
      const body = request.body as Record<string, unknown> | undefined;
      const recipientEmail = body?.email;

      if (recipientEmail) {
        await this.emailService.queueEmail(
          String(recipientEmail),
          'Issue with Your Application Submission',
          `<p>Hello,</p>
           <p>We encountered an unexpected issue while processing your application. 
           Your submission was <strong>not</strong> saved.</p>
           <p>Please try submitting your application again. If the issue persists, 
           contact our team for assistance.</p>
           <p>We apologize for the inconvenience.</p>
           <p>Best regards,<br/>Boston Health Care for the Homeless Program</p>`,
        );
        this.logger.log(`Creation error email sent to ${recipientEmail}`);
      }
    } catch (emailError) {
      this.logger.error(
        'Failed to send creation error email',
        emailError instanceof Error ? emailError.stack : emailError,
      );
    }

    // Return generic 500
    response.status(500).json({
      message:
        'An unexpected error occurred while processing your application.',
      statusCode: 500,
    });
  }
}
