import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([Author]), AuthModule, UsersModule],
  controllers: [AuthorController],
  providers: [AuthorService, CurrentUserInterceptor],
  exports: [AuthorService],
})
export class AuthorModule {}
