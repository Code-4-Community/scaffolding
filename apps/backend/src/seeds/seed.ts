import { DeepPartial, Repository } from 'typeorm';
import dataSource from '../data-source';
import { Discipline } from '../disciplines/disciplines.entity';
import { DISCIPLINE_VALUES } from '../disciplines/disciplines.constants';
import { Application } from '../applications/application.entity';
import {
  AppStatus,
  ExperienceType,
  InterestArea,
  School,
  DaysOfTheWeek,
  ApplicantType,
} from '../applications/types';
import { LearnerInfo } from '../learner-info/learner-info.entity';
import { VolunteerInfo } from '../volunteer-info/volunteer-info.entity';
import { Applicant } from '../applicants/applicant.entity';

const APPLICANT_SEED = [
  {
    appId: 1,
    firstName: 'Jane',
    lastName: 'Doe',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
  },
  {
    appId: 2,
    firstName: 'John',
    lastName: 'Smith',
    startDate: '2026-01-01',
    endDate: '2026-06-30',
  },
];

const APPLICATION_SEED = [
  {
    email: 'jane.doe@example.com',
    discipline: DISCIPLINE_VALUES.Nursing,
    appStatus: AppStatus.APP_SUBMITTED,
    daysAvailable: [DaysOfTheWeek.MONDAY, DaysOfTheWeek.WEDNESDAY],
    experienceType: ExperienceType.RN,
    fileUploads: [] as string[],
    interest: InterestArea.NURSING,
    license: 'RN-12345',
    phone: '555-123-4567',
    applicantType: ApplicantType.VOLUNTEER,
    school: School.OTHER,
    referred: false,
    weeklyHours: 15,
  },
  {
    email: 'john.smith@example.com',
    discipline: DISCIPLINE_VALUES.MD,
    appStatus: AppStatus.IN_REVIEW,
    daysAvailable: [DaysOfTheWeek.TUESDAY, DaysOfTheWeek.THURSDAY],
    experienceType: ExperienceType.MD,
    fileUploads: [] as string[],
    interest: InterestArea.HARM_REDUCTION,
    license: 'MD-67890',
    phone: '555-234-5678',
    applicantType: ApplicantType.LEARNER,
    school: School.HARVARD_MEDICAL_SCHOOL,
    referred: true,
    referredEmail: 'referrer@example.com',
    weeklyHours: 20,
  },
  {
    email: 'maria.garcia@example.com',
    discipline: DISCIPLINE_VALUES.PublicHealth,
    appStatus: AppStatus.ACCEPTED,
    daysAvailable: [DaysOfTheWeek.FRIDAY],
    experienceType: ExperienceType.MS,
    fileUploads: [] as string[],
    interest: InterestArea.WOMENS_HEALTH,
    license: 'PH-11111',
    phone: '555-345-6789',
    applicantType: ApplicantType.VOLUNTEER,
    school: School.STANFORD_MEDICINE,
    referred: false,
    weeklyHours: 10,
  },
];

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Initialize the data source
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await dataSource.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');

    // Recreate tables
    await dataSource.synchronize();
    console.log('✅ Database schema synchronized');

    // Create disciplines using enum values
    console.log('📚 Creating disciplines...');
    await dataSource.getRepository(Discipline).save(
      Object.values(DISCIPLINE_VALUES).map((name) => ({
        name,
        admin_ids: [],
      })),
    );
    console.log('✅ Disciplines created');

    // Create application test data
    console.log('📋 Creating applications...');
    const applicationRepo: Repository<Application> =
      dataSource.getRepository(Application);
    const applications = await applicationRepo.save(
      APPLICATION_SEED as DeepPartial<Application>[],
    );
    console.log(`✅ Created ${applications.length} applications`);

    // Create learner_info for the learner application (john.smith)
    console.log('📋 Creating learner infos...');
    const learnerApp = applications.find(
      (a) => a.email === 'john.smith@example.com',
    );
    if (learnerApp) {
      await dataSource.getRepository(LearnerInfo).save({
        appId: learnerApp.appId,
        school: School.HARVARD_MEDICAL_SCHOOL,
      });
      console.log('✅ Created learner_info for 1 application');
    }

    // Create volunteer_info for volunteer applications
    console.log('📋 Creating volunteer infos...');
    const volunteerAppIds = applications
      .filter((a) => a.applicantType === ApplicantType.VOLUNTEER)
      .map((a) => a.appId);
    if (volunteerAppIds.length > 0) {
      await dataSource.getRepository(VolunteerInfo).save(
        volunteerAppIds.map((appId) => ({
          appId,
          license: 'Volunteer-License',
        })),
      );
      console.log(
        `✅ Created volunteer_info for ${volunteerAppIds.length} applications`,
      );
    }

    // Create applicant test data
    console.log('📋 Creating applicants...');
    const applicantRepo: Repository<Applicant> =
      dataSource.getRepository(Applicant);
    const applicants = await applicantRepo.save(
      APPLICANT_SEED as DeepPartial<Applicant>[],
    );
    console.log(`✅ Created ${applicants.length} applicants`);

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
