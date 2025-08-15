import { Transform } from 'class-transformer';

export class UpdateTaskDTO {
  title?: string;

  description?: string;

  @Transform(({ value }) => new Date(value))
  dueDate?: Date;
}
