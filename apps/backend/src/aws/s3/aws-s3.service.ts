import { Injectable, Logger } from '@nestjs/common';
import {
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { s3Buckets } from './types/s3Buckets';

@Injectable()
export class AWSS3Service {
  private readonly client: S3Client;
  private readonly region: string;
  private readonly logger = new Logger(AWSS3Service.name);

  constructor() {
    this.region = process.env.AWS_REGION ?? 'us-east-2';

    for (const bucket of Object.values(s3Buckets) as unknown as s3Buckets[]) {
      if (!this.mapBucket(bucket)) {
        throw new Error(
          `Missing required environment variable for S3 bucket: ${bucket}`,
        );
      }
    }

    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY ?? '',
        secretAccessKey: process.env.AWS_SECRET_KEY ?? '',
      },
    });
  }

  mapBucket(bucket: s3Buckets): string {
    // Add one entry per bucket in s3Buckets enum.
    // Example: [s3Buckets.DOCUMENTS]: process.env.AWS_DOCUMENTS_BUCKET_NAME,
    const bucketNames: Record<s3Buckets, string> = {};
    return bucketNames[bucket];
  }

  createLink(key: string, bucketName: string): string {
    return `https://${bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async upload(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    bucket: string,
  ): Promise<string> {
    try {
      const uniqueFileName = this.buildUniqueFileName(fileName);
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: uniqueFileName,
        Body: fileBuffer,
        ContentType: mimeType,
      });

      await this.client.send(command);

      return `https://${bucket}.s3.${this.region}.amazonaws.com/${uniqueFileName}`;
    } catch (error) {
      throw new Error('File upload to AWS failed: ' + error);
    }
  }

  async getImageData(
    objectKey: string,
    bucket: string,
  ): Promise<Uint8Array | null> {
    try {
      const command = new GetObjectCommand({ Bucket: bucket, Key: objectKey });
      const response = await this.client.send(command);
      return await response.Body.transformToByteArray();
    } catch (error) {
      if (error instanceof NoSuchKey) {
        this.logger.log(
          `Object not found in S3: key=${objectKey}, bucket=${bucket}`,
        );
        return null;
      }
      if (error instanceof S3ServiceException) {
        this.logger.error(
          `S3 error retrieving object: key=${objectKey}, bucket=${bucket}, error=${error.message}`,
        );
        return null;
      }
      throw error;
    }
  }

  private buildUniqueFileName(fileName: string): string {
    const dotIndex = fileName.lastIndexOf('.');
    const hasExtension = dotIndex > 0 && dotIndex < fileName.length - 1;
    const baseName = hasExtension ? fileName.slice(0, dotIndex) : fileName;
    const extension = hasExtension ? fileName.slice(dotIndex) : '';
    const safeBaseName = baseName.trim() || 'upload';
    const uniqueSuffix = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    return `${safeBaseName}-${uniqueSuffix}${extension}`;
  }
}
