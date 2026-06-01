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
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!region) throw new Error('AWS_REGION is not defined');
    if (!accessKeyId) throw new Error('AWS_ACCESS_KEY_ID is not defined');
    if (!secretAccessKey)
      throw new Error('AWS_SECRET_ACCESS_KEY is not defined');

    return new SESv2Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  },
};
