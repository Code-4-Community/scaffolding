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
        discipline: DISCIPLINE_VALUES.RN,
        appStatus: AppStatus.APP_SUBMITTED,
        mondayAvailability: '9am-5pm',
        tuesdayAvailability: 'Not available',
        wednesdayAvailability: '9am-5pm',
        thursdayAvailability: 'Not available',
        fridayAvailability: '9am-5pm',
        saturdayAvailability: 'Not available',
        experienceType: ExperienceType.BS,
        resume: 'john_doe_resume.pdf',
        coverLetter: 'john_doe_cover_letter.pdf',
        interest: InterestArea.PRIMARY_CARE,
        license: 'RN-12345',
        phone: '555-123-4567',
        applicantType: ApplicantType.LEARNER,
        school: School.HARVARD_MEDICAL_SCHOOL,
        referred: false,
        weeklyHours: 20,
        pronouns: 'he/him',
        desiredExperience: 'I want to gain clinical experience in primary care settings',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '555-123-4568',
        emergencyContactRelationship: 'Spouse',
      },
      {
        email: 'jane.smith@example.com',
        discipline: DISCIPLINE_VALUES.MD_MedicalStudent_PreMed,
        appStatus: AppStatus.IN_REVIEW,
        mondayAvailability: 'Not available',
        tuesdayAvailability: '10am-2pm',
        wednesdayAvailability: 'Not available',
        thursdayAvailability: '10am-2pm',
        fridayAvailability: 'Not available',
        saturdayAvailability: 'Not available',
        experienceType: ExperienceType.MD,
        resume: 'jane_smith_resume.pdf',
        coverLetter: 'jane_smith_cover_letter.pdf',
        interest: InterestArea.WOMENS_HEALTH,
        license: 'MD-67890',
        phone: '555-987-6543',
        applicantType: ApplicantType.VOLUNTEER,
        school: School.STANFORD_MEDICINE,
        referred: true,
        referredEmail: 'referrer@example.com',
        weeklyHours: 15,
        pronouns: 'she/her',
        desiredExperience: 'I want to provide healthcare services to underserved women',
        emergencyContactName: 'John Smith',
        emergencyContactPhone: '555-987-6544',
        emergencyContactRelationship: 'Partner',
      },
      {
        email: 'bob.wilson@example.com',
        discipline: DISCIPLINE_VALUES.PublicHealth,
        appStatus: AppStatus.ACCEPTED,
        mondayAvailability: '8am-6pm',
        tuesdayAvailability: '8am-6pm',
        wednesdayAvailability: '8am-6pm',
        thursdayAvailability: '8am-6pm',
        fridayAvailability: '8am-6pm',
        saturdayAvailability: 'Not available',
        experienceType: ExperienceType.MS,
        resume: 'bob_wilson_resume.pdf',
        coverLetter: 'bob_wilson_cover_letter.pdf',
        interest: InterestArea.ADDICTION_MEDICINE,
        license: 'PH-11111',
        phone: '555-555-5555',
        applicantType: ApplicantType.VOLUNTEER,
        school: School.OTHER,
        otherSchool: 'Boston University',
        referred: false,
        weeklyHours: 25,
        pronouns: 'they/them',
        desiredExperience: 'I want to work in harm reduction and addiction medicine',
        emergencyContactName: 'Alice Wilson',
        emergencyContactPhone: '555-555-5556',
        emergencyContactRelationship: 'Sibling',
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
