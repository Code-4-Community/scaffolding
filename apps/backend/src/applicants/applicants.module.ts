import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicantsController } from './applicants.controller';
import { ApplicantsService } from './applicants.service';
import { Applicant } from './applicant.entity';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Applicant]), UsersModule, AuthModule],
  controllers: [ApplicantsController],
  providers: [ApplicantsService, CurrentUserInterceptor],
  exports: [ApplicantsService],
})
export class ApplicantsModule {}
