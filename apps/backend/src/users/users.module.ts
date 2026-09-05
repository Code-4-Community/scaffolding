import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AWSSESModule } from '../aws/ses/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AWSSESModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
