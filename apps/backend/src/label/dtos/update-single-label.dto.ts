import { IsString, IsHexColor, IsOptional } from 'class-validator';

export class UpdateSingleLabelDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsHexColor()
  @IsOptional()
  color: string;
}
