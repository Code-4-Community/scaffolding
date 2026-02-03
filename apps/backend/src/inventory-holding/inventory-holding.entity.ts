import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InventoryHolding {
  @PrimaryGeneratedColumn()
  id: number;

  anthology_id: number;

  inventory_id: number;

  @Column()
  num_copies: number;
}
