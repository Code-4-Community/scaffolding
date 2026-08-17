import { Injectable, Logger } from '@nestjs/common';
import {
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { S3Buckets } from './types/s3Buckets';
import { S3UploadInput } from './types/s3UploadInput';

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB
// eslint-disable-next-line no-control-regex
const ILLEGAL_FILENAME_CHARS = /[<>:"/\\|?*\x00-\x1F]/;

// Extend or restrict this list to match your project's upload requirements.
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
  'video/mp4',
  'audio/mpeg',
]);

@Injectable()
export class AWSS3Service {
  private readonly client: S3Client;
  private readonly region: string;
  private readonly bucketNames: Record<S3Buckets, string>;
  private readonly logger = new Logger(AWSS3Service.name);

  constructor() {
    this.region = process.env.AWS_REGION ?? 'us-east-2';

    // Add one entry per bucket in s3Buckets enum.
    // Example: [s3Buckets.DOCUMENTS]: process.env.AWS_DOCUMENTS_BUCKET_NAME,
    this.bucketNames = {} as Record<S3Buckets, string>;

    for (const bucket of Object.values(S3Buckets) as unknown as S3Buckets[]) {
      if (!this.bucketNames[bucket]) {
        throw new Error(
          `Missing required environment variable for S3 bucket: ${bucket}`,
        );
      }
    }

    // AWS credentials are validated at module initialization (see AWSS3Module).
    // The ?? '' only satisfies the type checker: if either var were missing,
    // module init throws and the app never boots, so this client is never used.
    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY ?? '',
        secretAccessKey: process.env.AWS_SECRET_KEY ?? '',
      },
    });
  }

  async upload(input: S3UploadInput): Promise<string> {
    const bucketName = this.validateUploadInput(input);
    const { fileBuffer, fileName, mimeType } = input;
    try {
      const uniqueFileName = this.buildUniqueFileName(fileName);
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueFileName,
        Body: fileBuffer,
        ContentType: mimeType,
      });

      await this.client.send(command);

      return `https://${bucketName}.s3.${this.region}.amazonaws.com/${uniqueFileName}`;
    } catch (error) {
      throw new Error('File upload to AWS failed: ' + error);
    }
  }

  private validateUploadInput(input: S3UploadInput): string {
    if (!input.fileBuffer || input.fileBuffer.length === 0) {
      throw new Error('File buffer cannot be empty');
    }
    if (input.fileBuffer.length > MAX_FILE_SIZE_BYTES) {
      throw new Error(
        `File size exceeds the maximum allowed size of ${
          MAX_FILE_SIZE_BYTES / (1024 * 1024)
        }MB`,
      );
    }
    if (!input.fileName || input.fileName.trim().length === 0) {
      throw new Error('File name cannot be empty');
    }
    if (ILLEGAL_FILENAME_CHARS.test(input.fileName)) {
      throw new Error('File name contains illegal characters');
    }
    if (input.fileName.includes('..')) {
      throw new Error('File name cannot contain path traversal sequences');
    }
    if (!input.mimeType || input.mimeType.trim().length === 0) {
      throw new Error('MIME type cannot be empty');
    }
    if (!ALLOWED_MIME_TYPES.has(input.mimeType)) {
      throw new Error(`MIME type not allowed: ${input.mimeType}`);
    }
    const bucketName = this.bucketNames[input.bucket];
    if (!bucketName) {
      throw new Error(
        `Missing required environment variable for S3 bucket: ${input.bucket}`,
      );
    }
    return bucketName;
  }

  async getImageData(
    objectKey: string,
    bucket: string,
  ): Promise<Uint8Array | null> {
    try {
      const command = new GetObjectCommand({ Bucket: bucket, Key: objectKey });
      const response = await this.client.send(command);
      if (!response.Body) {
        return null;
      }
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
