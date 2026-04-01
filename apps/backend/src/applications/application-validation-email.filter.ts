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
import { FIELD_LABELS } from './types';

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

    const errorMessages = this.extractErrorMessages(exceptionResponse);

    try {
      const body = request.body;
      const recipientEmail = body?.email;

      if (!recipientEmail) {
        this.logger.warn(
          'No email found in request body. Skipping error email.',
        );
      } else {
        const applicant = await this.usersService.findOne(recipientEmail);

        if (!applicant) {
          this.logger.warn(
            `No user found for email: ${recipientEmail}. Skipping error email.`,
          );
        } else {
          const applicantName = `${escapeHtml(
            applicant.firstName,
          )} ${escapeHtml(applicant.lastName)}`;

          const emailBody = this.buildEmailBody(
            applicantName,
            body,
            errorMessages,
          );

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

    response.status(status).json(exceptionResponse);
  }

  /**
   * Extracts validation error messages from the exception response
   * and rewrites them with user-friendly field names.
   * @returns An array of sanitized, human-readable error strings.
   */
  private extractErrorMessages(exceptionResponse: string | object): string[] {
    if (typeof exceptionResponse === 'string') {
      return [exceptionResponse];
    }

    const res = exceptionResponse as Record<string, unknown>;

    if (Array.isArray(res.message)) {
      return res.message.map((msg: unknown) =>
        this.humanizeErrorMessage(String(msg)),
      );
    }

    if (typeof res.message === 'string') {
      return [this.humanizeErrorMessage(res.message)];
    }

    return [
      'An unexpected error occurred with your submission. Please try again.',
    ];
  }

  /**
   * Replaces internal camelCase field names in a class-validator error message
   * with their user-friendly labels.
   *
   * Example:
   *   "appStatus must be one of..." → "Application Status must be one of..."
   *   "each value in interest must be one of..." → "Each value in Areas of Interest must be one of..."
   */
  private humanizeErrorMessage(message: string): string {
    // for single fields like appStatus, applicantType, etc.
    const directMatch = message.match(/^(\w+)\s/);

    // for array fields like interest, heardAboutFrom, etc.
    const eachMatch = message.match(/^each value in (\w+)\s/);

    // get the field name from the match
    const field = eachMatch?.[1] ?? directMatch?.[1];

    if (field && FIELD_LABELS[field]) {
      return (
        message.replace(field, FIELD_LABELS[field]).charAt(0).toUpperCase() +
        message.slice(1)
      );
    }

    // capitalize the first letter of the message
    return message.charAt(0).toUpperCase() + message.slice(1);
  }

  /**
   * Builds the HTML email body for a failed application submission.
   */
  private buildEmailBody(
    applicantName: string,
    requestBody: Record<string, unknown>,
    errorMessages: string[],
  ): string {
    // format the error messages into a list of <li> tags
    const errorList = errorMessages
      .map((msg) => `<li style="margin-bottom:8px;">${escapeHtml(msg)}</li>`)
      .join('\n');

    // format the submitted fields into a user-friendly HTML table
    const submittedFieldsHtml = this.formatSubmittedFields(requestBody);

    return `<p>Hello ${applicantName},</p>
      <p>We were unable to process your application due to an issue with the information provided.</p>
      <p><strong>What needs to be corrected:</strong></p>
      <ul style="margin:8px 0;">
      ${errorList}
      </ul>
      <p><strong>Your submitted information:</strong></p>
      ${submittedFieldsHtml}
      <p>Please review the information above and resubmit your application through the PandaDoc form with the correct details.</p>
      ${escapeHtml(this.pandaDocLink)}
      <p>We appreciate your time and apologize for the inconvenience.</p>
      <p>Best regards,<br/>Boston Health Care for the Homeless Program</p>`;
  }

  /**
   * Formats request body fields into a user-friendly HTML table.
   * Only includes fields that have a friendly label defined in FIELD_LABELS.
   * Skips null/undefined values.
   */
  private formatSubmittedFields(body: Record<string, unknown>): string {
    const rows = Object.entries(FIELD_LABELS)
      .filter(([key]) => key in body && body[key] != null && body[key] !== '')
      .map(([key, label]) => {
        const rawValue = body[key];
        const displayValue = Array.isArray(rawValue)
          ? rawValue.join(', ')
          : String(rawValue);
        return `<tr>
  <td style="padding:4px 12px 4px 0;font-weight:bold;vertical-align:top;">${escapeHtml(
    label,
  )}</td>
  <td style="padding:4px 0;">${escapeHtml(displayValue)}</td>
</tr>`;
      })
      .join('\n');

    return `<table style="border-collapse:collapse;font-family:inherit;">\n${rows}\n</table>`;
  }
}
