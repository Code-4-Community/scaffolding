import { Test, TestingModule } from '@nestjs/testing';
import { AmazonSESWrapper } from './amazon-ses.wrapper';
import { EmailService } from './email.service';
import { mock } from 'jest-mock-extended';

const mockAmazonSESWrapper = mock<AmazonSESWrapper>();

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: AmazonSESWrapper,
          useValue: mockAmazonSESWrapper,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email by calling SES', async () => {
    mockAmazonSESWrapper.sendEmails.mockResolvedValue({
      MessageId: 'test',
      $response: null,
    });
    await service.queueEmail('recipient@email.com', 'Subject', '<h1>body</h1>');
    expect(mockAmazonSESWrapper.sendEmails).toHaveBeenCalled();
  });

  it('should throw an error and pass on information with no loss if the SESWrapper throws', async () => {
    mockAmazonSESWrapper.sendEmails.mockRejectedValueOnce(
      new Error('Error in sending email.'),
    );
    await expect(
      service.queueEmail('recipient@email.com', 'Subject', '<h1>body</h1>'),
    ).rejects.toThrow('Error in sending email.');
  });
});
