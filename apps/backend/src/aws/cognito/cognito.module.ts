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
       * is enough here. In production it almost certainly signals a
       * misconfiguration (missing secrets) and should be surfaced at error
       * level instead. See this module's README for that change, and for how to
       * make production fail hard (throw) rather than merely logging.
       */
      this.logger.warn(message);
    } else {
      this.logger.log(`Cognito auth enabled`);
    }
  }
}
