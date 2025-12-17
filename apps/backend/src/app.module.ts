import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AWSS3Module } from './aws-s3/aws-s3.module';
import AppDataSource from './data-source';
import { AdminsModule } from './users/admins.module';
import { Admin } from './users/admin.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      entities: [Admin],
    }),
    AdminsModule,
    AWSS3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
