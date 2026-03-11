import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { InventoryHolding } from '../inventory-holding/inventory-holding.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => InventoryHolding, (holding) => holding.inventory)
  holdings: Relation<InventoryHolding[]>;
}
