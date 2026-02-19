import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OmchaiService } from './omchai.service';
import { OmchaiController } from './omchai.controller';
import { Omchai } from './omchai.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Omchai])],
  controllers: [OmchaiController],
  providers: [OmchaiService],
  exports: [OmchaiService],
})
export class OmchaiModule {}
