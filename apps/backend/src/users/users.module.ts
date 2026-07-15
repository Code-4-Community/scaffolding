import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { EmailsModule } from '../aws/ses/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
