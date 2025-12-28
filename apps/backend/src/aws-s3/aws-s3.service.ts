import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

/**
 * Service to interface with the external object storage service (AWS S3).
 */
@Injectable()
export class AWSS3Service {
  private client: S3Client;
  private readonly bucketName = process.env.AWS_BUCKET_NAME;
  private readonly region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-2';
    this.bucketName = process.env.AWS_BUCKET_NAME;

    if (!this.bucketName) {
      throw new Error(
        'AWS_BUCKET_NAME is not defined in environment variables',
      );
    }

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error(
        'AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is not defined in environment variables',
      );
    }

    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  /**
   * Creates an URL within the S3 bucket corresponding to a person and a document type.
   * @param person the person that the S3 object relates to.
   * @param type the document type that the S3 object relates to.
   * @returns the expected URL of the object of specified person and type,
   *          with filename in the form of 'JohnDoe-Resume.pdf'
   *          or 'janedoe-application.pdf'; the file extension is always a pdf.
   *
   * Does not throw beyond TypeScript errors.
   *
   * TODO: Remove hard-coded region in the url
   */
  createLink(person: string, type: string): string {
    const fileName = `${person}-${type}.pdf`;
    return `https://${this.bucketName}.s3.us-east-2.amazonaws.com/${fileName}`;
  }

  /**
   * Method to upload a file to the S3 bucket specified in the environmental variable.
   * @param fileBuffer in-memory representation of the file's data.
   * @param fileName desired name of the file in the destination (AWS S3).
   * @param mimeType the desired MIME type to store the file as in S3,
   *                 MIME type indicates how a file should be processed
   *                 by a browser or email client (e.g., text/html, image/jpeg).
   * @throws Error with message 'File upload to AWS failed: ' with
   *         any error message from the S3 client appended to the end.
   *
   * @returns the S3 URL of the new object
   * @throws {Error} containing the error message from the external object storage provider S3
   */
  async upload(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
      });

      await this.client.send(command);

      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;
    } catch (error) {
      throw new Error('File upload to AWS failed: ' + error);
    }
  }
}
