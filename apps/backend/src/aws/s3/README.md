# AWS S3 Module

A global NestJS module providing S3 file upload and retrieval via `AWSS3Service`.

## Setup

Add these variables to `.env` and `example.env`:

```
AWS_REGION=us-east-2
AWS_ACCESS_KEY=your-access-key-id
AWS_SECRET_KEY=your-secret-access-key
# one entry per bucket — see "Adding a New Bucket" below
AWS_MY_BUCKET_NAME=my-bucket-name
```

Import `AWSS3Module` once in your root `AppModule`. Because the module is `@Global()`, `AWSS3Service` is injectable in all feature modules without additional imports.

The service throws at startup if any bucket env var is unset, so misconfiguration is caught immediately rather than at runtime.

## Adding a New Bucket

**1. Add an env var** in `.env` and `example.env`:

```
AWS_MY_BUCKET_NAME=my-bucket-name
```

**2. Add an entry to the `s3Buckets` enum** (`types/s3Buckets.ts`):

```typescript
export enum s3Buckets {
  MY_BUCKET = 'MY_BUCKET',
}
```

**3. Add a mapping to `mapBucket`** (`aws-s3.service.ts`):

```typescript
const bucketNames: Record<s3Buckets, string> = {
  [s3Buckets.MY_BUCKET]: process.env.AWS_MY_BUCKET_NAME,
};
```

Because `mapBucket` uses a `Record<s3Buckets, string>`, TypeScript will produce a compile error if you add an enum entry without adding the corresponding mapping — catching missed steps at build time.

## Required IAM Permissions

The credentials supplied via `AWS_ACCESS_KEY` / `AWS_SECRET_KEY` must have:

| Permission | Required by |
|---|---|
| `s3:PutObject` | `upload()` |
| `s3:GetObject` | `getImageData()` |

Scope permissions to only the buckets this application uses:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": [
        "arn:aws:s3:::your-bucket-name/*"
      ]
    }
  ]
}
```
