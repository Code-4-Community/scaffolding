import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisciplinesController } from './disciplines.controller';
import { DisciplinesService } from './disciplines.service';
import { Discipline } from './disciplines.entity';
import { JwtStrategy } from '../auth/jwt.strategy';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Discipline]), AuthModule],
  controllers: [DisciplinesController],
  providers: [DisciplinesService, JwtStrategy, CurrentUserInterceptor],
})
export class DisciplinesModule {}
