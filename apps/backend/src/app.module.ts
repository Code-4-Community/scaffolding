import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import AppDataSource from './data-source';
import { UtilModule } from './util/util.module';

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options), UtilModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
