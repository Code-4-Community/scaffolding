import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InventoryHolding {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  anthologyId: number;

  @Column({ type: 'int' })
  inventoryId: number;

  @Column()
  num_copies: number;
}
