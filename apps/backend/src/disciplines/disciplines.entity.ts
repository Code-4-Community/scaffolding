import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DISCIPLINE_VALUES } from './disciplines.constants';

// describes a BHCHP medical discipline
// Current list of disciplines: Volunteers, Nursing, Public Health, MD, PA, NP,
// Research, Social work, Psychiatry, Pharmacy, IT
@Entity('discipline')
export class Discipline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: DISCIPLINE_VALUES,
    nullable: false,
  })
  name: DISCIPLINE_VALUES;

  @Column({ type: 'int', array: true, default: () => "'{}'" })
  admin_ids: number[];
}
