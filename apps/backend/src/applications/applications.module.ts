import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { Application } from './application.entity';
import { UtilModule } from '../util/util.module';
import { ApplicationValidationEmailFilter } from './filters/application-validation-email.filter';
import { ApplicationCreationErrorFilter } from './filters/application-creation-validation.filter';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Application]), UtilModule, UsersModule],
  controllers: [ApplicationsController],
  providers: [
    ApplicationsService,
    ApplicationValidationEmailFilter,
    ApplicationCreationErrorFilter,
  ],
})
export class ApplicationsModule {}
