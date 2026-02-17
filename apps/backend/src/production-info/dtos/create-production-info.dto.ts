import { IsString, IsNumber, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductionInfoDto {
  @ApiProperty({ description: 'Anthology ID' })
  @IsInt()
  anthology_id: number;

  @ApiPropertyOptional({ description: 'Link to design files' })
  @IsOptional()
  @IsString()
  design_files_link?: string;

  @ApiPropertyOptional({ description: 'Link to cover image file' })
  @IsOptional()
  @IsString()
  cover_image_file_link?: string;

  @ApiPropertyOptional({ description: 'Binding type' })
  @IsOptional()
  @IsString()
  binding_type?: string;

  @ApiPropertyOptional({ description: 'Dimensions' })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional({ description: 'Printing cost' })
  @IsOptional()
  @IsNumber()
  printing_cost?: number;

  @ApiPropertyOptional({ description: 'Print run count' })
  @IsOptional()
  @IsInt()
  print_run?: number;

  @ApiPropertyOptional({ description: 'Weight in grams' })
  @IsOptional()
  @IsNumber()
  weight_in_grams?: number;

  @ApiPropertyOptional({ description: 'Page count' })
  @IsOptional()
  @IsInt()
  page_count?: number;

  @ApiPropertyOptional({ description: 'Printed by' })
  @IsOptional()
  @IsString()
  printed_by?: string;
}
