import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { InventoryHolding } from '../inventory-holding/inventory-holding.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => InventoryHolding, (holding) => holding.inventory)
  holdings: InventoryHolding[];
}
