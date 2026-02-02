import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductionInfo } from './production-info.entity';
import { CreateProductionInfoDTO } from './dtos/create-production-info.dto';
import { UpdateProductionInfoDTO } from './dtos/update-production-info.dto';

@Injectable()
export class ProductionInfoService {
  constructor(
    @InjectRepository(ProductionInfo)
    private repo: Repository<ProductionInfo>,
  ) {}

  async create(body: CreateProductionInfoDTO) {
    const productionInfo = this.repo.create(body);
    return this.repo.save(productionInfo);
  }

  async findAll() {
    return this.repo.find();
  }

  async findByAnthologyId(anthologyId: number) {
    // checking if the anthology has info attached
    return this.repo.findOne({ where: { anthologyId } });
  }

  async update(anthologyId: number, body: UpdateProductionInfoDTO) {
    // first we find the existing one to update
    const productionInfo = await this.findByAnthologyId(anthologyId);
    if (!productionInfo) {
      // throw error if it doesnt exist
      throw new NotFoundException(
        'Production Info not found for this anthology',
      );
    }
    Object.assign(productionInfo, body);
    return this.repo.save(productionInfo);
  }
}
