import { IsString, IsHexColor } from 'class-validator';

export class CreateLabelDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsHexColor()
  color: string;
}
