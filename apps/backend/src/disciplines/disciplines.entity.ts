import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DISCIPLINE_VALUES } from './disciplines.constants';

/**
 * Represents the desired columns for the database table
 * in the repository for the system's medical disciplines
 * (BHCHP medical discipline) and their admin emails.
 *
 * e.g.: Volunteers, Nursing, Public Health, MD, PA, NP,.
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
   * emails of admins in charge of reviewing the discipline,
   * in no particular order.
   *
   * E.g. [nie.sa@northeastern.edu, nie.sa2@northeastern.edu]
   */
  @Column({ type: 'varchar', array: true, default: [] })
  admin_emails: string[];
}
