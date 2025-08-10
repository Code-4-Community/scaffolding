import { IsArray, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskCategory } from '../types/category';
import { Label } from '../types/task.entity';

export class CreateTaskDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDate()
  dateCreated: Date;

  @IsOptional()
  @IsDate()
  dueDate: Date;

  @IsArray()
  labels: Label[];

  @IsEnum(TaskCategory)
  category: TaskCategory;
}
