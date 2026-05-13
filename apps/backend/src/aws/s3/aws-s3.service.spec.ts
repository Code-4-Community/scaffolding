import {
  GetObjectCommand,
  GetObjectCommandOutput,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { AWSS3Service } from './aws-s3.service';

const s3Mock = mockClient(S3Client);

describe('AWSS3Service', () => {
  const testBucket = 'test-bucket';
  const region = 'us-east-2';

  let service: AWSS3Service;

  beforeEach(() => {
    process.env.AWS_ACCESS_KEY = 'test-access-key';
    process.env.AWS_SECRET_KEY = 'test-secret-key';
    process.env.AWS_REGION = region;

    s3Mock.reset();
    service = new AWSS3Service();
  });

  describe('createLink', () => {
    it('should construct the correct S3 URL', () => {
      const url = service.createLink('youth123', 'assignment456', testBucket);
      expect(url).toBe(
        `https://${testBucket}.s3.${region}.amazonaws.com/youth123-assignment456.pdf`,
      );
    });
  });

  describe('upload', () => {
    it('should upload file and return correct URL', async () => {
      s3Mock.on(PutObjectCommand).resolves({});

      const url = await service.upload(
        Buffer.from('test'),
        'file.pdf',
        'application/pdf',
        testBucket,
      );

      const commandCall = s3Mock.call(0);
      const uploadedKey = (commandCall.args[0] as PutObjectCommand).input.Key;

      expect(s3Mock.calls()).toHaveLength(1);
      expect(uploadedKey).toMatch(/^file-\d{13}-[a-z0-9]{6}\.pdf$/);
      expect(url).toBe(
        `https://${testBucket}.s3.${region}.amazonaws.com/${uploadedKey}`,
      );
    });

    it('should throw error on upload failure', async () => {
      s3Mock.on(PutObjectCommand).rejects(new Error('fail'));

      await expect(
        service.upload(
          Buffer.from('test'),
          'file.pdf',
          'application/pdf',
          testBucket,
        ),
      ).rejects.toThrow('File upload to AWS failed: Error: fail');
    });
  });

  describe('getImageData', () => {
    it('should return Uint8Array on success', async () => {
      const imageBytes = new Uint8Array([1, 2, 3]);
      s3Mock.on(GetObjectCommand).resolves({
        Body: {
          transformToByteArray: jest.fn().mockResolvedValue(imageBytes),
        } as unknown as GetObjectCommandOutput['Body'],
      });

      const result = await service.getImageData('photo.jpg', testBucket);

      expect(result).toBe(imageBytes);
    });

    it('should return null for NoSuchKey', async () => {
      s3Mock
        .on(GetObjectCommand)
        .rejects(new NoSuchKey({ message: 'Not found', $metadata: {} }));

      const result = await service.getImageData('missing.jpg', testBucket);

      expect(result).toBeNull();
    });

    it('should return null and log error for generic S3ServiceException', async () => {
      class TestS3Exception extends S3ServiceException {
        constructor() {
          super({
            name: 'AccessDenied',
            message: 'Access denied',
            $metadata: {},
            $fault: 'client',
          });
        }
      }
      s3Mock.on(GetObjectCommand).rejects(new TestS3Exception());

      const result = await service.getImageData('photo.jpg', testBucket);

      expect(result).toBeNull();
    });

    it('should rethrow non-S3 errors', async () => {
      s3Mock.on(GetObjectCommand).rejects(new Error('network error'));

      await expect(
        service.getImageData('photo.jpg', testBucket),
      ).rejects.toThrow('network error');
    });
  });
});

// When your project adds a bucket to s3Buckets, add tests here following this pattern:
//
// it('should throw at startup if <BUCKET> env var is missing', () => {
//   delete process.env.AWS_MY_BUCKET_NAME;
//   expect(() => new AWSS3Service()).toThrow(
//     'Missing required environment variable for S3 bucket: MY_BUCKET',
//   );
// });
