import { IsString, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';
import { AgeCategory } from '../types';

export class FilterByStringDto {
  @IsString()
  @IsNotEmpty()
  value: string;
}

export class FilterByAgeCategoryDto {
  @IsEnum(AgeCategory)
  value: AgeCategory;
}

export class FilterByPubDateDto {
  @IsDateString()
  start: string;

  @IsDateString()
  end: string;
}
