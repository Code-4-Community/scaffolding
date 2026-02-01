import { PartialType } from '@nestjs/swagger';
import { CreateProductionInfoDTO } from './create-production-info.dto';

export class UpdateProductionInfoDTO extends PartialType(
  CreateProductionInfoDTO,
) {}
