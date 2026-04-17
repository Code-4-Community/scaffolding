import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
  IsObject,
} from 'class-validator';
import { AnthologyPubLevel } from '../types';
import { User } from '../../users/user.entity'; // Update the path based on your project structure

export class CreateNewPublicationDto {
  @ApiProperty({ description: 'Title of the anthology' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the anthology' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Publication level of the anthology',
    enum: AnthologyPubLevel,
    example: AnthologyPubLevel.ZINE,
  })
  @IsEnum(AnthologyPubLevel)
  publicationLevel: AnthologyPubLevel;

  @ApiProperty({ description: 'Genre of the anthology' })
  @IsArray()
  @IsString({ each: true })
  genre?: string[];

  @ApiProperty({ description: 'Theme of the anthology' })
  @IsArray()
  @IsString({ each: true })
  theme?: string[];

  @ApiProperty({ description: 'Projected publication date of the anthology' })
  @IsString()
  publicationDate?: Date;

  @ApiProperty({ description: 'Owners of the anthology' })
  @IsArray()
  @IsObject({ each: true })
  owners: User[];

  @ApiProperty({ description: 'Managers of the anthology' })
  @IsArray()
  @IsObject({ each: true })
  managers: User[];

  @ApiProperty({ description: 'Consulted users for the anthology' })
  @IsArray()
  @IsObject({ each: true })
  consulted: User[];

  @ApiProperty({ description: 'Helper users for the anthology' })
  @IsArray()
  @IsObject({ each: true })
  helpers: User[];

  @ApiProperty({ description: 'Approver users for the anthology' })
  @IsArray()
  @IsObject({ each: true })
  approvers: User[];

  @ApiProperty({ description: 'Informer users for the anthology' })
  @IsArray()
  @IsObject({ each: true })
  informers: User[];
}
