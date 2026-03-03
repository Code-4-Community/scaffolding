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
  ApplicantType,
} from '../applications/types';
import { LearnerInfo } from '../learner-info/learner-info.entity';
import { VolunteerInfo } from '../volunteer-info/volunteer-info.entity';
import { Applicant } from '../candidate-info/candidate-info.entity';

const APPLICANT_SEED = [
  {
    appId: 1,
    firstName: 'Jane',
    lastName: 'Doe',
  },
  {
    appId: 2,
    firstName: 'John',
    lastName: 'Smith',
  },
];

const APPLICATION_SEED = [
  {
    appId: 1,
    appStatus: AppStatus.APP_SUBMITTED,
    mondayAvailability: '12pm and on every other week',
    tuesdayAvailability: 'approximately 10am-3pm',
    wednesdayAvailability: 'no availability',
    thursdayAvailability: 'maybe before 10am',
    fridayAvailability: 'Sometime between 4-6',
    saturdayAvailability: 'no availability',
    experienceType: ExperienceType.BS,
    interest: [InterestArea.MEDICAL_RESPITE_INPATIENT],
    license: 'n/a',
    applicantType: ApplicantType.LEARNER,
    phone: '123-456-7890',
    school: School.HARVARD_MEDICAL_SCHOOL,
    email: 'test@example.com',
    discipline: DISCIPLINE_VALUES.RN,
    referred: false,
    weeklyHours: 20,
    pronouns: 'she/her',
    nonEnglishLangs: 'spoken chinese only',
    desiredExperience:
      'I want to give back to the boston community and learn to talk better with patients',
    resume: 'janedoe_resume_2_6_2026.pdf',
    coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '111-111-1111',
    emergencyContactRelationship: 'Mother',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30'),
  },
  {
    appId: 2,
    appStatus: AppStatus.APP_SUBMITTED,
    mondayAvailability: '12pm and on every other week',
    tuesdayAvailability: 'approximately 10am-3pm',
    wednesdayAvailability: 'no availability',
    thursdayAvailability: 'maybe before 10am',
    fridayAvailability: 'Sometime between 4-6',
    saturdayAvailability: 'no availability',
    experienceType: ExperienceType.BS,
    interest: [InterestArea.MEDICAL_RESPITE_INPATIENT],
    license: 'n/a',
    applicantType: ApplicantType.LEARNER,
    phone: '123-456-7890',
    school: School.HARVARD_MEDICAL_SCHOOL,
    email: 'test@example.com',
    discipline: DISCIPLINE_VALUES.RN,
    referred: false,
    weeklyHours: 20,
    pronouns: 'she/her',
    nonEnglishLangs: 'spoken chinese only',
    desiredExperience:
      'I want to give back to the boston community and learn to talk better with patients',
    resume: 'janedoe_resume_2_6_2026.pdf',
    coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '111-111-1111',
    emergencyContactRelationship: 'Mother',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-06-30'),
  },
  {
    appId: 3,
    appStatus: AppStatus.APP_SUBMITTED,
    mondayAvailability: '12pm and on every other week',
    tuesdayAvailability: 'approximately 10am-3pm',
    wednesdayAvailability: 'no availability',
    thursdayAvailability: 'maybe before 10am',
    fridayAvailability: 'Sometime between 4-6',
    saturdayAvailability: 'no availability',
    experienceType: ExperienceType.BS,
    interest: [InterestArea.MEDICAL_RESPITE_INPATIENT],
    license: 'n/a',
    applicantType: ApplicantType.LEARNER,
    phone: '123-456-7890',
    school: School.HARVARD_MEDICAL_SCHOOL,
    email: 'test@example.com',
    discipline: DISCIPLINE_VALUES.RN,
    referred: false,
    weeklyHours: 20,
    pronouns: 'she/her',
    nonEnglishLangs: 'spoken chinese only',
    desiredExperience:
      'I want to give back to the boston community and learn to talk better with patients',
    resume: 'janedoe_resume_2_6_2026.pdf',
    coverLetter: 'janedoe_coverLetter_2_6_2026.pdf',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '111-111-1111',
    emergencyContactRelationship: 'Mother',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30'),
  },
];

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

    // TODO: UNcomment after the migration shape is updated.
    // Create test applications
    // console.log('📝 Creating test applications...');
    // const applications = await dataSource.getRepository(Application).save([
    //   {
    //     email: 'john.doe@example.com',
    //     discipline: DISCIPLINE_VALUES.RN,
    //     appStatus: AppStatus.APP_SUBMITTED,
    //     mondayAvailability: '9am-5pm',
    //     tuesdayAvailability: 'Not available',
    //     wednesdayAvailability: '9am-5pm',
    //     thursdayAvailability: 'Not available',
    //     fridayAvailability: '9am-5pm',
    //     saturdayAvailability: 'Not available',
    //     experienceType: ExperienceType.BS,
    //     resume: 'john_doe_resume.pdf',
    //     coverLetter: 'john_doe_cover_letter.pdf',
    //     interest: InterestArea.PRIMARY_CARE,
    //     license: 'RN-12345',
    //     phone: '555-123-4567',
    //     applicantType: ApplicantType.LEARNER,
    //     school: School.HARVARD_MEDICAL_SCHOOL,
    //     referred: false,
    //     weeklyHours: 20,
    //     pronouns: 'he/him',
    //     desiredExperience: 'I want to gain clinical experience in primary care settings',
    //     emergencyContactName: 'Jane Doe',
    //     emergencyContactPhone: '555-123-4568',
    //     emergencyContactRelationship: 'Spouse',
    //   },
    //   {
    //     email: 'jane.smith@example.com',
    //     discipline: DISCIPLINE_VALUES.MD_MedicalStudent_PreMed,
    //     appStatus: AppStatus.IN_REVIEW,
    //     mondayAvailability: 'Not available',
    //     tuesdayAvailability: '10am-2pm',
    //     wednesdayAvailability: 'Not available',
    //     thursdayAvailability: '10am-2pm',
    //     fridayAvailability: 'Not available',
    //     saturdayAvailability: 'Not available',
    //     experienceType: ExperienceType.MD,
    //     resume: 'jane_smith_resume.pdf',
    //     coverLetter: 'jane_smith_cover_letter.pdf',
    //     interest: InterestArea.MEDICAL_RESPITE_INPATIENT,
    //     license: 'MD-67890',
    //     phone: '555-987-6543',
    //     applicantType: ApplicantType.VOLUNTEER,
    //     school: School.STANFORD_MEDICINE,
    //     referred: true,
    //     referredEmail: 'referrer@example.com',
    //     weeklyHours: 15,
    //     pronouns: 'she/her',
    //     desiredExperience: 'I want to provide healthcare services to underserved women',
    //     emergencyContactName: 'John Smith',
    //     emergencyContactPhone: '555-987-6544',
    //     emergencyContactRelationship: 'Partner',
    //   },
    //   {
    //     email: 'bob.wilson@example.com',
    //     discipline: DISCIPLINE_VALUES.PublicHealth,
    //     appStatus: AppStatus.ACCEPTED,
    //     mondayAvailability: '8am-6pm',
    //     tuesdayAvailability: '8am-6pm',
    //     wednesdayAvailability: '8am-6pm',
    //     thursdayAvailability: '8am-6pm',
    //     fridayAvailability: '8am-6pm',
    //     saturdayAvailability: 'Not available',
    //     experienceType: ExperienceType.MS,
    //     resume: 'bob_wilson_resume.pdf',
    //     coverLetter: 'bob_wilson_cover_letter.pdf',
    //     interest: InterestArea.ADDICTION_MEDICINE,
    //     license: 'PH-11111',
    //     phone: '555-555-5555',
    //     applicantType: ApplicantType.VOLUNTEER,
    //     school: School.OTHER,
    //     otherSchool: 'Boston University',
    //     referred: false,
    //     weeklyHours: 25,
    //     pronouns: 'they/them',
    //     desiredExperience: 'I want to work in harm reduction and addiction medicine',
    //     emergencyContactName: 'Alice Wilson',
    //     emergencyContactPhone: '555-555-5556',
    //     emergencyContactRelationship: 'Sibling',
    //   },
    // ]);
    // console.log(`✅ Created ${applications.length} test applications`);

    // console.log('🎉 Database seed completed successfully!');
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
