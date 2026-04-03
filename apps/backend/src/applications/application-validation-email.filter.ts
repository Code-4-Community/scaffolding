import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EmailService } from '../util/email/email.service';
import { FIELD_LABELS } from './types';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Exception filter that sends an error notification email when
 * `POST /api/applications` fails after the body is parsed.
 *
 * Handles {@link BadRequestException} from `ValidationPipe` / class-validator (DTO shape and rules).
 * Database errors on the same route are handled by the global {@link TypeOrmExceptionFilter} and do not trigger this email.
 */
@Catch(BadRequestException)
export class ApplicationValidationEmailFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApplicationValidationEmailFilter.name);

  // TODO: Replace with production PandaDoc form URL
  private readonly pandaDocLink =
    'https://eform.pandadoc.com/?eform=e27f6460-7fa2-40f2-825b-4a83c507b9fe';

  constructor(private readonly emailService: EmailService) {}

  /**
   * Nest entrypoint: records humanized validation messages, sends a best-effort email to `body.email`,
   * then returns the same HTTP status and JSON body Nest would have sent without this filter.
   *
   * @param exception Thrown by `ValidationPipe` or other code as `BadRequestException` on the create route.
   * @param host Nest execution context; used to read the HTTP request and write the response.
   * @returns Resolves after the response is sent (email failures are logged and do not change the HTTP outcome).
   */
  async catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const errorMessages = this.extractErrorMessages(exceptionResponse);

    // Send email to the applicant if the request body includes an `email` recipient
    await this.trySendSubmissionErrorEmail(request, errorMessages);

    response.status(status).json(exceptionResponse);
  }

  /**
   * Builds and queues the submission-error email when the request body includes an `email` recipient.
   * Swallows email transport errors so validation responses are never blocked.
   *
   * @param request Express request whose `body` should match the create-application DTO shape.
   * @param errorMessages Lines to show under “What needs to be corrected” (already humanized for validators).
   * @returns Resolves when queuing finishes or when skipped; does not throw on SES/queue failures.
   */
  private async trySendSubmissionErrorEmail(
    request: Request,
    errorMessages: string[],
  ): Promise<void> {
    try {
      const body = request.body as Record<string, unknown> | undefined;
      const recipientEmail = body?.email;

      if (!recipientEmail) {
        this.logger.warn(
          'No email found in request body. Skipping error email.',
        );
        return;
      }

      const applicantName = 'Applicant';

      const emailBody = this.buildEmailBody(
        applicantName,
        body ?? {},
        errorMessages,
      );

      await this.emailService.queueEmail(
        String(recipientEmail),
        'Action Required: Issue with Your Application Submission',
        emailBody,
      );
      this.logger.log(
        `Application submission error email sent successfully to ${recipientEmail}`,
      );
    } catch (emailError) {
      this.logger.error(
        `Failed to send application submission error email`,
        emailError instanceof Error ? emailError.stack : emailError,
      );
    }
  }

  /**
   * Pulls user-facing text from a NestJS `BadRequestException` response body and normalizes it to a list of lines.
   * When `message` is an array or string (typical for `ValidationPipe`), each entry is passed through {@link humanizeErrorMessage}.
   *
   * @param exceptionResponse Value from `exception.getResponse()`: either a plain string or an object (often `{ message: string | string[], statusCode: number }`).
   * @returns One or more human-readable error lines; a single-item fallback if the shape is unrecognized.
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
   * Rewrites validator wording that starts with a DTO property key (or `each value in &lt;key&gt;`) using {@link FIELD_LABELS}.
   * Capitalizes the first character of the result for sentence-style email copy.
   *
   * @param message Raw class-validator message, e.g. `appStatus must be one of the following values` or `each value in interest must be...`.
   * @returns The same message with the matched field key replaced by its label when defined; otherwise the original string with its first letter uppercased.
   *
   * @example
   * `"appStatus must be one of..."` → `"Application Status must be one of..."`
   * @example
   * `"each value in interest must be one of..."` → `"Each value in Areas of Interest must be one of..."`
   */
  private humanizeErrorMessage(message: string): string {
    // for single fields like appStatus, applicantType, etc.
    const directMatch = message.match(/^(\w+)\s/);

    // for array fields like interest, heardAboutFrom, etc.
    const eachMatch = message.match(/^each value in (\w+)\s/);

    // get the field name from the match
    const field = eachMatch?.[1] ?? directMatch?.[1];

    if (field && FIELD_LABELS[field]) {
      const replaced = message.replace(field, FIELD_LABELS[field]);
      return replaced.charAt(0).toUpperCase() + replaced.slice(1);
    }

    // capitalize the first letter of the message
    return message.charAt(0).toUpperCase() + message.slice(1);
  }

  /**
   * Assembles the HTML body for the “application validation failed” notification email.
   * Escapes dynamic text where needed; `applicantName` is expected to be pre-escaped for HTML.
   *
   * @param applicantName Greeting name (typically first and last), already safe for HTML interpolation.
   * @param requestBody Parsed POST body used to render the submitted-field summary table.
   * @param errorMessages Lines produced by {@link extractErrorMessages}, shown as a bulleted list.
   * @returns A fragment of HTML suitable for the MIME `text/html` part (no outer `<html>` wrapper).
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
   * Renders a two-column HTML table: friendly labels (from {@link FIELD_LABELS}) and stringified values.
   * Only iterates keys that exist in `FIELD_LABELS` and omits empty or nullish body values.
   *
   * @param body The application create payload as received on the request (property keys match DTO fields).
   * @returns An HTML `<table>` element with escaped cell text, or an empty table if no labeled fields qualify.
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
