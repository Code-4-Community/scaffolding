import { DataSource } from 'typeorm';
import { StoriesSeed } from './stories.seed';
import { Story } from '../story/story.entity';

export async function seedStories(dataSource: DataSource) {
  const repository = dataSource.getRepository(Story);

  console.log('Seeding stories...');

  for (const data of StoriesSeed) {
    const exists = await repository.findOne({
      where: { id: data.id },
    });

    if (!exists) {
      const entity = repository.create(data);
      await repository.save(entity);
      console.log(`  ✓ Created story: ${entity.title}`);
    } else {
      console.log(`  - Story already exists: ${data.title}`);
    }
  }
}