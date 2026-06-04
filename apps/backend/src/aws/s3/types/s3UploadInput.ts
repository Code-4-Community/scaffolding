import { S3Buckets } from './s3Buckets';

export interface S3UploadInput {
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
  bucket: S3Buckets;
}
