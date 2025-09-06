import { IsDate, IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { TaskCategory } from '../types/category';

export class CreateTaskDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  dueDate: Date;

  @IsEnum(TaskCategory)
  category: TaskCategory;
}
