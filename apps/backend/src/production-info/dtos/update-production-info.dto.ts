import { PartialType } from '@nestjs/swagger';
import { CreateProductionInfoDto } from './create-production-info.dto';

export class UpdateProductionInfoDto extends PartialType(CreateProductionInfoDto) {}
