import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AWSS3Module } from './aws-s3/aws-s3.module';
import AppDataSource from './data-source';
import { UtilModule } from './util/util.module';
import { ApplicationsModule } from './applications/applications.module';
import { ApplicantsModule } from './applicants/applicants.module';
import { LearnerInfoModule } from './learner-info/learner-info.module';
import { VolunteerInfoModule } from './volunteer-info/volunteer-info.module';
import { Application } from './applications/application.entity';
import { AdminsModule } from './users/admins.module';
import { UsersModule } from './users/users.module';
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
    LearnerInfoModule,
    VolunteerInfoModule,
    ApplicationsModule,
    ApplicantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
