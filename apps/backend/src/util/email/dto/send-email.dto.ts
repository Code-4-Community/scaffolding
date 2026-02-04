import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { EmailAttachment } from '../amazon-ses.wrapper';

export class SendEmailDto {
  /**
   * The email address of the recipient.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  to: string;

  /**
   * The subject of the email.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  subject: string;

  /**
   * The body content of the email.
   */
  @IsString()
  @IsNotEmpty()
  body: string;

  /**
   * Optional attachments for the email.
   */
  @IsOptional()
  attachments?: EmailAttachment[];
}
