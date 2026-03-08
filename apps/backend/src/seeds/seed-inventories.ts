import { Inventory } from 'src/inventory/inventory.entity';
import { DataSource } from 'typeorm';
import { InventoriesSeed } from './inventories.seed';

export async function seedInventories(dataSource: DataSource) {
  const repository = dataSource.getRepository(Inventory);

  console.log('Seeding inventories...');

  for (const data of InventoriesSeed) {
    const exists = await repository.findOne({ where: { name: data.name } });

    if (!exists) {
      const entity = repository.create(data);
      await repository.save(entity);
      console.log(`  ✓ Created inventory: ${entity.name}`);
    } else {
      console.log(`  - Inventory already exists: ${data.name}`);
    }
  }
}
