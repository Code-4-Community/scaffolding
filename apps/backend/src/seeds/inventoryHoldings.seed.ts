import { InventoryHolding } from 'src/inventory-holding/inventory-holding.entity';
import { DeepPartial } from 'typeorm';

export const InventoryHoldingsSeed: DeepPartial<InventoryHolding>[] = [
  {
    id: 1,
    anthologyId: 3,
    inventoryId: 5,
    numCopies: 76,
  },
  {
    id: 2,
    anthologyId: 3,
    inventoryId: 2,
    numCopies: 400,
  },
  {
    id: 3,
    anthologyId: 3,
    inventoryId: 3,
    numCopies: 3,
  },
  {
    id: 4,
    anthologyId: 3,
    inventoryId: 4,
    numCopies: 2,
  },
];
