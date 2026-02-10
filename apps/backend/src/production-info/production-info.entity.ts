import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductionInfo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', unique: true })
  anthologyId!: number;

  @Column({ nullable: true })
  design_files_link?: string;

  @Column({ nullable: true })
  cover_image_file_link?: string;

  @Column({ nullable: true })
  binding_type?: string;

  @Column({ nullable: true })
  dimensions?: string;

  @Column('float', { nullable: true })
  printing_cost?: number;

  @Column('int', { nullable: true })
  print_run?: number;

  @Column('float', { nullable: true })
  weight_in_grams?: number;

  @Column('int', { nullable: true })
  page_count?: number;

  @Column({ nullable: true })
  printed_by?: string;
}
