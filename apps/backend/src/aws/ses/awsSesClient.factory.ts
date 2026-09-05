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
    // Create dummy client that is NOT used when email sending is unset or set to false.
    if (process.env.SES_ENABLED?.toLowerCase() !== 'true') {
      return new SESv2Client({});
    }

    // If email sending is enabled, AWSSESModule.onModuleInit() warns when these env vars are missing.
    // The empty-string fallbacks keep the client constructible; sends against it fail at the SES call.
    return new SESv2Client({
      region: process.env.AWS_REGION ?? '',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
      },
    });
  },
};
