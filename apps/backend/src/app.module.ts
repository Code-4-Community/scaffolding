import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AWSS3Module } from './aws-s3/aws-s3.module';
import AppDataSource from './data-source';
import { UtilModule } from './util/util.module';
import { ApplicationsController } from './applications/applications.controller';
import { ApplicationsService } from './applications/applications.service';
import { Application } from './applications/application.entity';
import { AdminsModule } from './users/admins.module';
import { UsersModule } from './users/users.module';
import { Admin } from './users/admin.entity';
import { ConfigModule } from '@nestjs/config';
import { DisciplinesModule } from './disciplines/disciplines.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      migrations: [], // Don't load migrations when server starts - only load them when running migration commands (i had to add this to get the server to run without errors)
    }),
    UtilModule,
    AdminsModule,
    UsersModule,
    AWSS3Module,
    TypeOrmModule.forFeature([Application]),
    DisciplinesModule,
  ],
  controllers: [AppController, ApplicationsController],
  providers: [AppService, ApplicationsService],
})
export class AppModule {}
