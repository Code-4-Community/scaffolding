import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { Application } from './application.entity';
import { UtilModule } from '../util/util.module';
import { ApplicationValidationEmailFilter } from './application-validation-email.filter';

@Module({
  imports: [TypeOrmModule.forFeature([Application]), UtilModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, ApplicationValidationEmailFilter],
})
export class ApplicationsModule {}
