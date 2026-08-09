## Scaffolding auth flow
Some key concepts you'll need to know are:
- **Authentication (authn)** = *"who are you?"* -> ex: distinguishing a known user from an unknown one
- **Authorization (authz)** = *"what are you allowed to do?"* -> ex: distinguishing admin access vs normal user access to routes

1. **Unauthenticated user hits the app.** A user opens the frontend with no token. If they call a protected (Non Public) backend route, `CognitoJWTGuard` finds no `Authorization: Bearer <token>` header and responds `401 Unauthorized`.

2. **User authenticates with Cognito** The frontend sends the user's credentials to Cognito. Cognito verifies the credentials and *authenticates* the user. This happens entirely between the client and Cognito. Our backend is not involved and never sees the password.
   - On the frontend this login flow is run by [AWS Amplify](https://docs.amplify.aws/). If auth is enabled, `apps/frontend/src/auth/auth.config.ts` (`configureAmplify()`) points Amplify at the user pool, and `apps/frontend/src/main.tsx` wraps the app in Amplify's `<Authenticator>` login gate. 

3. **Cognito issues tokens.** On success, Cognito returns separate signed JWTs for the following:
   - **ID token**: describes *who the user is* (identity claims), meant for the frontend.
   - **access token**: the *authorization* credential, meant to be sent to backend APIs and checked by the `CognitoJWTGuard`. (See [Token validation](#token-validation))
   - **refresh token**: used to obtain fresh ID/access tokens when they expire.

4. **Frontend calls the backend with the access token.** The client attaches it on every request as a header: `Authorization: Bearer <access_token>`. This is done once, by an axios request interceptor in `apps/frontend/src/api/apiClient.ts`, so individual API methods never deal with tokens:
   - it no-ops when auth is disabled, so the scaffold still runs with no Cognito setup
   - it sends `tokens.accessToken`, never the ID token (the guard rejects `token_use !== 'access'`)
   - `fetchAuthSession()` returns the cached access token and silently refreshes it when expired, so the 1 hour token lifetime needs no handling
   - if no one is signed in it sends the request unauthenticated and lets the guard answer `401`

5. **The Guard checks the token.** `CognitoJWTGuard` runs on every route (it's registered as a global `APP_GUARD`). For each request it:
   - lets the request through immediately if auth is disabled (Cognito env vars unset) or if the route is marked `@Public()` (intentional bypass)
   - extracts and verifies the Bearer token, then checks the RS256 signature against the pool's public keys (JWKS), the issuer, expiration, that `token_use === 'access'`, and that `client_id` matches our app client.

6. **Allow or deny.**
   - **Valid token** → the guard attaches the decoded claims to `request.user` and the request proceeds to the controller -> Read with `CognitoService.getUser(req)`.
   - **Missing or invalid token** (bad signature, expired, wrong token type, wrong client) → `401 Unauthorized`, and the controller never runs. The guard logs the specific rejection reason server-side (e.g. `Token verification failed: jwt expired`), but the client always receives a generic `401 Unauthorized` except when the request has no Bearer token at all, in which case the response carries the message `No bearer token provided`.

So: **every route is protected by default, a request is allowed only if it carries a valid Cognito access token or if the route is marked `@Public()`, which skips the check entirely.** Public routes are for things that must work without a login, like health checks, webhooks, or the login entry point itself.

## QUICKSTART: 

Copy placeholders from the repo root `example.env` into `.env` (or your deployment secrets). These three variables drive **both** the backend and the frontend:

| Variable | Purpose |
|----------|---------|
| `COGNITO_USER_POOL_ID` | Your registered users in Cognito to authenticate with (**required**) |
| `COGNITO_CLIENT_ID` | The application you are building's own id linked to Cognito used to validate `client_id` on tokens (**required**) |
| `COGNITO_REGION` | AWS region (**optional**) — when unset it is derived from the user pool ID, which is formatted `<region>_<id>` (e.g. `us-east-2_abc123` → `us-east-2`). Set it explicitly only if your pool ID does not encode the region you want. |

`apps/frontend/vite.config.ts` re-exports the same values to the client bundle as `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_USER_POOL_CLIENT_ID`, and `VITE_COGNITO_REGION` at build time, so the client and server always share one source of truth (you never set the `VITE_` variables by hand). Because both sides read the same values, they can't drift out of sync: set the user pool ID and client ID and auth is enforced on the backend *and* the login UI appears on the frontend; leave either unset and both fall open.

> [!NOTE]
> Only the first two are actually consumed by the frontend. `VITE_COGNITO_REGION` is exported for completeness but nothing reads it — Amplify derives the region from the user pool ID prefix, exactly like `getCognitoConfig()` does on the backend.
>
> These values are **inlined into the public JS bundle**, which is correct: a user pool ID and a public app client ID are not secrets. Never add a client *secret* to the app client — a browser SPA cannot hold one.
>
> Because the vite config loads the root `.env` with no prefix filter, any variable you add there that *starts with* `VITE_` is automatically published to the browser. Keep secrets unprefixed.

> [!IMPORTANT]
> If `COGNITO_USER_POOL_ID` or `COGNITO_CLIENT_ID` variables are unset, authentication via JWT enforcement is **disabled entirely** and every route is left open. `getCognitoConfig()` returns `null` when either of these two is missing/empty, and `isAuthEnabled()` is derived from it. `COGNITO_REGION` is **not** part of this check — when it is missing the region is derived from the user pool ID, so auth stays enabled.
> At startup `CognitoModule` logs the auth state exactly once (`Cognito auth enabled`, or `Cognito auth disabled: env vars missing. All routes open.`).
>
> The disabled message is logged at **error** level when `NODE_ENV === 'production'` and at **warn** level otherwise, because running without Cognito is a normal local workflow but almost always a missing-secrets bug in production:

```typescript
if (process.env.NODE_ENV === 'production') {
  this.logger.error(message);
} else {
  this.logger.warn(message);
}
```

### You have to set `NODE_ENV` yourself

Nothing in this repo sets it. `@nx/webpack` builds node targets with `mode: 'none'` specifically so `process.env.NODE_ENV` is **not** substituted at build time, which means the compiled backend reads it from the runtime environment. If your deployment never exports it, the check above is inert and a production app with auth off will only warn.

Set it where the process actually starts — the ECS task definition, the Elastic Beanstalk environment config, the systemd unit — rather than in a `.env` baked into the image, so the value tracks the environment rather than the build. `example.env` carries `NODE_ENV=development` as the local default.

On the frontend, `apps/frontend/src/main.tsx` logs a `console.error` when auth is disabled in a production build (`import.meta.env.PROD`), since a production bundle with no login gate is almost always a build-time misconfiguration. Vite sets `PROD` from the build mode, so this needs no environment variable of its own.

> [!WARNING]
> Disabling auth is a convenience for local development, **not** a safe production state. This scaffold intentionally *logs and continues* (it never blocks startup) so that a fresh clone runs without any Cognito setup. For a real production deployment you should instead **fail hard**: change the disabled branch in `cognito.module.ts` (`onModuleInit`) to `throw new Error(message)` when `NODE_ENV === 'production'` so the app refuses to boot with auth silently off. The frontend mirror in `apps/frontend/src/main.tsx` can be tightened the same way (throw instead of `console.error` under `import.meta.env.PROD`).

### Auth model

- **Verification** — `CognitoJWTGuard` is the only component that validates JWTs (See [Token validation](#token-validation))
- **Global guard** — `CognitoModule` registers `CognitoJWTGuard` as an `APP_GUARD`, so every route is protected by default. You do **not** need `@UseGuards(CognitoJWTGuard)` on controllers when using this setup.
- **`request.user`** — After a successful check, the guard sets `request.user` to the decoded JWT payload (`AccessTokenPayload`: `sub`, `client_id`, `cognito:groups`, `token_use`, etc.)

### Using Cognito in your app (recommended + implemented: global guard)

`CognitoModule` is already imported into `AppModule`, so there is nothing to wire up. That import is what enables auth app-wide and exports `CognitoService` for reading `request.user`:

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

A live example is `apps/backend/src/app.controller.ts`: the scaffold's `GET /api` smoke-test route is `@Public()` so it answers whether or not Cognito is configured.

> [!WARNING]
> Put `@Public()` on individual handlers, not on the controller class. `@Public()` on a class opens **every** route in it, including ones added months later by someone who never read this file. There is no `@Protected()` decorator to undo it.

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
- payload shape: `isAccessTokenPayload` rejects the token unless the required claims are present and well-typed — `sub`/`iss` are strings, `token_use === 'access'`, `client_id` is a string, `exp`/`iat` are numbers, and `cognito:groups` (if present) is an array of strings.

> [!IMPORTANT]
> The scaffold accepts access tokens only by design. Backend APIs are resource servers and authorize requests using access tokens; ID tokens are for the frontend to establish who the user is. 

> [!WARNING]
> Common Confusion: Do not use the ID token for API authorization. ID tokens are intended for your client application to establish who the user is; passing them to a backend API exposes identity claims unnecessarily and confuses authentication with authorization. Backend APIs should validate access tokens only. 

In `cognito.guard.ts`, `isAccessTokenPayload` validates the token type and claim shape, and the guard then checks the client id against the configured `COGNITO_CLIENT_ID`:

```typescript
// isAccessTokenPayload(...) rejects anything where token_use !== 'access'
// (alongside the other claim-shape checks), then the guard verifies:
if (payload.client_id !== config.clientId) {
  throw new UnauthorizedException();
}
```

> [!NOTE]
> `client_id` validation currently accepts a single client. If this pool ever serves
multiple app clients (e.g. a separate web and mobile app sharing one user pool),
change COGNITO_CLIENT_ID to accept a comma-separated list and validate membership
in that allowlist instead of simply an equality check.

## Next steps: building on this scaffold

What you get out of the box is **authentication only**: a request either carries a valid access token or it doesn't. Everything below is what each project still has to build, in the order most projects need it.

### 1. Store your users in your own database, keyed on `sub`

Cognito is an identity provider, not your users table. Give your user entity a unique `cognito_sub` column and join on it. Use `sub` — it is immutable. Do **not** key on email: users change theirs, and you will silently orphan their data.

### 2. Getting the user's email (the first wall almost everyone hits)

The access token has **no `email` claim**, and that is not an oversight — `email` lives on the ID token. `AccessTokenPayload` in `cognito.types.ts` deliberately omits it. You have three options:

- read the ID token client-side and send the email in your own signup request body
- add a Cognito **Pre-Token-Generation Lambda** to inject a custom claim into the access token
- look it up server-side with `AdminGetUser` (`@aws-sdk/client-cognito-identity-provider` is already a dependency)

Whichever you pick, **do not** change the guard to accept ID tokens. That collapses the authn/authz distinction this module is built on.

### 3. Add authorization

`cognito:groups` is shape-validated by the guard and then ignored. Today **every authenticated user can reach every non-public route** — there is no admin/user distinction. Build a `@Roles('admin')` decorator plus a guard that reads `request.user['cognito:groups']`. Create the groups in the user pool first; a user's groups only appear in their token after they re-authenticate.

### 4. Add a `@CurrentUser()` param decorator

Every project rewrites `cognitoService.getUser(req)` plus a null check. Wrap it in a param decorator. Prefer one that **throws** when the user is missing: `getUser()` returns `null` both when auth is disabled and on `@Public()` routes, which invites `user?.sub === ownerId` comparisons that quietly evaluate false for unauthenticated callers instead of failing loudly.

### 5. Add logout and 401 handling

There is no `signOut` anywhere in the scaffold. Add one (`import { signOut } from 'aws-amplify/auth'`), plus an axios **response** interceptor in `apiClient.ts` that signs out and redirects when the backend returns 401.

### 6. Before you go to production

- Create your **own** user pool. If you reuse a shared one, register your own app client — the `client_id` equality check is the only thing keeping another project's tokens out.
- Replace `app.enableCors()` in `main.ts` with an explicit origin allowlist. It currently defaults to `*`.
- Add `helmet()` for security headers and `@nestjs/throttler` for rate limiting. Neither is installed; there is no limit on repeated 401s today.
- Confirm `SWAGGER_ENABLED=false`. Swagger mounts at the same path as the global `api` prefix and is served outside the guard pipeline, so enabling it publishes your whole API surface.
- Set `VITE_API_BASE_URL`. It is never defined, so production builds currently hardcode `http://localhost:3000`.
- Decide whether self-signup should be open. `<Authenticator>` renders with no props, which shows a **Create Account** tab by default. If you don't want that, pass `hideSignUp` and set `AllowAdminCreateUserOnly` on the pool.

## Hurdles you will run into

- **Every new controller is protected the moment you write it.** Forget `@Public()` on a Stripe or Twilio webhook and it will 401 in production with a generic message and no obvious cause.
- **Local dev with auth off never exercises the guard.** Set the env vars and re-test before merging anything auth-adjacent, or you will ship code whose auth path has never once run.
- **A JWKS outage returns 401, not 503.** Clients read that as "bad token" and re-login instead of backing off. The JWKS client allows 5 requests/minute with no stale-key fallback, so a burst of unknown `kid`s can starve legitimate requests during a key rotation.
- **`client_id` accepts exactly one value.** A second app client (mobile, admin panel) needs the comma-separated allowlist described above.
- **Tokens live in `localStorage`** (Amplify's default). Any XSS on your origin yields a durable refresh token. Combined with wildcard CORS and no CSP, that is worth a deliberate decision rather than a default.
- **Changing `.env` requires a frontend rebuild, not just a restart.** The `VITE_` values are inlined at build time and `isAuthEnabled()` is evaluated once at module load.
- **Groups do not appear until re-login.** Adding a user to a Cognito group does not retroactively change tokens they already hold.

## Helpful Resources for understanding Auth!
- The most amazing explanation of authn (OAUTH 2.0) and authz (OIDC) you'll ever watch: https://www.youtube.com/watch?v=996OiexHze0&t=2126s
- Difference between id and access tokens: https://auth0.com/blog/id-token-access-token-what-is-the-difference/
- Using AWS to verify JWT: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
