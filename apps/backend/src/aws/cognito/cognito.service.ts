import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CognitoJwtPayload } from './cognito.types';
import { isAuthEnabled } from './cognito.config';

@Injectable()
export class CognitoService {
  // Gets the user from the request
  getUser(request: Request): CognitoJwtPayload | null {
    // If authentication is not enabled, return null
    if (!isAuthEnabled()) {
      return null;
    }
    // Return the user from the request
    return (request as Request & { user: CognitoJwtPayload }).user ?? null;
  }
}
