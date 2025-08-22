import { IsArray, IsNumber, ArrayNotEmpty } from 'class-validator';

export class UpdateLabelsDTO {
  @IsNumber()
  taskId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  labelIds: number[];
}
