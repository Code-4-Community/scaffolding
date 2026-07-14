import { Global, Module, OnModuleInit, Logger } from '@nestjs/common';
import { CognitoJWTGuard } from './cognito.guard';
import { APP_GUARD } from '@nestjs/core';
import { CognitoService } from './cognito.service';
import { isAuthEnabled } from './cognito.config';

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

  onModuleInit() {
    if (!isAuthEnabled()) {
      const message =
        'Cognito auth disabled: env vars missing. All routes open.';
      /**
       * IMPORTANT:
       * In production, running with auth disabled almost certainly signals a
       * misconfiguration (missing secrets), so surface it at error level. In
       * development, running without Cognito is a normal workflow, so a warning
       * is enough. See this module's README for how to make production fail hard
       * (throw) instead of merely logging.
       */
      // if (process.env.NODE_ENV === 'production') {
      //   this.logger.error(message);
      // }
      this.logger.warn(message);
    } else {
      this.logger.log(`Cognito auth enabled`);
    }
  }
}
