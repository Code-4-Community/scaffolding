PROBLEM: Because we write to Cognito and the database in two separate steps, either can succeed while the other fails. The two failure cases and proposed solutions are:

Case 1 : Cognito succeeds, database fails
A Cognito user exists but there is no corresponding database record. The new admin could theoretically receive the temp password email and attempt to log in, but the application would have no record of them

Solution: If the database write fails after Cognito succeeds, immediately issue an `AdminDeleteUser` call to remove the Cognito user, then throw an error to the caller. This is the ideal scenario. If the delete also fails, the orphaned Cognito user must be cleaned up manually

Case 2 : Database succeeds, Cognito fails
The database record exists but there is no Cognito user, so the admin cannot log in.

Solution: Roll back the database transaction (do not commit). Since both `User` and `AdminInfo` are written within a single transaction, a rollback removes both records cleanly

## AWS SDK Package

All Cognito calls use:

```
@aws-sdk/client-cognito-identity-provider
```

This package is already a dependency of the project (used in `apps/backend/src/auth/auth.service.ts`).

---

## Scaffolded Functions

The following function signatures and mocks define the proposed implementation

---

### `createAdminUser(email, temporaryPassword)`

```typescript
/**
 * Creates a new user in AWS Cognito with admin privileges using the
 * AdminCreateUser API. Cognito will immediately send the temporary password
 * to the provided email address. The created user will have status
 * FORCE_CHANGE_PASSWORD, meaning Cognito will require them to set a new
 * password on first login.
 *
 * Uses MessageAction: 'SUPPRESS' if re-sending should be handled separately
 * via resendAdminInvite(). Default behavior sends the email automatically.
 *
 * @param email - The email address for the new admin. Used as the Cognito
 *                username. Must not already exist in the User Pool.
 *                Example: 'jane.doe@northeastern.edu'
 * @param temporaryPassword - A temporary password meeting the User Pool's
 *                            password policy. Cognito will force the user to
 *                            change this on first login.
 *                            Example: 'TempPass123!'
 *
 * @returns An object containing:
 *   - cognitoUsername {string} — The Cognito username (same as email in this pool)
 *   - userStatus {string} — Will be 'FORCE_CHANGE_PASSWORD' immediately after creation
 *
 * @throws {UsernameExistsException} If a user with this email already exists
 *         in the Cognito User Pool.
 * @throws {InvalidPasswordException} If the temporary password does not meet
 *         the User Pool's password policy.
 * @throws {Error} For any other Cognito SDK or network error.
 *
 * TODO: Replace mock with real AdminCreateUser call from
 *       @aws-sdk/client-cognito-identity-provider
 */
async function createAdminUser(
  email: string,
  temporaryPassword: string,
): Promise<{ cognitoUsername: string; userStatus: string }> {
  // MOCK — no real Cognito call is made
  console.log(
    `[MOCK] createAdminUser called with email=${email}, temporaryPassword=***`,
  );
  return {
    cognitoUsername: email,
    userStatus: 'FORCE_CHANGE_PASSWORD',
  };
}
```

---

### `createAdminDatabaseRecords(email, cognitoUsername, firstName, lastName, discipline)`

```typescript
/**
 * Creates the two database records required for a new admin account:
 *   1. A User record with userType set to ADMIN
 *   2. An AdminInfo record with the admin's discipline
 *
 * Both records share the same email as their primary key. Both must be
 * written inside a single database transaction so that either both are
 * committed or neither is, preventing a partial write.
 *
 * @param email - The admin's email address. Used as the primary key for
 *                both the User and AdminInfo records.
 *                Example: 'jane.doe@northeastern.edu'
 * @param cognitoUsername - The Cognito username returned by createAdminUser.
 *                          In this User Pool, this is the same as email, but
 *                          it is passed explicitly to keep the two systems
 *                          explicitly linked in application logic.
 * @param firstName - The admin's first name. Example: 'Jane'
 * @param lastName - The admin's last name. Example: 'Doe'
 * @param discipline - The admin's discipline. Must be a value from
 *                     DISCIPLINE_VALUES. Example: DISCIPLINE_VALUES.NURSING
 *
 * @returns An object containing:
 *   - user {User} — The newly created User record
 *   - adminInfo {AdminInfo} — The newly created AdminInfo record
 *
 * @throws {QueryFailedError} If a User or AdminInfo with this email already
 *         exists in the database (primary key collision).
 * @throws {Error} For any other database or transaction error. If this
 *         function throws, the caller (provisionNewAdmin) is responsible
 *         for rolling back the Cognito user.
 *
 * TODO: Replace mock with real TypeORM transaction using
 *       EntityManager.transaction() to ensure atomicity.
 */
async function createAdminDatabaseRecords(
  email: string,
  cognitoUsername: string,
  firstName: string,
  lastName: string,
  discipline: string,
): Promise<{ user: object; adminInfo: object }> {
  // MOCK — no real database write is made
  console.log(
    `[MOCK] createAdminDatabaseRecords called with email=${email}, cognitoUsername=${cognitoUsername}`,
  );
  return {
    user: {
      email,
      firstName,
      lastName,
      userType: 'ADMIN',
    },
    adminInfo: {
      email,
      discipline,
      createdAt: new Date('2026-04-09T00:00:00.000Z'),
      updatedAt: new Date('2026-04-09T00:00:00.000Z'),
    },
  };
}
```

---

### `provisionNewAdmin(email, firstName, lastName, discipline, temporaryPassword)`

```typescript
/**
 * Top-level orchestrator for creating a new admin account. Calls
 * createAdminUser and createAdminDatabaseRecords in sequence and handles
 * partial failure by rolling back the Cognito user if the database write
 * fails.
 *
 * This function must only be callable by an authenticated admin. Auth
 * enforcement is not yet wired up — a TODO is left below.
 *
 * Partial failure handling:
 *   - If createAdminUser succeeds but createAdminDatabaseRecords fails,
 *     this function will attempt to delete the Cognito user via
 *     AdminDeleteUser before re-throwing the database error. This prevents
 *     a ghost Cognito user from being left behind.
 *   - If createAdminUser fails, no database write is attempted and the
 *     Cognito error is thrown directly to the caller.
 *   - If the Cognito rollback (AdminDeleteUser) itself fails, the error is
 *     logged and the original database error is still thrown. Manual cleanup
 *     of the orphaned Cognito user will be required.
 *
 * @param email - The new admin's email address.
 *                Example: 'jane.doe@northeastern.edu'
 * @param firstName - The new admin's first name. Example: 'Jane'
 * @param lastName - The new admin's last name. Example: 'Doe'
 * @param discipline - The new admin's discipline from DISCIPLINE_VALUES.
 * @param temporaryPassword - A temporary password to seed the Cognito account.
 *                            Cognito will force a change on first login.
 *
 * @returns An object containing:
 *   - cognitoUsername {string} — The Cognito username of the new admin
 *   - userStatus {string} — Cognito user status (FORCE_CHANGE_PASSWORD)
 *   - user {User} — The new User database record
 *   - adminInfo {AdminInfo} — The new AdminInfo database record
 *
 * @throws {UsernameExistsException} If the email already exists in Cognito.
 * @throws {QueryFailedError} If the email already exists in the database
 *         (after successfully rolling back the Cognito user).
 * @throws {Error} For any unrecoverable error, including a failed Cognito
 *         rollback. Callers should surface this as a 500 Internal Server Error.
 *
 * TODO: Add auth middleware guard to restrict this endpoint to ADMIN users only.
 * TODO: Replace mock inner calls with real createAdminUser and
 *       createAdminDatabaseRecords implementations.
 */
async function provisionNewAdmin(
  email: string,
  firstName: string,
  lastName: string,
  discipline: string,
  temporaryPassword: string,
): Promise<object> {
  console.log(`[MOCK] provisionNewAdmin called for email=${email}`);

  // Step 1: Create Cognito user
  const cognitoResult = await createAdminUser(email, temporaryPassword);

  // Step 2: Create database records — if this fails, roll back Cognito
  let dbResult: { user: object; adminInfo: object };
  try {
    dbResult = await createAdminDatabaseRecords(
      email,
      cognitoResult.cognitoUsername,
      firstName,
      lastName,
      discipline,
    );
  } catch (dbError) {
    // TODO: Call AdminDeleteUser here to roll back the Cognito user
    console.error(
      `[MOCK] Database write failed. Would roll back Cognito user: ${cognitoResult.cognitoUsername}`,
    );
    throw dbError;
  }

  return {
    cognitoUsername: cognitoResult.cognitoUsername,
    userStatus: cognitoResult.userStatus,
    user: dbResult.user,
    adminInfo: dbResult.adminInfo,
  };
}
```

---

### `handleNewPasswordChallenge(username, tempPassword, newPassword)`

```typescript
/**
 * Handles the NEW_PASSWORD_REQUIRED challenge that Cognito issues when a
 * user created via AdminCreateUser logs in for the first time. The frontend
 * should call this function (via a backend endpoint) immediately after
 * receiving the challenge response from a regular sign-in attempt.
 *
 * This wraps the Cognito RespondToAuthChallenge API call with
 * ChallengeName: 'NEW_PASSWORD_REQUIRED'.
 *
 * Flow:
 *   1. New admin submits email + temporary password on the login page.
 *   2. Cognito returns a session token and NEW_PASSWORD_REQUIRED challenge
 *      instead of granting full auth tokens.
 *   3. Frontend prompts the admin to enter a new permanent password.
 *   4. Frontend calls this function with the username, temp password, and
 *      chosen new password.
 *   5. On success, Cognito confirms the user, updates status to CONFIRMED,
 *      and returns full session tokens.
 *
 * @param username - The admin's Cognito username (their email address).
 *                   Example: 'jane.doe@northeastern.edu'
 * @param tempPassword - The temporary password from the Cognito invitation
 *                       email. Required to authenticate the challenge session.
 *                       Example: 'TempPass123!'
 * @param newPassword - The new permanent password chosen by the admin. Must
 *                      meet the User Pool's password policy.
 *                      Example: 'MyNewSecurePass456!'
 *
 * @returns An object containing full session tokens:
 *   - accessToken {string} — Short-lived JWT for authenticating API requests
 *   - idToken {string} — JWT containing user identity claims
 *   - refreshToken {string} — Long-lived token for refreshing the session
 *
 * @throws {NotAuthorizedException} If the username/tempPassword combination
 *         is incorrect or the session has expired.
 * @throws {InvalidPasswordException} If the new password does not meet the
 *         User Pool's password policy.
 * @throws {ExpiredCodeException} If the temporary password has expired
 *         (Cognito temporary passwords expire after a configurable period,
 *         default 7 days). Use resendAdminInvite() to issue a new one.
 * @throws {Error} For any other Cognito SDK or network error.
 *
 * TODO: Replace mock with real RespondToAuthChallenge call from
 *       @aws-sdk/client-cognito-identity-provider
 */
async function handleNewPasswordChallenge(
  username: string,
  tempPassword: string,
  newPassword: string,
): Promise<{ accessToken: string; idToken: string; refreshToken: string }> {
  // MOCK — no real Cognito call is made
  console.log(
    `[MOCK] handleNewPasswordChallenge called for username=${username}`,
  );
  return {
    accessToken:
      'eyJraWQiOiJtb2NrLWtleS1pZCIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJtb2NrLXVzZXItc3ViLTEyMzQiLCJlbWFpbCI6ImphbmUuZG9lQG5vcnRoZWFzdGVybi5lZHUiLCJleHAiOjk5OTk5OTk5OTksImlhdCI6MTcwMDAwMDAwMH0.mock-access-token-signature',
    idToken:
      'eyJraWQiOiJtb2NrLWtleS1pZCIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJtb2NrLXVzZXItc3ViLTEyMzQiLCJlbWFpbCI6ImphbmUuZG9lQG5vcnRoZWFzdGVybi5lZHUiLCJjb2duaXRvOnVzZXJuYW1lIjoiamFuZS5kb2VAbm9ydGhlYXN0ZXJuLmVkdSIsImV4cCI6OTk5OTk5OTk5OSwiaWF0IjoxNzAwMDAwMDAwfQ.mock-id-token-signature',
    refreshToken: 'mock-refresh-token-opaque-string-1234567890abcdef',
  };
}
```

---

### `resendAdminInvite(email)`

```typescript
/**
 * Re-triggers the Cognito invitation email for an existing admin whose
 * temporary password has expired or was never received. Uses the Cognito
 * AdminCreateUser API with MessageAction: 'RESEND', which re-sends the
 * invitation without creating a new user.
 *
 * When to use:
 *   - The new admin never received the original invitation email.
 *   - The temporary password expired before the admin logged in (Cognito
 *     temporary passwords expire after a configurable period, default 7 days).
 *   - The admin accidentally deleted the email.
 *
 * Note: This does NOT generate a new Cognito user. The existing Cognito user
 * must already be in FORCE_CHANGE_PASSWORD status. If the user has already
 * completed first login and is CONFIRMED, this call will fail.
 *
 * @param email - The email address of the admin whose invite should be
 *                resent. Must match an existing Cognito user.
 *                Example: 'jane.doe@northeastern.edu'
 *
 * @returns An object confirming the resend:
 *   - cognitoUsername {string} — The Cognito username the invite was sent to
 *   - userStatus {string} — Will still be 'FORCE_CHANGE_PASSWORD'
 *   - messageSent {boolean} — true if Cognito confirmed the message was sent
 *
 * @throws {UserNotFoundException} If no Cognito user exists for this email.
 * @throws {InvalidParameterException} If the user is already CONFIRMED and
 *         the invitation cannot be resent (they have already set a password).
 * @throws {Error} For any other Cognito SDK or network error.
 *
 * TODO: Replace mock with real AdminCreateUser call using
 *       MessageAction: 'RESEND' from @aws-sdk/client-cognito-identity-provider
 */
async function resendAdminInvite(
  email: string,
): Promise<{ cognitoUsername: string; userStatus: string; messageSent: boolean }> {
  // MOCK — no real Cognito call is made
  console.log(`[MOCK] resendAdminInvite called for email=${email}`);
  return {
    cognitoUsername: email,
    userStatus: 'FORCE_CHANGE_PASSWORD',
    messageSent: true,
  };
}
```

---

## Mock Response Shapes Reference

The mocks above return data shaped to mirror actual Cognito and database responses. For reference:

**Cognito `AdminCreateUser` response shape (actual):**
```json
{
  "User": {
    "Username": "jane.doe@northeastern.edu",
    "UserStatus": "FORCE_CHANGE_PASSWORD",
    "Enabled": true,
    "UserCreateDate": "2026-04-09T00:00:00.000Z",
    "UserLastModifiedDate": "2026-04-09T00:00:00.000Z",
    "Attributes": [
      { "Name": "email", "Value": "jane.doe@northeastern.edu" },
      { "Name": "email_verified", "Value": "true" },
      { "Name": "sub", "Value": "mock-user-sub-1234" }
    ]
  }
}
```

**Cognito `RespondToAuthChallenge` response shape (actual):**
```json
{
  "AuthenticationResult": {
    "AccessToken": "<jwt>",
    "IdToken": "<jwt>",
    "RefreshToken": "<opaque-string>",
    "TokenType": "Bearer",
    "ExpiresIn": 3600
  },
  "ChallengeParameters": {}
}
```

**Database `User` record shape (actual TypeORM entity):**
```json
{
  "email": "jane.doe@northeastern.edu",
  "firstName": "Jane",
  "lastName": "Doe",
  "userType": "ADMIN"
}
```

**Database `AdminInfo` record shape (actual TypeORM entity):**
```json
{
  "email": "jane.doe@northeastern.edu",
  "discipline": "<value from DISCIPLINE_VALUES>",
  "createdAt": "2026-04-09T00:00:00.000Z",
  "updatedAt": "2026-04-09T00:00:00.000Z"
}
```