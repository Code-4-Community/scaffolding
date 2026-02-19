import {
  Entity,
  Column,
  IntegerType,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import { AnthologyStatus, AnthologyPubLevel } from './types';

import { Story } from '../story/story.entity';
import { InventoryHolding } from '../inventory-holding/inventory-holding.entity';
import { ProductionInfo } from '../production-info/production-info.entity';

@Entity()
export class Anthology {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ name: 'published_date', type: 'date' })
  publishedDate: Date;

  @Column({ type: 'simple-array', nullable: true })
  programs?: string[];

  @Column({ type: 'enum', enum: AnthologyStatus })
  status: AnthologyStatus;

  @Column({ name: 'pub_level', type: 'enum', enum: AnthologyPubLevel })
  pubLevel: AnthologyPubLevel;

  @Column({ name: 'photo_url', nullable: true })
  photoUrl: string;

  @Column({ nullable: true })
  isbn: string;

  @Column({ name: 'shopify_url', nullable: true })
  shopifyUrl: string;

  @OneToMany(() => Story, (story) => story.anthologyId)
  stories: Story[];

  @OneToMany(() => InventoryHolding, (ih) => ih.anthology_id)
  holdings: InventoryHolding[];

  @OneToOne(
    () => ProductionInfo,
    (productionInfo) => productionInfo.anthology_id,
  )
  productionInfo: ProductionInfo;
}
