import { Test } from '@nestjs/testing';
import { SendEmailCommandOutput } from '@aws-sdk/client-sesv2';
import { AmazonSESWrapper, SendEmailResult } from './awsSes.wrapper';
import { EmailsService } from './email.service';
import { SendEmailDTO } from './sendEmail.dto';

describe('EmailsService', () => {
  let service: EmailsService;
  let mockWrapper: { sendEmails: jest.Mock };

  const originalSendFlag = process.env.SEND_AUTOMATED_EMAILS;

  const validDto: SendEmailDTO = {
    toEmails: ['recipient@example.com'],
    subject: 'Hello',
    bodyHtml: '<p>Hi there</p>',
  };

  beforeEach(async () => {
    mockWrapper = { sendEmails: jest.fn() };

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

  describe('sendEmails', () => {
    it('does not call the wrapper when SEND_AUTOMATED_EMAILS is not "true"', async () => {
      process.env.SEND_AUTOMATED_EMAILS = 'false';

      const result = await service.sendEmails(validDto);

      expect(result).toBeUndefined();
      expect(mockWrapper.sendEmails).not.toHaveBeenCalled();
    });

    it('rate-limits sends to roughly 14 per second', async () => {
      process.env.SEND_AUTOMATED_EMAILS = 'true';
      mockWrapper.sendEmails.mockResolvedValue([
        { recipient: 'recipient@example.com', status: 'sent', output: {} },
      ]);

      const calls = 10;
      // Bottleneck enforces minTime = ceil(1000 / 14) = 72ms between job starts
      // With maxConcurrent=1 and immediate-resolving mocks, n jobs take ~(n-1)*72ms
      const minTimeMs = Math.ceil(1000 / 14);
      const expectedMinElapsed = (calls - 1) * minTimeMs;

      const start = Date.now();
      await Promise.all(
        Array.from({ length: calls }, () => service.sendEmails(validDto)),
      );
      const elapsed = Date.now() - start;

      expect(mockWrapper.sendEmails).toHaveBeenCalledTimes(calls);
      // Allow a small downward tolerance for timer scheduling jitters
      expect(elapsed).toBeGreaterThanOrEqual(expectedMinElapsed - 20);
    });

    it('rejects without calling the wrapper when the DTO is invalid', async () => {
      process.env.SEND_AUTOMATED_EMAILS = 'true';

      const invalidDto: SendEmailDTO = {
        toEmails: ['not-a-real-email'],
        subject: 'Hello',
        bodyHtml: '<p>Hi</p>',
      };

      await expect(service.sendEmails(invalidDto)).rejects.toBeDefined();
      expect(mockWrapper.sendEmails).not.toHaveBeenCalled();
    });

    it('returns one SendEmailResult per recipient when sending succeeds', async () => {
      process.env.SEND_AUTOMATED_EMAILS = 'true';

      const dto: SendEmailDTO = {
        toEmails: ['a@example.com', 'b@example.com', 'c@example.com'],
        subject: 'Hello',
        bodyHtml: '<p>Hi</p>',
      };

      const wrapperResults: SendEmailResult[] = dto.toEmails.map(
        (recipient, i) => ({
          recipient,
          status: 'sent',
          output: {
            MessageId: `msg-${i}`,
            $metadata: { httpStatusCode: 200 },
          } as SendEmailCommandOutput,
        }),
      );
      mockWrapper.sendEmails.mockResolvedValue(wrapperResults);

      const result = await service.sendEmails(dto);

      expect(mockWrapper.sendEmails).toHaveBeenCalledTimes(1);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(dto.toEmails.length);

      // SendEmailResult is a discriminated union (not a class), so we check
      // shape: every entry must have `recipient` + `status`, plus the field
      // that the discriminant requires (`output` for sent, `error` for failed).
      for (const r of result as SendEmailResult[]) {
        expect(typeof r.recipient).toBe('string');
        expect(['sent', 'failed']).toContain(r.status);
        if (r.status === 'sent') {
          expect(r).toHaveProperty('output');
        } else {
          expect(typeof r.error).toBe('string');
        }
      }
    });

    it('returns all results, in order, when some recipients succeed and others fail', async () => {
      process.env.SEND_AUTOMATED_EMAILS = 'true';

      const dto: SendEmailDTO = {
        toEmails: [
          'ok1@example.com',
          'bad1@example.com',
          'ok2@example.com',
          'bad2@example.com',
        ],
        subject: 'Hello',
        bodyHtml: '<p>Hi</p>',
      };

      const wrapperResults: SendEmailResult[] = [
        {
          recipient: 'ok1@example.com',
          status: 'sent',
          output: {
            MessageId: 'msg-1',
            $metadata: { httpStatusCode: 200 },
          } as SendEmailCommandOutput,
        },
        {
          recipient: 'bad1@example.com',
          status: 'failed',
          error: 'SES rejected: invalid recipient',
        },
        {
          recipient: 'ok2@example.com',
          status: 'sent',
          output: {
            MessageId: 'msg-2',
            $metadata: { httpStatusCode: 200 },
          } as SendEmailCommandOutput,
        },
        {
          recipient: 'bad2@example.com',
          status: 'failed',
          error: 'SES rejected: throttled',
        },
      ];
      mockWrapper.sendEmails.mockResolvedValue(wrapperResults);

      const result = (await service.sendEmails(dto)) as SendEmailResult[];

      // No recipient should be silently dropped: one result per input address,
      // in the same order, with the right status for each.
      expect(result).toHaveLength(dto.toEmails.length);
      expect(result.map((r) => r.recipient)).toEqual(dto.toEmails);
      expect(result.map((r) => r.status)).toEqual([
        'sent',
        'failed',
        'sent',
        'failed',
      ]);
      expect(result).toEqual(wrapperResults);
    });
  });
});
