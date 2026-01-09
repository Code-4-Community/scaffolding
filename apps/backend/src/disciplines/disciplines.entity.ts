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

  // TODO: Clarify what this is
  @Column({ type: 'int', array: true, default: () => "'{}'" })
  admin_ids: number[];
}
