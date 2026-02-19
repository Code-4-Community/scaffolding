import { Injectable } from '@nestjs/common';
import { CreateInventoryHoldingDto } from './dto/create-inventory-holding.dto';
import { UpdateInventoryHoldingDto } from './dto/update-inventory-holding.dto';

@Injectable()
export class InventoryHoldingService {
  create(createInventoryHoldingDto: CreateInventoryHoldingDto) {
    return 'This action adds a new inventoryHolding';
  }

  findAll() {
    return `This action returns all inventoryHolding`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventoryHolding`;
  }

  update(id: number, updateInventoryHoldingDto: UpdateInventoryHoldingDto) {
    return `This action updates a #${id} inventoryHolding`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventoryHolding`;
  }
}
