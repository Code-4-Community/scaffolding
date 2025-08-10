import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import AppDataSource from './data-source';
import { TaskModule } from './task/task.module';
import { LabelModule } from './label/label.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    TaskModule,
    LabelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
