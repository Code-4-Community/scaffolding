import { DISCIPLINE_VALUES } from '../disciplines.constants';
import { IsEnum, IsNotEmpty, IsArray } from 'class-validator';

export class CreateDisciplineRequestDto {
  @IsEnum(DISCIPLINE_VALUES)
  @IsNotEmpty()
  name: DISCIPLINE_VALUES;

  @IsArray()
  admin_ids: number[];
}
