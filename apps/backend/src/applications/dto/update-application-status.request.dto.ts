import { IsEnum } from 'class-validator';
import { AppStatus } from '../types';

export class UpdateApplicationStatusDto {
  @IsEnum(AppStatus, {
    message: `Status must be one of: ${Object.values(AppStatus).join(', ')}`,
  })
  appStatus: AppStatus;
}
