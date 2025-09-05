import { IsString, IsHexColor } from 'class-validator';

export class CreateLabelDTO {
  @IsString()
  name: string;

  @IsHexColor()
  color: string;
}
