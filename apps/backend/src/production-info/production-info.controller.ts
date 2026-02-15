import { Controller, Get, Post, Body, Param, Put, ParseIntPipe } from '@nestjs/common';
import { ProductionInfoService } from './production-info.service';
import { CreateProductionInfoDto } from './dtos/create-production-info.dto';
import { UpdateProductionInfoDto } from './dtos/update-production-info.dto';
import { ProductionInfo } from './production-info.entity';

@Controller('production-info')
export class ProductionInfoController {
  constructor(private readonly productionInfoService: ProductionInfoService) {}

  @Post()
  create(@Body() createProductionInfoDto: CreateProductionInfoDto): Promise<ProductionInfo> {
    return this.productionInfoService.create(createProductionInfoDto);
  }

  @Get()
  findAll(): Promise<ProductionInfo[]> {
    return this.productionInfoService.findAll();
  }

  @Get(':anthologyId')
  findOneByAnthologyId(@Param('anthologyId', ParseIntPipe) anthologyId: number): Promise<ProductionInfo> {
    return this.productionInfoService.findOneByAnthologyId(anthologyId);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductionInfoDto: UpdateProductionInfoDto,
  ): Promise<ProductionInfo> {
    return this.productionInfoService.update(id, updateProductionInfoDto);
  }
}
