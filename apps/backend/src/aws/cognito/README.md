## QUICKSTART: 

Copy placeholders from the repo root `example.env` into `.env` (or your deployment secrets):

| Variable | Purpose |
|----------|---------|
| `COGNITO_USER_POOL_ID` | User pool ID; **must be set** to turn the guard on |
| `COGNITO_CLIENT_ID` | App client ID used to validate `aud` / `client_id` on tokens |
| `COGNITO_REGION` | AWS region (builds JWKS issuer URL) |

> [!IMPORTANT]
> If any Cognito env variables are unset: `COGNITO_USER_POOL_ID`, `COGNITO_CLIENT_ID`, `COGNITO_REGION`, authentication via JWT enforcement is **disabled entirely**

### Auth model

- **Verification** — `CognitoJWTGuard` is the only component that validates JWTs (signature, issuer, audience). Do not add a second Passport/JWKS path for the same user pool.
- **Global guard** — `CognitoModule` registers `CognitoJWTGuard` as an `APP_GUARD`, so every route is protected by default. You do **not** need `@UseGuards(CognitoJWTGuard)` on controllers when using this setup.
- **`request.user`** — After a successful check, the guard sets `request.user` to the decoded JWT payload (`CognitoJwtPayload`: `sub`, `email`, `client_id`, `cognito:groups`, `token_use`, etc.). It is **not** a database user row; resolve local users in your services via `sub` or `email` if needed.

### Using Cognito in your app (recommended + implemented: global guard)

Import `CognitoModule` into `AppModule` (Already ). This enables auth app-wide and exports `CognitoService` for reading `request.user`:

> [!IMPORTANT]
> Note: This has already been implemented by default

```typescript
@Module({
  imports: [TypeOrmModule.forRoot(...), CognitoModule],
})
export class AppModule {}
```

New controllers are protected automatically. Opt out with `@Public()` (see below). Read the caller with `CognitoService.getUser(req)` or `req.user` after the guard runs.

### Alternate setup: per-module or per-route guard

If you **do not** register `APP_GUARD` in `CognitoModule` (or you remove that provider), you can import the guard only where needed:

1. Add `CognitoJWTGuard` and `CognitoService` to the module `providers` array (and import `CognitoModule` or register those providers yourself).
2. Apply `@UseGuards(CognitoJWTGuard)` on a controller or individual route.

**Per controller** — all routes on the controller:

```typescript
@Module({
  controllers: [UsersController],
  providers: [CognitoJWTGuard, CognitoService],
})
export class UsersModule {}

@Controller('users')
@UseGuards(CognitoJWTGuard)
export class UsersController {
  constructor(private readonly cognitoService: CognitoService) {}
  ...
}
```

**Per route** — only decorated handlers:

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

Inject `CognitoService` to extract the same `CognitoJwtPayload` decoded token payload the guard attached to `request.user`:

```typescript
@Get('me')
me(@Req() req: Request) {
  const user = this.cognitoService.getUser(req);
  // null when auth env is incomplete/disabled, or when request.user was never set
  return user;
}
```

Returns `null` if Cognito auth is disabled (missing env) or if no verified token was attached. On protected routes with a valid Bearer token, it returns the JWT claims object.

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