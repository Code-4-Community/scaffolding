import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenPayload } from './cognito.types';
import { isAuthEnabled } from './cognito.config';

@Injectable()
export class CognitoService {
  private readonly logger = new Logger(CognitoService.name);

  /**
   * Retrieves the authenticated user's verified access token payload from the request.
   *
   * The {@link CognitoJWTGuard} verifies the incoming bearer token and attaches the
   * decoded payload to `request.user` before the route handler runs. This method reads
   * that payload back out in a type-safe way, since Express's `Request` type has no
   * knowledge of the `user` property the guard adds.
   *
   * @param request - The incoming Express request, expected to have passed through {@link CognitoJWTGuard}.
   * @returns The verified {@link AccessTokenPayload} for the authenticated user, or `null`
   *   if authentication is disabled or no valid token was attached to the request.
   */
  getUser(request: Request): AccessTokenPayload | null {
    // If authentication is not enabled, return null
    if (!isAuthEnabled()) {
      this.logger.debug(
        'getUser returning null: authentication is disabled (Cognito env variables missing)',
      );
      return null;
    }
    // The CognitoJWTGuard attaches the verified JWT payload to request.user,
    // but Express's Request type doesn't know about it, so we widen the type.
    const authenticatedRequest = request as Request & {
      user: AccessTokenPayload;
    };

    // user may be undefined if no token was attached; normalize that to null.
    if (!authenticatedRequest.user) {
      this.logger.warn(
        'getUser returning null: no verified user attached to the request. ' +
          'Auth is enabled, request bypassed CognitoJWTGuard (a @Public() route) or the guard did not run for this handler.',
      );
      return null;
    }
    return authenticatedRequest.user;
  }
}
