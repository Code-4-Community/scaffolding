import { Module } from '@nestjs/common';
import { InventoryHoldingService } from './inventory-holding.service';
import { InventoryHoldingController } from './inventory-holding.controller';

@Module({
  controllers: [InventoryHoldingController],
  providers: [InventoryHoldingService],
})
export class InventoryHoldingModule {}
