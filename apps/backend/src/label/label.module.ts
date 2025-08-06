import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Label } from './types/label.entity';
import { LabelsService } from './label.service';
import { LabelsController } from './label.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Label])],
  providers: [LabelsService],
  controllers: [LabelsController],
  exports: [LabelsService],
})
export class LabelModule {}
