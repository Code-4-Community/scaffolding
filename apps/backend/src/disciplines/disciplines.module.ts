import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisciplinesController } from './disciplines.controller';
import { DisciplinesService } from './disciplines.service';
import { Discipline } from './disciplines.entity';
import { AuthModule } from '../auth/auth.module';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Discipline]), AuthModule],
  controllers: [DisciplinesController],
  providers: [DisciplinesService, CurrentUserInterceptor, RolesGuard],
})
export class DisciplinesModule {}
