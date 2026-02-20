import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Anthology } from '../anthology/anthology.entity';
import { Inventory } from '../inventory/inventory.entity';

@Entity()
export class InventoryHolding {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'inventory_id' })
  inventoryId: number;

  @ManyToOne(() => Inventory, (inventory) => inventory.holdings)
  inventory: Relation<Inventory>;

  @Column({ name: 'anthology_id' })
  anthologyId: number;

  @ManyToOne(() => Anthology, (anthology) => anthology.inventoryHoldings)
  anthology: Relation<Anthology>;

  @Column({ name: 'num_copies' })
  numCopies: number;
}
