import { IsInt, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateProductionInfoDTO {
  @IsInt()
  anthology_id: number;

  @IsOptional()
  @IsString()
  design_files_link?: string;

  @IsOptional()
  @IsString()
  cover_image_file_link?: string;

  @IsOptional()
  @IsString()
  binding_type?: string;

  @IsOptional()
  @IsString()
  dimensions?: string;

  @IsOptional()
  @IsNumber()
  printing_cost?: number;

  @IsOptional()
  @IsInt()
  print_run?: number;

  @IsOptional()
  @IsNumber()
  weight_in_grams?: number;

  @IsOptional()
  @IsInt()
  page_count?: number;

  @IsOptional()
  @IsString()
  printed_by?: string;
}
