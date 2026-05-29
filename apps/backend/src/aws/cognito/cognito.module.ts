import { Global, Module } from '@nestjs/common';
import { CognitoJWTGuard } from './cognito.guard';
import { APP_GUARD } from '@nestjs/core';
import { CognitoService } from './cognito.service';

@Global()
@Module({
  providers: [
    CognitoService,
    CognitoJWTGuard,
    { provide: APP_GUARD, useClass: CognitoJWTGuard },
  ],
  exports: [CognitoService, CognitoJWTGuard],
})
export class CognitoModule {}
