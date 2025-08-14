import { IsDate, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTaskDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  dueDate: Date;
}
