import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

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
}
