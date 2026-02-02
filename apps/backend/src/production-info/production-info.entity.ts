import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Anthology } from '../anthology/anthology.entity';

@Entity()
export class ProductionInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'anthology_id' })
  anthologyId: number;

  @OneToOne(() => Anthology, (anthology) => anthology.productionInfo)
  @JoinColumn({ name: 'anthology_id' })
  anthology: Anthology;

  @Column({ nullable: true })
  design_files_link: string;

  @Column({ nullable: true })
  cover_image_file_link: string;

  @Column({ nullable: true })
  binding_type: string;

  @Column({ nullable: true })
  dimensions: string;

  @Column('float', { nullable: true })
  printing_cost: number;

  @Column('int', { nullable: true })
  print_run: number;

  @Column('float', { nullable: true })
  weight_in_grams: number;

  @Column('int', { nullable: true })
  page_count: number;

  @Column({ nullable: true })
  printed_by: string;
}
