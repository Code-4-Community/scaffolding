import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { Application } from './application.entity';
import { AuthModule } from '../auth/auth.module';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { UsersModule } from '../users/users.module';
import { ApplicationValidationEmailFilter } from './filters/application-validation-email.filter';
import { ApplicationCreationErrorFilter } from './filters/application-creation-validation.filter';

@Module({
  imports: [TypeOrmModule.forFeature([Application]), AuthModule, UsersModule],
  controllers: [ApplicationsController],
  providers: [
    ApplicationsService,
    CurrentUserInterceptor,
    ApplicationValidationEmailFilter,
    ApplicationCreationErrorFilter,
  ],
})
export class ApplicationsModule {}
