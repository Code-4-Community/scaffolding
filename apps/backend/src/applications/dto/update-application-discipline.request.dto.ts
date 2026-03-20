import { IsDefined, IsEnum } from 'class-validator';
import { DISCIPLINE_VALUES } from '../../disciplines/disciplines.constants';

/**
 * Defines the expected shape of data for updating an application's discipline.
 *
 * DTO - data transfer object (defines and validates the structure of data sent over the network).
 */
export class UpdateApplicationDisciplineDto {
  /**
   * Application's new discipline.
   *
   * Example: DISCIPLINE_VALUES.Nursing.
   */
  @IsEnum(DISCIPLINE_VALUES, {
    message: `Discipline must be one of: ${Object.values(
      DISCIPLINE_VALUES,
    ).join(', ')}`,
  })
  @IsDefined()
  discipline: DISCIPLINE_VALUES;
}
