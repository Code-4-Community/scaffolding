import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { AnthologyStatus, AnthologyPubLevel } from './types';
@Entity()
export class Anthology {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'int' })
  published_year: number;

  @Column('simple-array', { nullable: true })
  programs?: string[];

  @Column({
    type: 'enum',
    enum: AnthologyStatus,
  })
  status: AnthologyStatus;

  @Column({
    type: 'enum',
    enum: AnthologyPubLevel,
  })
  pub_level: AnthologyPubLevel;

  @Column({ nullable: true })
  photo_url: string;

  @Column({ nullable: true })
  isbn: string;

  @Column({ nullable: true })
  shopify_url: string;
}
