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

Every bucket env var **must** follow the `AWS_<BUCKET>_BUCKET_NAME` format, where `<BUCKET>` is the `S3Buckets` enum member verbatim. `AWSS3Service` builds its bucket lookup from that convention, so a name that doesn't match will never be found.

`AWSS3Module.onModuleInit` logs a warning listing any env var in its `REQUIRED_ENV_VARS` list that is unset or blank.

## Adding a New Bucket

**1. Add an env var** in `.env` and `example.env`, named `AWS_<BUCKET>_BUCKET_NAME`:

```
AWS_MY_BUCKET_NAME=my-bucket-name
```

**2. Add an entry to the `S3Buckets` enum** (`types/s3Buckets.ts`), matching the middle of that env var name:

```typescript
export enum S3Buckets {
  MY_BUCKET = 'MY_BUCKET',
}
```

**3. Add the env var name to `REQUIRED_ENV_VARS`** (`aws-s3.module.ts`), so a missing value is reported at startup:

```typescript
const REQUIRED_ENV_VARS = [
  'AWS_ACCESS_KEY',
  'AWS_SECRET_KEY',
  'AWS_MY_BUCKET_NAME',
] as const;
```

No change to `aws-s3.service.ts` is needed: its constructor resolves `process.env['AWS_' + bucket + '_BUCKET_NAME']` for every member of `S3Buckets`. A bucket whose env var is missing resolves to `''`, and any `upload()` to it throws `Missing required environment variable for S3 bucket: MY_BUCKET`.

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
