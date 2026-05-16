import { Test } from '@nestjs/testing';
import { SendEmailCommandOutput } from '@aws-sdk/client-sesv2';
import { AmazonSESWrapper } from './awsSes.wrapper';
import { EmailsService } from './email.service';
import { SendEmailDTO } from './sendEmail.dto';

describe('EmailsService', () => {
  let service: EmailsService;
  let mockWrapper: { sendEmail: jest.Mock };

  const originalSendFlag = process.env.SEND_AUTOMATED_EMAILS;

  const validDto: SendEmailDTO = {
    toEmail: 'recipient@example.com',
    subject: 'Hello',
    bodyHtml: '<p>Hi there</p>',
  };

  const successOutput: SendEmailCommandOutput = {
    MessageId: 'msg-1',
    $metadata: { httpStatusCode: 200 },
  } as SendEmailCommandOutput;

  beforeEach(async () => {
    mockWrapper = { sendEmail: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [
        EmailsService,
        { provide: AmazonSESWrapper, useValue: mockWrapper },
      ],
    }).compile();

    service = moduleRef.get<EmailsService>(EmailsService);
  });

  afterEach(() => {
    if (originalSendFlag === undefined) {
      delete process.env.SEND_AUTOMATED_EMAILS;
    } else {
      process.env.SEND_AUTOMATED_EMAILS = originalSendFlag;
    }
  });

  describe('sendEmail', () => {
    it('does not call the wrapper when SEND_AUTOMATED_EMAILS is not "true"', async () => {
      process.env.SEND_AUTOMATED_EMAILS = 'false';

      const result = await service.sendEmail(validDto);

      expect(result).toBeUndefined();
      expect(mockWrapper.sendEmail).not.toHaveBeenCalled();
    });

    it('rate-limits sends to roughly 14 per second', async () => {
      process.env.SEND_AUTOMATED_EMAILS = 'true';
      mockWrapper.sendEmail.mockResolvedValue(successOutput);

      const calls = 10;
      // Bottleneck enforces minTime = ceil(1000 / 14) = 72ms between job starts
      // With maxConcurrent=1 and immediate-resolving mocks, n jobs take ~(n-1)*72ms
      const minTimeMs = Math.ceil(1000 / 14);
      const expectedMinElapsed = (calls - 1) * minTimeMs;

      const start = Date.now();
      await Promise.all(
        Array.from({ length: calls }, () => service.sendEmail(validDto)),
      );
      const elapsed = Date.now() - start;

      expect(mockWrapper.sendEmail).toHaveBeenCalledTimes(calls);
      // Allow a small downward tolerance for timer scheduling jitters
      expect(elapsed).toBeGreaterThanOrEqual(expectedMinElapsed - 20);
    });

    it('rejects without calling the wrapper when the DTO is invalid', async () => {
      process.env.SEND_AUTOMATED_EMAILS = 'true';

      const invalidDto: SendEmailDTO = {
        toEmail: 'not-a-real-email',
        subject: 'Hello',
        bodyHtml: '<p>Hi</p>',
      };

      await expect(service.sendEmail(invalidDto)).rejects.toBeDefined();
      expect(mockWrapper.sendEmail).not.toHaveBeenCalled();
    });

    it('returns the wrapper output when sending succeeds', async () => {
      process.env.SEND_AUTOMATED_EMAILS = 'true';
      mockWrapper.sendEmail.mockResolvedValue(successOutput);

      const result = await service.sendEmail(validDto);

      expect(mockWrapper.sendEmail).toHaveBeenCalledTimes(1);
      expect(result).toBe(successOutput);
    });

    it('propagates errors thrown by the wrapper', async () => {
      process.env.SEND_AUTOMATED_EMAILS = 'true';
      mockWrapper.sendEmail.mockRejectedValue(
        new Error('SES rejected: throttled'),
      );

      await expect(service.sendEmail(validDto)).rejects.toThrow(
        'SES rejected: throttled',
      );
      expect(mockWrapper.sendEmail).toHaveBeenCalledTimes(1);
    });

    it('passes ccEmails and bccEmails through to the wrapper', async () => {
      process.env.SEND_AUTOMATED_EMAILS = 'true';
      mockWrapper.sendEmail.mockResolvedValue(successOutput);

      const dto: SendEmailDTO = {
        toEmail: 'recipient@example.com',
        ccEmails: ['cc1@example.com', 'cc2@example.com'],
        bccEmails: ['bcc@example.com'],
        subject: 'Hello',
        bodyHtml: '<p>Hi</p>',
      };

      await service.sendEmail(dto);

      expect(mockWrapper.sendEmail).toHaveBeenCalledTimes(1);
      expect(mockWrapper.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          ccEmails: ['cc1@example.com', 'cc2@example.com'],
          bccEmails: ['bcc@example.com'],
        }),
      );
    });

    it('rejects when ccEmails contains an invalid address', async () => {
      process.env.SEND_AUTOMATED_EMAILS = 'true';

      const dto: SendEmailDTO = {
        toEmail: 'recipient@example.com',
        ccEmails: ['not-an-email'],
        subject: 'Hello',
        bodyHtml: '<p>Hi</p>',
      };

      await expect(service.sendEmail(dto)).rejects.toBeDefined();
      expect(mockWrapper.sendEmail).not.toHaveBeenCalled();
    });

    it('rejects when bccEmails contains an invalid address', async () => {
      process.env.SEND_AUTOMATED_EMAILS = 'true';

      const dto: SendEmailDTO = {
        toEmail: 'recipient@example.com',
        bccEmails: ['also-not-an-email'],
        subject: 'Hello',
        bodyHtml: '<p>Hi</p>',
      };

      await expect(service.sendEmail(dto)).rejects.toBeDefined();
      expect(mockWrapper.sendEmail).not.toHaveBeenCalled();
    });
  });
});
