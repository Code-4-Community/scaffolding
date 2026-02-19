import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryHoldingDto } from './create-inventory-holding.dto';

export class UpdateInventoryHoldingDto extends PartialType(
  CreateInventoryHoldingDto,
) {}
