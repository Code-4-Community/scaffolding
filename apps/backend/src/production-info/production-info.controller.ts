import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { ProductionInfoService } from './production-info.service';
import { CreateProductionInfoDTO } from './dtos/create-production-info.dto';
import { UpdateProductionInfoDTO } from './dtos/update-production-info.dto';

@Controller('production-info')
export class ProductionInfoController {
  constructor(private productionInfoService: ProductionInfoService) {}

  @Get()
  getAllProductionInfo() {
    return this.productionInfoService.findAll();
  }

  @Get('/anthology/:anthologyId')
  async getProductionInfoByAnthologyId(
    @Param('anthologyId') anthologyId: string,
  ) {
    const info = await this.productionInfoService.findByAnthologyId(
      parseInt(anthologyId),
    );
    if (!info) {
      throw new NotFoundException('Production info not found');
    }
    return info;
  }

  @Post()
  createProductionInfo(@Body() body: CreateProductionInfoDTO) {
    return this.productionInfoService.create(body);
  }

  @Put('/anthology/:anthologyId')
  updateProductionInfo(
    @Param('anthologyId') anthologyId: string,
    @Body() body: UpdateProductionInfoDTO,
  ) {
    return this.productionInfoService.update(parseInt(anthologyId), body);
  }
}
