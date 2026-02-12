import { IsNumber, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OmchaiRole } from '../omchai.entity';

export class CreateOmchaiDto {
  @ApiProperty({ description: 'ID of the anthology' })
  @IsNumber()
  anthology_id: number;

  @ApiProperty({ description: 'ID of the user' })
  @IsNumber()
  user_id: number;

  @ApiProperty({ 
    description: 'Role of the user in the project',
    enum: OmchaiRole,
  })
  @IsEnum(OmchaiRole)
  role: OmchaiRole;

  @ApiProperty({ description: 'Date that the user was assigned' })
  @IsDateString()
  datetime_assigned: Date;
}