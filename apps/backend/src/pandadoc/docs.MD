### Testing the Integration

### 1. Test API Connection

Test that the connection works:

```bash
curl http://localhost:3333/api/pandadoc/test
```

**Expected Response (Success):**

```json
{
  "success": true,
  "message": "Successfully connected to PandaDoc API",
  "apiVersion": "v1",
  "authenticated": true
}
```

**Expected Response (Authentication Failure):**

```json
{
  "success": false,
  "message": "Authentication failed. Please check your API key.",
  "statusCode": 401
}
```

### 2. Fetch Available Templates

Retrieve all templates from your PandaDoc account:

```bash
curl http://localhost:3333/api/pandadoc/templates
```

**Expected Response:**

```json
{
  "success": true,
  "count": 2,
  "data": {
    "results": [
      {
        "id": "abc123def456",
        "name": "Sample Template",
        "date_created": "2024-01-01T00:00:00.000Z",
        "date_modified": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### 3. Fetch a Specific Template

Get details for a specific template (replace `TEMPLATE_ID` with an actual template ID from step 2):

```bash
curl http://localhost:3333/api/pandadoc/templates/TEMPLATE_ID
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "id": "abc123def456",
    "name": "Sample Template",
    "tokens": [...],
    "fields": {...}
  }
}
```

| Method | Endpoint                      | Description                            |
| ------ | ----------------------------- | -------------------------------------- |
| GET    | `/api/pandadoc/test`          | Test API connection and authentication |
| GET    | `/api/pandadoc/templates`     | Fetch all available templates          |
| GET    | `/api/pandadoc/templates/:id` | Fetch specific template by ID          |

The PandaDoc integration consists of three main files:

- `apps/backend/src/pandadoc/pandadoc.service.ts` - Service class containing API logic
- `apps/backend/src/pandadoc/pandadoc.controller.ts` - REST API endpoints
- `apps/backend/src/pandadoc/pandadoc.module.ts` - NestJS module

## Next Steps

Refer to the [PandaDoc API documentation](https://developers.pandadoc.com/reference/about) if needed
