import { IsString, IsHexColor, IsOptional } from 'class-validator';

export class CreateLabelDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsHexColor()
  color: string;
}
