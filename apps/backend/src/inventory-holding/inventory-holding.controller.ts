import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InventoryHoldingService } from './inventory-holding.service';
import { CreateInventoryHoldingDto } from './dto/create-inventory-holding.dto';
import { UpdateInventoryHoldingDto } from './dto/update-inventory-holding.dto';

@Controller('inventory-holding')
export class InventoryHoldingController {
  constructor(
    private readonly inventoryHoldingService: InventoryHoldingService,
  ) {}

  @Post()
  create(@Body() createInventoryHoldingDto: CreateInventoryHoldingDto) {
    return this.inventoryHoldingService.create(createInventoryHoldingDto);
  }

  @Get()
  findAll() {
    return this.inventoryHoldingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryHoldingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryHoldingDto: UpdateInventoryHoldingDto,
  ) {
    return this.inventoryHoldingService.update(+id, updateInventoryHoldingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryHoldingService.remove(+id);
  }
}
