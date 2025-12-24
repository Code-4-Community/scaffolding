import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DISCIPLINE_VALUES } from '../disciplines/discplines.constants';

/**
 * Represents the desired columns for the database table
 * in the repository for the system's medical disciplines
 * (BHCHP medical discipline) and their admin ids
 *
 * e.g.: Volunteers, Nursing, Public Health, MD, PA, NP,
 * Research, Social work, Psychiatry, Pharmacy, IT
 */
@Entity('discipline')
export class Discipline {
  @PrimaryGeneratedColumn()
  id: number;

  // enforce discipline names to be one of the predefined values
  @Column({
    type: 'enum',
    enum: DISCIPLINE_VALUES,
    nullable: false,
  })
  name: DISCIPLINE_VALUES;

  @Column({ type: 'int', array: true, default: () => "'{}'" })
  admin_ids: number[];
}
