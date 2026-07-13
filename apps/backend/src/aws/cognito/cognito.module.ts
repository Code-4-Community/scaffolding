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
      this.logger.warn(
        'Cognito auth disabled: env vars missing. All routes open.',
      );
    } else {
      this.logger.log(`Cognito auth enabled`);
    }
  }
}
