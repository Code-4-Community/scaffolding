import { DataSource } from 'typeorm';
import { Anthology } from 'src/anthology/anthology.entity';
import { ProductionInfo } from 'src/production-info/production-info.entity';
import { AnthologiesSeed } from './anthologies.seed';

export async function seedAnthologies(dataSource: DataSource) {
  const anthologyRepo = dataSource.getRepository(Anthology);
  const piRepo = dataSource.getRepository(ProductionInfo);

  console.log('Seeding anthologies...');

  for (const { productionInfo: piData, ...data } of AnthologiesSeed) {
    const exists = await anthologyRepo.findOne({
      where: { title: data.title },
    });

    if (!exists) {
      const pi = piRepo.create(piData);
      const savedPi = await piRepo.save(pi);

      const entity = anthologyRepo.create({ ...data, productionInfo: savedPi });
      const savedAnthology = await anthologyRepo.save(entity);

      savedPi.anthology = savedAnthology;
      await piRepo.save(savedPi);

      console.log(`  ✓ Created anthology: ${savedAnthology.title}`);
    } else {
      console.log(`  - Anthology already exists: ${data.title}`);
    }
  }
}
