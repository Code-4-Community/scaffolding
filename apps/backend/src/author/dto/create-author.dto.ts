import { IsString, IsInt, IsOptional, MinLength } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsInt()
  grade?: number;
}
