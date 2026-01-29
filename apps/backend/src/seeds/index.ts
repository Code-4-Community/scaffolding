import 'reflect-metadata';
import { seedStories } from './seed-stories';
import dataSource from '../data-source'; // Your TypeORM config

async function runSeeds() {
  try {
    console.log('Initializing database connection...');
    await dataSource.initialize();
    console.log('✓ Database connected\n');

    // Run seeds in order (important if there are dependencies)
    await seedStories(dataSource);

    console.log('\n✓ All seeds completed successfully');
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

runSeeds();
