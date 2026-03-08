import { time } from 'console';
import { InventoryHolding } from 'src/inventory-holding/inventory-holding.entity';
import { Omchai, OmchaiRole } from 'src/omchai/omchai.entity';
import { DeepPartial } from 'typeorm';

export const OmchaiSeed: DeepPartial<Omchai>[] = [
  {
    id: 1,
    anthologyId: 1,
    userId: 1,
    role: OmchaiRole.OWNER,
    datetimeAssigned: new Date(),
  },
  {
    id: 2,
    anthologyId: 1,
    userId: 2,
    role: OmchaiRole.MANAGER,
    datetimeAssigned: new Date(),
  },

  {
    id: 3,
    anthologyId: 1,
    userId: 3,
    role: OmchaiRole.CONSULTED,
    datetimeAssigned: new Date(),
  },
  {
    id: 4,
    anthologyId: 1,
    userId: 3,
    role: OmchaiRole.HELPER,
    datetimeAssigned: new Date(),
  },
  {
    id: 5,
    anthologyId: 1,
    userId: 4,
    role: OmchaiRole.APPROVER,
    datetimeAssigned: new Date(),
  },
  {
    id: 5,
    anthologyId: 1,
    userId: 6,
    role: OmchaiRole.INFORMED,
    datetimeAssigned: new Date(),
  },
];
