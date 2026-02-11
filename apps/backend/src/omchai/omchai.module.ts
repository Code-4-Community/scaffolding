import { Module } from '@nestjs/common';
import { OmchaiService } from './omchai.service';
import { OmchaiController } from './omchai.controller';

@Module({
  controllers: [OmchaiController],
  providers: [OmchaiService],
  exports: [OmchaiService],
})
export class OmchaiModule {}