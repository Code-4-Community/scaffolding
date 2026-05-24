## QUICKSTART: 

Copy placeholders from the repo root `example.env` into `.env` (or your deployment secrets):

| Variable | Purpose |
|----------|---------|
| `COGNITO_USER_POOL_ID` | User pool ID; **must be set** to turn the guard on |
| `COGNITO_CLIENT_ID` | App client ID used to validate `aud` / `client_id` on tokens |
| `COGNITO_REGION` | AWS region (builds JWKS issuer URL) 

Leave `COGNITO_USER_POOL_ID` unset to disable auth via JWT enforcement entirely

### Using Cognito in your app:

There are two options for implementing the Cognito authentication guard in your app:

1. Import `CognitoModule` into `AppModule` to protect all modules throughout the application:

```typescript
@Module({
  imports: [TypeOrmModule.forRoot(...), CognitoModule],
})
export class AppModule {}
```

2. Import `CognitoJWTGuard` and `CognitoService` into individual modules, then apply the guard with `@UseGuards`:

```typescript
@Module({
  controllers: [UsersController],
  providers: [CognitoJWTGuard, CognitoService],
})
export class UsersModule {}
```

   - **Per controller** — all routes in the controller go through the guard:

```typescript
@Controller('users')
@UseGuards(CognitoJWTGuard)
export class UsersController {
  constructor(private readonly cognitoService: CognitoService) {}
  ...
}
```

   - **Per route** — only decorated handlers are protected:

```typescript
@Controller('users')
export class UsersController {
  @UseGuards(CognitoJWTGuard)
  @Get('me')
  me(@Req() req: Request) {
    return this.cognitoService.getUser(req);
  }
  ...
}
```


### Public Routes
Use the `@Public()` decorator on routes that are technically protected, but don't require authentication. i.e. health checks, webhooks, or unauthenticated entry points:

```typescript
import { Public } from './aws/cognito/cognito.decorator';

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  check() {
    return { ok: true };
  }
}
```

### `CognitoService.getUser()`
Inject `CognitoService` in controllers or services to extract decoded token payload from the request

```typescript
@Get('me')
me(@Req() req: Request) {
  const user = this.cognitoService.getUser(req);
  // null when auth is disabled, or no valid token was attached
  return user;
}
```

The guard sets `request.user` to the verified JWT payload (`CognitoJwtPayload`: `sub`, `email`, `cognito:groups`, etc.).

## Token validation

- JWKS: `https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json`
- Signature: RS256, issuer must match the pool.
- Audience: each token carries **one** of these — ID tokens use `aud`; access tokens use `client_id` (Cognito does not put `aud` on access tokens). The guard accepts either claim matching `COGNITO_CLIENT_ID`. Amplify API calls typically send the **access** token (see below).

> [!IMPORTANT]
> By default, both ID and access tokens are checked for and accepted. Cognito can be used for both Authentication (ID) and Authorization (Access), if you want to restrict to one specific use, add a `token_use` check in `isAudienceValid` and delete the other (id or access) check.

> [!WARNING]
> Do not use the **ID token** for API authorization. ID tokens are intended for your 
> client application to establish who the user is: passing them to a backend API 
> exposes identity claims unnecessarily and confuses authentication with authorization. 
> Backend APIs should validate **access tokens** only. See the `token_use` check in 
> `isAudienceValid` below to enforce this.

```typescript
function isAudienceValid(payload: CognitoJwtPayload, clientId: string): boolean {
  if (payload.token_use !== 'access') return false;
  return payload.client_id === clientId;
}
```
```typescript
function isAudienceValid(payload: CognitoJwtPayload, clientId: string): boolean {
  if (payload.token_use !== 'id') return false;
  return payload.aud === clientId;
}
```
## Helpful Resources for understanding Auth!
- Difference between id and access tokens: https://auth0.com/blog/id-token-access-token-what-is-the-difference/
- What is an Access Token? https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-access-token.html
- What is an ID Token? https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-id-token.html
- Using AWS to verify JWT: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html