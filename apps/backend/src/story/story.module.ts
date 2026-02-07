import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { Story } from './story.entity';
import { AuthorService } from '../author/author.service';
import { AnthologyService } from '../anthology/anthology.service';
import { AnthologyModule } from '../anthology/anthology.module';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { AuthorModule } from '../author/author.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Story]),
    AnthologyModule,
    StoryModule,
    UsersModule,
    AuthModule,
    AuthorModule,
  ],
  controllers: [StoryController],
  providers: [StoryService, CurrentUserInterceptor],
})
export class StoryModule {}
