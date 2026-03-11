import {
  Column,
  Entity,
  JoinColumn,
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
  @JoinColumn({ name: 'inventory_id' })
  inventory: Relation<Inventory>;

  @Column({ name: 'anthology_id' })
  anthologyId: number;

  @ManyToOne(() => Anthology, (anthology) => anthology.inventoryHoldings)
  @JoinColumn({ name: 'anthology_id' })
  anthology: Relation<Anthology>;

  @Column({ name: 'num_copies' })
  numCopies: number;
}
