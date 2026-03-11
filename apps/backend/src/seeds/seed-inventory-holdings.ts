import { InventoryHolding } from 'src/inventory-holding/inventory-holding.entity';
import { DataSource } from 'typeorm';
import { InventoryHoldingsSeed } from './inventoryHoldings.seed';

export async function seedInventoryHoldings(dataSource: DataSource) {
  const repository = dataSource.getRepository(InventoryHolding);

  console.log('Seeding inventory holdings...');

  for (const data of InventoryHoldingsSeed) {
    const exists = await repository.findOne({
      where: {
        inventoryId: data.inventoryId,
        anthologyId: data.anthologyId,
      },
    });

    if (!exists) {
      const entity = repository.create(data);
      await repository.save(entity);
      console.log(`  ✓ Created inventory-holding`);
    } else {
      console.log(`  - Inventory-hodling already exists`);
    }
  }
}
