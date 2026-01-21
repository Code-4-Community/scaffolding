import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DISCIPLINE_VALUES } from './disciplines.constants';

/**
 * Represents the desired columns for the database table
 * in the repository for the system's medical disciplines
 * (BHCHP medical discipline) and their admin Ids.
 *
 * e.g.: Volunteers, Nursing, Public Health, MD, PA, NP,
 * Research, Social work, Psychiatry, Pharmacy, IT.
 */
@Entity('discipline')
export class Discipline {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Predefined discipline values present in the table.
   *
   * e.g.: Volunteers, Nursing, Public Health, MD, PA, NP,
   * Research, Social work, Psychiatry, Pharmacy, IT.
   */
  @Column({
    type: 'enum',
    enum: DISCIPLINE_VALUES,
    nullable: false,
  })
  name: DISCIPLINE_VALUES;

  /**
   * Ids of admins in charge of reviewing the discipline,
   * in no particular order.
   *
   * E.g. [4, 1]
   */
  @Column({ type: 'int', array: true, default: () => "'{}'" })
  admin_ids: number[];
}
