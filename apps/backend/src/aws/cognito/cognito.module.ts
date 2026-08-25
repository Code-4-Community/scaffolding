import { Global, Module, OnModuleInit, Logger } from '@nestjs/common';
import { CognitoJWTGuard } from './cognito.guard';
import { APP_GUARD } from '@nestjs/core';
import { CognitoService } from './cognito.service';
import { hasAnyCognitoEnv, isAuthEnabled } from './cognito.config';

@Global()
@Module({
  providers: [
    CognitoService,
    { provide: APP_GUARD, useClass: CognitoJWTGuard },
  ],
  exports: [CognitoService],
})
export class CognitoModule implements OnModuleInit {
  private readonly logger = new Logger(CognitoModule.name);

  /**
   * Reports the resolved auth mode at startup.
   *
   * `isAuthEnabled()` throws an `AuthConfigurationError` when the Cognito configuration is unusable and `AUTH_DISABLED=true` was not set.
   * That error is deliberately left to propagate: it fails `NestFactory.create` so the process exits instead of coming up with every route unauthenticated.
   */
  onModuleInit() {
    if (!isAuthEnabled()) {
      // Reached only via an explicit AUTH_DISABLED=true opt-in.
      this.logger.warn(
        'Cognito auth disabled via AUTH_DISABLED=true. All routes are open and ' +
          'no bearer token is verified. This must never be set in a deployed ' +
          'environment.',
      );
      if (hasAnyCognitoEnv()) {
        this.logger.warn(
          'COGNITO_* environment variables are set but ignored because ' +
            'AUTH_DISABLED=true. Remove AUTH_DISABLED (or set it to false) to ' +
            'enforce authentication.',
        );
      }
    } else {
      this.logger.log(`Cognito auth enabled`);
    }
  }
}
