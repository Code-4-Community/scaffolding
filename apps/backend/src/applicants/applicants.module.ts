import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicantsController } from './applicants.controller';
import { ApplicantsService } from './applicants.service';
import { Applicant } from './applicant.entity';
import { JwtStrategy } from '../auth/jwt.strategy';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Applicant])],
  controllers: [ApplicantsController],
  providers: [
    ApplicantsService,
    AuthService,
    JwtStrategy,
    CurrentUserInterceptor,
  ],
  exports: [ApplicantsService],
})
export class ApplicantsModule {}
