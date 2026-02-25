import { IsOptional, IsString } from 'class-validator';

export class UpdateApplicationAvailabilityDto {
  @IsOptional()
  @IsString()
  sundayAvailability?: string;

  @IsOptional()
  @IsString()
  mondayAvailability?: string;

  @IsOptional()
  @IsString()
  tuesdayAvailability?: string;

  @IsOptional()
  @IsString()
  wednesdayAvailability?: string;

  @IsOptional()
  @IsString()
  thursdayAvailability?: string;

  @IsOptional()
  @IsString()
  fridayAvailability?: string;

  @IsOptional()
  @IsString()
  saturdayAvailability?: string;
}
