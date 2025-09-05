import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { TaskCategory } from '../types/category';

export class UpdateTaskDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  dueDate?: Date;

  @IsOptional()
  category?: TaskCategory;
}
