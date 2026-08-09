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
       * Running without Cognito is a normal development workflow, so a warning
       * is enough there. In production it almost certainly signals a
       * misconfiguration (missing secrets), so surface it at error level.
       *
       * NODE_ENV is read at runtime, not inlined at build time, so this only
       * escalates if the deploy environment actually exports
       * NODE_ENV=production. See this module's README for the deployment step
       * and for how to make production fail hard (throw) rather than log.
       */
      if (process.env.NODE_ENV === 'production') {
        this.logger.error(message);
      } else {
        this.logger.warn(message);
      }
    } else {
      this.logger.log(`Cognito auth enabled`);
    }
  }
}
