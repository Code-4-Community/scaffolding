import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { Request } from 'express';

import { IS_PUBLIC_KEY } from './cognito.decorator';
import { CognitoJwtPayload } from './cognito.types';
import { getCognitoConfig, isAuthEnabled } from './cognito.config';

// Checks if client id or audience returned matches your own COGNITO_CLIENT_ID
function isAudienceValid(
  payload: CognitoJwtPayload,
  clientId: string,
): boolean {
  if (payload.client_id === clientId) {
    return true;
  }
  const aud = payload.aud;
  if (typeof aud === 'string') {
    return aud === clientId;
  }
  return false;
}

// Extracts the bearer token from the request's Authorization header
function extractBearerToken(request: Request): string | undefined {
  const header = request.headers.authorization;
  if (!header?.startsWith('Bearer ')) return undefined;
  return header.slice('Bearer '.length).trim() || undefined;
}

@Injectable()
export class CognitoJWTGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  // Whether or not the request is allowed to proceed
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // If authentication is not enabled, allow the request to proceed
    if (!isAuthEnabled()) {
      return true;
    }

    // If the route is public (Either the route is marked as public or the controller/handler is marked as public), allow the request to proceed
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // Extract the bearer token from the request's Authorization header
    const request = context.switchToHttp().getRequest<Request>();
    const token = extractBearerToken(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    // Verify the token and attach the JWT payload to request.user
    const payload = await this.verifyToken(token);
    (request as Request & { user: CognitoJwtPayload }).user = payload;
    return true;
  }

  // Verifies the token against user pool JWKS endpoint, and returns the JWT payload if the token is valid
  private verifyToken(token: string): Promise<CognitoJwtPayload> {
    // If the region, user pool ID, or client ID is not set, throw an unauthorized exception by default
    const config = getCognitoConfig();
    if (!config) {
      throw new UnauthorizedException();
    }

    // Set up JWKS client to get the public key for the token to verify the JWT token signature
    const client = jwksClient({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${config.issuer}/.well-known/jwks.json`,
    });

    // Function to get the public key for the token to verify the JWT token signature
    const getKey: jwt.GetPublicKeyOrSecret = (header, callback) => {
      const kid = header.kid; // The key ID (kid) from the JWT header
      if (!kid) {
        callback(new Error('JWT header missing kid'));
        return;
      }
      // Get the public key for the token to verify the JWT token signature
      client
        .getSigningKey(kid)
        .then((key) => callback(null, key.getPublicKey()))
        .catch((err: Error) => callback(err));
    };

    // Verify the token and return the JWT payload if the token is valid
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        { issuer: config.issuer, algorithms: ['RS256'] }, // AWS Cognito signs tokens with RS256 algorithm
        (err, decoded) => {
          // If verification fails, return an unauthorized exception
          if (err || !decoded || typeof decoded === 'string') {
            reject(new UnauthorizedException());
            return;
          }
          // If the token is valid, return the JWT payload
          const payload = decoded as CognitoJwtPayload;
          // If the audience is not our own client ID, return an unauthorized exception
          if (!isAudienceValid(payload, config.clientId)) {
            reject(new UnauthorizedException());
            return;
          }
          // If the token is valid, return the JWT payload
          resolve(payload);
        },
      );
    });
  }
}
