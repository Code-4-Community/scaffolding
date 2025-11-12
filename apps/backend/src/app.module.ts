import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PandadocModule } from './pandadoc/pandadoc.module';
import AppDataSource from './data-source';

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options), PandadocModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
