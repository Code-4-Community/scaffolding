import { s3Buckets } from './s3Buckets';

export interface S3UploadInput {
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
  bucket: s3Buckets;
}
