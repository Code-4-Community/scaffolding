import dataSource from '../data-source'; // adjust path as needed
import { Task } from '../task/types/task.entity';
import { Label } from '../label/types/label.entity';
import { TaskCategory } from '../task/types/category';

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Initialize the data source
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Clear existing data (drop and recreate schema)
    console.log('🧹 Clearing existing data...');
    await dataSource.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');

    // Recreate tables
    await dataSource.synchronize();
    console.log('✅ Database schema synchronized');

    // Create labels
    console.log('🏷️  Creating labels...');
    const labels = await dataSource.getRepository(Label).save([
      { name: 'High Priority', color: '#FF4444' },
      { name: 'Bug Fix', color: '#FF8800' },
      { name: 'Feature', color: '#00AA00' },
      { name: 'Documentation', color: '#4488FF' },
    ]);
    console.log(`✅ Created ${labels.length} labels`);

    // Create tasks
    console.log('📝 Creating tasks...');
    const tasks = await dataSource.getRepository(Task).save([
      {
        title: 'Complete project proposal',
        description: 'Draft and finalize the Q4 project proposal document',
        dueDate: new Date('2025-08-15'),
        category: TaskCategory.IN_PROGRESS,
      },
      {
        title: 'Review code changes',
        description: 'Review pull requests for the authentication module',
        dueDate: new Date('2025-08-10'),
        category: TaskCategory.TODO,
      },
      {
        title: 'Team meeting preparation',
        description: 'Prepare agenda and materials for weekly team sync',
        dueDate: new Date('2025-08-09'),
        category: TaskCategory.COMPLETED,
      },
      {
        title: 'Update documentation',
        description: 'Update API documentation with recent endpoint changes',
        category: TaskCategory.DRAFT,
      },
    ]);
    console.log(`✅ Created ${tasks.length} tasks`);

    // Optionally assign some labels to tasks
    console.log('🔗 Assigning labels to tasks...');

    // Assign "High Priority" and "Feature" to first task
    tasks[0].labels = [labels[0], labels[2]];
    await dataSource.getRepository(Task).save(tasks[0]);

    // Assign "Bug Fix" to second task
    tasks[1].labels = [labels[1]];
    await dataSource.getRepository(Task).save(tasks[1]);

    // Assign "Documentation" to last task
    tasks[3].labels = [labels[3]];
    await dataSource.getRepository(Task).save(tasks[3]);

    console.log('✅ Labels assigned to tasks');

    console.log('🎉 Database seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    // Close the database connection
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('✅ Database connection closed');
    }
  }
}

// Run the seed function
seed().catch((error) => {
  console.error('❌ Fatal error during seed:', error);
  process.exit(1);
});
