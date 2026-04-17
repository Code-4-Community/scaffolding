import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

import CognitoAuthConfig from '../../../shared/aws-exports';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    const cognitoAuthority = `https://cognito-idp.${CognitoAuthConfig.aws_cognito_region}.amazonaws.com/${CognitoAuthConfig.aws_user_pools_id}`;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: CognitoAuthConfig.aws_user_pools_web_client_id,
      issuer: cognitoAuthority,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: cognitoAuthority + '/.well-known/jwks.json',
      }),
    });
  }

  /**
   * Load the app User from Postgres so `role` matches the database (not only Cognito custom attrs).
   * Global guards (e.g. UserStatusGuard, OmchaiGuard) run before interceptors, so they need a full user here.
   */
  async validate(payload: Record<string, unknown>) {
    const email = typeof payload.email === 'string' ? payload.email : undefined;
    if (email) {
      const users = await this.usersService.findWithOmchai(email);
      if (users.length > 0) {
        return users[0];
      }
    }

    return {
      idUser: payload.sub,
      email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      role: payload['custom:role'],
      title: payload['custom:title'],
    };
  }
}
