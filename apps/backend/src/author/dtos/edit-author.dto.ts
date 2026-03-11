import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EditAuthorDto {
  @ApiProperty({ description: 'Name of author' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Bio of author' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ description: 'Grade of author' })
  @IsNumber()
  @IsOptional()
  grade?: number;
}
