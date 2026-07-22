import { Provider } from '@nestjs/common';
import { SESv2Client } from '@aws-sdk/client-sesv2';

export const AMAZON_SES_CLIENT = 'AMAZON_SES_CLIENT';

/**
 * Factory that produces a new instance of the Amazon SES v2 client.
 * Reads region and credentials from process.env at injection time and
 * passes them explicitly to the client.
 */
export const AmazonSESClientFactory: Provider<SESv2Client> = {
  provide: AMAZON_SES_CLIENT,
  useFactory: () => {
    // Create dummy client that is never used when email sending is set to false
    if (process.env.SEND_AUTOMATED_EMAILS !== 'true') {
      return new SESv2Client({});
    }

    // Region and credentials are validated at module initialization (see EmailsModule)
    return new SESv2Client({
      region: process.env.AWS_REGION ?? '',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
      },
    });
  },
};
