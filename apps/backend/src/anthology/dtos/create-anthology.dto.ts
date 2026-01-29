import { IsString, IsInt, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AnthologyStatus, AnthologyPubLevel } from '../types';

export class CreateAnthologyDto {
  @ApiProperty({ description: 'Title of the anthology' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the anthology' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Year the anthology was published' })
  @IsInt()
  published_year: number;

  @ApiProperty({
    description: 'Status of the anthology',
    enum: AnthologyStatus,
    example: AnthologyStatus.DRAFTING,
  })
  @IsEnum(AnthologyStatus)
  status: AnthologyStatus;

  @ApiProperty({
    description: 'Publication level of the anthology',
    enum: AnthologyPubLevel,
    example: AnthologyPubLevel.ZINE,
  })
  @IsEnum(AnthologyPubLevel)
  pub_level: AnthologyPubLevel;

  @ApiPropertyOptional({
    description: 'Programs associated with the anthology',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  programs?: string[];

  @ApiProperty({ description: 'URL to anthology photo' })
  @IsString()
  photo_url: string;

  @ApiProperty({ description: 'ISBN of the anthology' })
  @IsString()
  isbn: string;

  @ApiProperty({ description: 'Shopify URL for purchasing' })
  @IsString()
  shopify_url: string;
}
