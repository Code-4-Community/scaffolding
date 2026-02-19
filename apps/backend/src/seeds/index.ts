import AppDataSource from 'src/data-source';
import { seedStories } from './seed-stories';
import { seedAnthologies } from './seed-anthologies';

async function runSeeds() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('Database connection established.');

    console.log('Starting seed process...');

    await seedAnthologies(AppDataSource);
    console.log('Anthologies seeded successfully.');

    // await seedAuthors();
    // console.log('Authors seeded successfully.');

    await seedStories(AppDataSource);
    console.log('Stories seeded successfully.');

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed.');
    }
  }
}

runSeeds();
