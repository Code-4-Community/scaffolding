import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { InventoryHolding } from '../inventory-holding/inventory-holding.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => InventoryHolding, (ih) => ih.inventory)
  holdings: InventoryHolding[];
}
