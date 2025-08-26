import { IsString, IsHexColor } from 'class-validator';

export class CreateLabelDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsHexColor()
  color: string;
}
