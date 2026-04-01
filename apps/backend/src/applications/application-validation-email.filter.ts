import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EmailService } from '../util/email/email.service';
import { UsersService } from '../users/users.service';

// Helper function to escape HTML characters in the error message (avoid XSS)
// TODO: can remove or use a separate library for security handling
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Exception filter that sends an error notification email when the
 * POST /api/applications endpoint fails due to validation errors.
 *
 * Applied at the controller-method level so it only intercepts
 * BadRequestExceptions thrown during application creation.
 */
@Catch(BadRequestException)
export class ApplicationValidationEmailFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApplicationValidationEmailFilter.name);

  // TODO: Replace with production PandaDoc form URL
  private readonly pandaDocLink =
    'https://eform.pandadoc.com/?eform=e27f6460-7fa2-40f2-825b-4a83c507b9fe';

  constructor(
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  async catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract the validation error message(s)
    const errorMessage = this.sanitizeErrorMessage(exceptionResponse);

    // Best-effort email: never let email failure affect the error response
    try {
      const body = request.body;
      const recipientEmail = body?.email;

      if (!recipientEmail) {
        this.logger.warn(
          'No email found in request body. Skipping error email.',
        );
      } else {
        // this.logger.log(`Looking up user by email: ${recipientEmail}`);
        const applicant = await this.usersService.findOne(recipientEmail);

        if (!applicant) {
          this.logger.warn(
            `No user found for email: ${recipientEmail}. Skipping error email.`,
          );
        } else {
          const applicantName = `${escapeHtml(
            applicant.firstName,
          )} ${escapeHtml(applicant.lastName)}`;
          // this.logger.log(`Found user: ${applicantName}. Building email body...`);

          const emailBody = this.buildEmailBody(
            applicantName,
            body,
            errorMessage,
          );
          // this.logger.log('Email body built. Sending email...');

          await this.emailService.queueEmail(
            recipientEmail,
            'Action Required: Issue with Your Application Submission',
            emailBody,
          );
          this.logger.log(
            `Validation error email sent successfully to ${recipientEmail}`,
          );
        }
      }
    } catch (emailError) {
      this.logger.error(
        `Failed to send validation error email`,
        emailError instanceof Error ? emailError.stack : emailError,
      );
    }

    // Always return the original error response to the client
    response.status(status).json(exceptionResponse);
  }

  /**
   * Extracts a user-safe error message from the exception response.
   * Handles both string messages and class-validator's { message: string[] } format.
   */
  private sanitizeErrorMessage(exceptionResponse: string | object): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    const res = exceptionResponse as Record<string, unknown>;

    // if the exception response is an array of strings
    // NestJS ValidationPipe combines all the validation errors into a single array
    if (Array.isArray(res.message)) {
      return res.message.map((msg: unknown) => String(msg)).join('\n');
    }

    // if the exception response is just one string
    if (typeof res.message === 'string') {
      return res.message;
    }

    return 'An unexpected error occurred with your submission. Please try again.';
  }

  /**
   * Builds the HTML email body for a failed application submission.
   */
  private buildEmailBody(
    applicantName: string,
    requestBody: Record<string, unknown>,
    errorMessage: string,
  ): string {
    const submittedFields = escapeHtml(JSON.stringify(requestBody, null, 2));

    const linkBlock = this.pandaDocLink
      ? `<p><a href="${escapeHtml(
          this.pandaDocLink,
        )}">Click here to resubmit your application</a></p>`
      : '';

    return `<p>Hello ${applicantName},</p>
    <p>We were unable to process your application due to an issue with the information provided.</p>
    <p><strong>What needs to be corrected:</strong></p>
    <p>${escapeHtml(errorMessage)}</p>
    <p><strong>Your submitted information:</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit;">${submittedFields}</pre>
    <p>Please review the information above and resubmit your application through the PandaDoc form with the correct details.</p>
    ${linkBlock}
    <p>We appreciate your time and apologize for the inconvenience.</p>
    <p>Best regards,<br/>Boston Health Care for the Homeless Program</p>`;
  }
}
