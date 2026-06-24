## Scaffolding auth flow
Some key concepts you'll need to know are:
- **Authentication (authn)** = *"who are you?"* -> ex: distinguishing a known user from an unknown one
- **Authorization (authz)** = *"what are you allowed to do?"* -> ex: distinguishing admin access vs normal user access to routes

1. **Unauthenticated user hits the app.** A user opens the frontend with no token. If they call a protected (Non Public) backend route, `CognitoJWTGuard` finds no `Authorization: Bearer <token>` header and responds `401 Unauthorized`.

2. **User authenticates with Cognito** The frontend sends the user's credentials to Cognito. Cognito verifies the credentials and *authenticates* the user. This happens entirely between the client and Cognito. Our backend is not involved and never sees the password.

3. **Cognito issues tokens.** On success, Cognito returns separate signed JWTs for the following:
   - **ID token**: describes *who the user is* (identity claims), meant for the frontend.
   - **access token**: the *authorization* credential, meant to be sent to backend APIs and checked by the `CognitoJWTGuard`. (See [Token validation](#token-validation))
   - **refresh token**: used to obtain fresh ID/access tokens when they expire.

4. **Frontend calls the backend with the access token.** The client attaches it on every request as a header: `Authorization: Bearer <access_token>`.

5. **The Guard checks the token.** `CognitoJWTGuard` runs on every route (it's registered as a global `APP_GUARD`). For each request it:
   - lets the request through immediately if auth is disabled (Cognito env vars unset) or if the route is marked `@Public()` (intentional bypass)
   - extracts and verifies the Bearer token, then checks the RS256 signature against the pool's public keys (JWKS), the issuer, expiration, that `token_use === 'access'`, and that `client_id` matches our app client.

6. **Allow or deny.**
   - **Valid token** → the guard attaches the decoded claims to `request.user` and the request proceeds to the controller -> Read with `CognitoService.getUser(req)`.
   - **Missing or invalid token** (bad signature, expired, wrong token type, wrong client) → `401 Unauthorized`, and the controller never runs.

So: **every route is protected by default, a request is allowed only if it carries a valid Cognito access token or if the route is marked `@Public()`, which skips the check entirely.** Public routes are for things that must work without a login, like health checks, webhooks, or the login entry point itself.

## QUICKSTART: 

Copy placeholders from the repo root `example.env` into `.env` (or your deployment secrets):

| Variable | Purpose |
|----------|---------|
| `COGNITO_USER_POOL_ID` | Your registered users in Cognito to authenticate with |
| `COGNITO_CLIENT_ID` | The application you are building's own id linked to Cognito used to validate `client_id` on tokens |
| `COGNITO_REGION` | AWS region |

> [!IMPORTANT]
> If any Cognito env variables are unset: `COGNITO_USER_POOL_ID`, `COGNITO_CLIENT_ID`, `COGNITO_REGION`, authentication via JWT enforcement is **disabled entirely**

### Auth model

- **Verification** — `CognitoJWTGuard` is the only component that validates JWTs (See [Token validation](#token-validation))
- The 
- **Global guard** — `CognitoModule` registers `CognitoJWTGuard` as an `APP_GUARD`, so every route is protected by default. You do **not** need `@UseGuards(CognitoJWTGuard)` on controllers when using this setup.
- **`request.user`** — After a successful check, the guard sets `request.user` to the decoded JWT payload (`AccessTokenPayload`: `sub`, `client_id`, `cognito:groups`, `token_use`, etc.)

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

Inject `CognitoService` to extract the same `AccessTokenPayload` decoded token payload the guard attached to `request.user`:

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

The guard validates access tokens by
- JWKS: https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
- Signature: RS256; iss must match the pool.
- Expiration: exp is enforced automatically by jsonwebtoken.verify 
- token_use: must equal `access`. This is what rejects an ID token presented to the backend.
- client_id: must equal `COGNITO_CLIENT_ID`. On access tokens the app client ID lives in the client_id claim 

> [!IMPORTANT]
> The scaffold accepts access tokens only, by design. Backend APIs are resource servers and authorize requests using access tokens; ID tokens are for the frontend to establish who the user is. The token_use check in isAccessTokenValid (below) is what enforces the access-token-only rule.

> [!WARNING]
> Do not use the ID token for API authorization. ID tokens are intended for your client application to establish who the user is; passing them to a backend API exposes identity claims unnecessarily and confuses authentication with authorization. Backend APIs should validate access tokens only. The token_use check in isAccessTokenValid below enforces this.

```
function isAccessTokenValid(payload: AccessTokenPayload, clientId: string): boolean {
  if (payload.token_use !== 'access') return false;
  return payload.client_id === clientId;
}
```

> [!NOTE]
> `client_id` validation currently accepts a single client. If this pool ever serves
multiple app clients (e.g. a separate web and mobile app sharing one user pool),
change COGNITO_CLIENT_ID to accept a comma-separated list and validate membership
in that allowlist instead of simply an equality check.

## Helpful Resources for understanding Auth!
- The most amazing explanation of authn (OAUTH 2.0) and authz (OIDC) you'll ever watch: https://www.youtube.com/watch?v=996OiexHze0&t=2126s
- Difference between id and access tokens: https://auth0.com/blog/id-token-access-token-what-is-the-difference/
- Using AWS to verify JWT: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
