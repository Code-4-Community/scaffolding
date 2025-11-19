# PandaDoc Webhook

This document describes the PandaDoc webhook integration for capturing volunteer application data. If confused talk to Owen!

## Overview

The backend now includes an endpoint that receives PandaDoc webhook events when a volunteer application form is completed. The endpoint automatically parses the form data and creates a new application record in the database.

## Endpoint Details

**URL:** `POST /api/applications/webhook/pandadoc`

**Supported Events:**

- `document_completed` - Triggered when a document is fully completed
- `recipient_completed` - Triggered when a recipient completes their part

**Response:**

```json
{
  "success": true,
  "application": {
    "appId": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    ...
  }
}
```

## Database Schema Changes

The following fields have been added to the `Application` entity:

- **name** (varchar, required) - Applicant's full name
- **email** (varchar, required) - Applicant's email address
- **disciplineId** (integer, optional) - Foreign key reference to Discipline table

I wasn't entirely sure why this wasn't here already but my ticket mentioned these fields so i added them. Check new migration

## Field Mapping

The webhook handler maps PandaDoc form fields to Application fields. It supports **snake_case**, **Title Case**, and **camelCase** field name variations:

| PandaDoc Field Name                                    | Application Field | Type    | Notes                                                          |
| ------------------------------------------------------ | ----------------- | ------- | -------------------------------------------------------------- |
| `name`, `Name`, `Full Name`                            | name              | string  | Falls back to combining first_name + last_name from recipients |
| `email`, `Email`                                       | email             | string  | Falls back to recipient email                                  |
| `phone`, `Phone`                                       | phone             | string  |                                                                |
| `discipline`, `Discipline`                             | disciplineId      | number  | Parsed as integer                                              |
| `school`, `School`                                     | school            | enum    | Must match School enum values                                  |
| `experience_type`, `Experience Type`, `experienceType` | experienceType    | enum    | BS, MS, PhD, MD, etc.                                          |
| `interest`, `Interest Area`, `interestArea`            | interest          | enum    | Nursing, HarmReduction, WomensHealth                           |
| `days_available`, `Days Available`, `daysAvailable`    | daysAvailable     | string  |                                                                |
| `weekly_hours`, `Weekly Hours`, `weeklyHours`          | weeklyHours       | number  |                                                                |
| `license`, `License`                                   | license           | string  |                                                                |
| `is_international`, `International`, `isInternational` | isInternational   | boolean | Accepts: true/false, yes/no, 1/0                               |
| `is_learner`, `Learner`, `isLearner`                   | isLearner         | boolean |                                                                |
| `referred`, `Referred`                                 | referred          | boolean |                                                                |
| `referred_email`, `Referred Email`, `referredEmail`    | referredEmail     | string  |                                                                |
| `file_uploads`, `File Uploads`, `fileUploads`          | fileUploads       | array   | JSON array or comma-separated                                  |

## Setting Up PandaDoc Webhook

1. Log in to your PandaDoc account
2. Navigate to Settings > Integrations > Webhooks
3. Click "Create Webhook"
4. Configure the webhook:
   - **URL:** `https://your-backend-domain.com/api/applications/webhook/pandadoc`
   - **Events:** Select `document.completed` and/or `recipient.completed`
   - **Active:** Enable the webhook
5. Save the webhook configuration

## Local Testing

1. Ensure the database is running
2. Run migrations: `npm run migration:run`
3. Start the backend server

```bash
cd apps/backend/test-data
./test-webhook.sh
```

## API Documentation

```
http://localhost:3000/api
```
