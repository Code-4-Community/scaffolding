import {
  Entity,
  Column,
  IntegerType,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { AnthologyStatus, AnthologyPubLevel } from './types';

import { Story } from '../story/story.entity';
import { InventoryHolding } from '../inventory-holding/inventory-holding.entity';

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

  @Column('text', { nullable: true })
  programs?: string[];

  @Column()
  status: AnthologyStatus;

  @Column()
  pub_level: AnthologyPubLevel;

  @Column({ nullable: true })
  photo_url: string;

  @Column({ nullable: true })
  isbn: string;

  @Column({ nullable: true })
  shopify_url: string;

  @OneToMany(() => Story, (story) => story.anthology)
  stories: Story[];

  @OneToMany(() => InventoryHolding, (ih) => ih.anthology)
  holdings: InventoryHolding[];
}
