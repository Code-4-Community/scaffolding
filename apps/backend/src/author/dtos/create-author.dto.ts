import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateAuthorDto {
  @ApiProperty({ description: 'Name of author' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Bio of author' })
  @IsString()
  bio: string;

  @ApiProperty({ description: 'Grade of author' })
  @IsNumber()
  grade: number;
}
