import { Inventory } from 'src/inventory/inventory.entity';
import { DeepPartial } from 'typeorm';

export const InventoriesSeed: DeepPartial<Inventory>[] = [
  {
    id: 1,
    name: "O'Bryant Writers' Room",
  },
  {
    id: 2,
    name: 'The Hub (1989 Columbus)',
  },
  {
    id: 3,
    name: 'Archived',
  },
  {
    id: 4,
    name: "Holland Writers' Room Library",
  },
  { id: 5, name: 'Dev/Comms Office (1865 Columbus)' },
];
