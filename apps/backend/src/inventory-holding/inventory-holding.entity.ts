import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Anthology } from '../anthology/anthology.entity';
import { Inventory } from '../inventory/inventory.entity';

@Entity()
export class InventoryHolding {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  inventory_id: number;

  @Column()
  anthology_id: number;

  @Column()
  num_copies: number;
}
