import dataSource from '../data-source';
import { Discipline } from '../disciplines/disciplines.entity';
import { DISCIPLINE_VALUES } from '../disciplines/disciplines.constants';
import { Application } from '../applications/application.entity';
import {
  AppStatus,
  ExperienceType,
  InterestArea,
  School,
  ApplicantType,
  DaysOfTheWeek,
} from '../applications/types';

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Initialize the data source
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Note: We're NOT dropping the schema here since we want to keep migrations
    // Just ensure migrations are run first before seeding

    // Create disciplines
    console.log('📚 Creating disciplines...');
    const disciplines = await dataSource.getRepository(Discipline).save(
      Object.values(DISCIPLINE_VALUES).map((name) => ({
        name,
        admin_ids: [],
      })),
    );
    console.log(`✅ Created ${disciplines.length} disciplines`);

    // Create test applications
    console.log('📝 Creating test applications...');
    const applications = await dataSource.getRepository(Application).save([
      {
        email: 'john.doe@example.com',
        discipline: DISCIPLINE_VALUES.Nursing,
        appStatus: AppStatus.APP_SUBMITTED,
        daysAvailable: [
          DaysOfTheWeek.MONDAY,
          DaysOfTheWeek.WEDNESDAY,
          DaysOfTheWeek.FRIDAY,
        ],
        experienceType: ExperienceType.BS,
        fileUploads: ['resume.pdf', 'transcript.pdf'],
        interest: InterestArea.NURSING,
        license: 'RN-12345',
        phone: '555-123-4567',
        applicantType: ApplicantType.LEARNER,
        school: School.HARVARD_MEDICAL_SCHOOL,
        referred: false,
        weeklyHours: 20,
      },
      {
        email: 'jane.smith@example.com',
        discipline: DISCIPLINE_VALUES.MD,
        appStatus: AppStatus.IN_REVIEW,
        daysAvailable: [DaysOfTheWeek.TUESDAY, DaysOfTheWeek.THURSDAY],
        experienceType: ExperienceType.MD,
        fileUploads: [],
        interest: InterestArea.WOMENS_HEALTH,
        license: 'MD-67890',
        phone: '555-987-6543',
        applicantType: ApplicantType.VOLUNTEER,
        school: School.STANFORD_MEDICINE,
        referred: true,
        referredEmail: 'referrer@example.com',
        weeklyHours: 15,
      },
      {
        email: 'bob.wilson@example.com',
        discipline: DISCIPLINE_VALUES.PublicHealth,
        appStatus: AppStatus.ACCEPTED,
        daysAvailable: [
          DaysOfTheWeek.MONDAY,
          DaysOfTheWeek.TUESDAY,
          DaysOfTheWeek.WEDNESDAY,
          DaysOfTheWeek.THURSDAY,
          DaysOfTheWeek.FRIDAY,
        ],
        experienceType: ExperienceType.MS,
        fileUploads: ['cv.pdf'],
        interest: InterestArea.HARM_REDUCTION,
        license: 'PH-11111',
        phone: '555-555-5555',
        applicantType: ApplicantType.VOLUNTEER,
        school: School.OTHER,
        referred: false,
        weeklyHours: 25,
      },
    ]);
    console.log(`✅ Created ${applications.length} test applications`);

    console.log('🎉 Database seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('✅ Database connection closed');
    }
  }
}

// Run the seed
seed().catch((error) => {
  console.error('❌ Fatal error during seed:', error);
  process.exit(1);
});
