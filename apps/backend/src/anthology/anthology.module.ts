import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnthologyController } from './anthology.controller';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { Story } from '../story/story.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Anthology, Story]),
    AuthModule,
    UsersModule,
  ],
  controllers: [AnthologyController],
  providers: [AnthologyService, CurrentUserInterceptor],
  exports: [AnthologyService],
})
export class AnthologyModule {}
