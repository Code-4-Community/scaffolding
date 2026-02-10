import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Anthology } from '../anthology/anthology.entity';
import { Inventory } from '../inventory/inventory.entity';

@Entity()
export class InventoryHolding {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Anthology, (anthology) => anthology.holdings)
  anthology: Anthology;

  @ManyToOne(() => Inventory, (inventory) => inventory.holdings)
  inventory: Inventory;

  @Column()
  num_copies: number;
}
