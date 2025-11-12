import { Module } from '@nestjs/common';
import { PandadocService } from './pandadoc.service';
import { PandadocController } from './pandadoc.controller';

@Module({
  controllers: [PandadocController],
  providers: [PandadocService],
  exports: [PandadocService], // Export service so other modules can use it
})
export class PandadocModule {}
