import { IsEnum } from 'class-validator';
import { InterestArea } from '../types';

export class UpdateApplicationInterestDto {
  @IsEnum(InterestArea, {
    message: `Interest must be one of: ${Object.values(InterestArea).join(
      ', ',
    )}`,
  })
  interest: InterestArea;
}
