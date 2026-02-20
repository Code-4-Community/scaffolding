import { DataSource } from 'typeorm';

import { Anthology } from 'src/anthology/anthology.entity';
import { AnthologiesSeed } from './anthologies.seed';

export async function seedAnthologies(dataSource: DataSource) {
  const repository = dataSource.getRepository(Anthology);

  console.log('Seeding anthologies...');

  for (const data of AnthologiesSeed) {
    const exists = await repository.findOne({ where: { title: data.title } });

    if (!exists) {
      const entity = repository.create(data);
      await repository.save(entity);
      console.log(`  ✓ Created anthology: ${entity.title}`);
    } else {
      console.log(`  - Anthology already exists: ${data.title}`);
    }
  }
}
