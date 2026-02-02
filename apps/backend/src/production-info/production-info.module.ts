import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionInfo } from './production-info.entity';
import { ProductionInfoService } from './production-info.service';
import { ProductionInfoController } from './production-info.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionInfo])],
  providers: [ProductionInfoService],
  controllers: [ProductionInfoController],
  exports: [ProductionInfoService],
})
export class ProductionInfoModule {}
