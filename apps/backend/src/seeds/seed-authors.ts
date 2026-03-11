import { Author } from 'src/author/author.entity';
import { DataSource } from 'typeorm';
import { AuthorsSeed } from './authors.seed';

export async function seedAuthors(dataSource: DataSource) {
  const repository = dataSource.getRepository(Author);

  console.log('Seeding authors..');

  for (const data of AuthorsSeed) {
    const exists = await repository.findOne({ where: { name: data.name } });

    if (!exists) {
      const entity = repository.create(data);
      await repository.save(entity);
      console.log(`  ✓ Created author: ${entity.name}`);
    } else {
      console.log(`  - Author already exists: ${data.name}`);
    }
  }
}
