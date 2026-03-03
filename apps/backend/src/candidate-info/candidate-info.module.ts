import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicantsController } from './candidate-info.controller';
import { ApplicantsService } from './candidate-info.service';
import { Applicant } from './candidate-info.entity';
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
