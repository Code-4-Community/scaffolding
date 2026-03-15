import { DeepPartial, Repository } from 'typeorm';
import dataSource from '../data-source';
import { Discipline } from '../disciplines/disciplines.entity';
import { DISCIPLINE_VALUES } from '../disciplines/disciplines.constants';
import { Application } from '../applications/application.entity';
import {
  AppStatus,
  ExperienceType,
  InterestArea,
  ApplicantType,
} from '../applications/types';
import { LearnerInfo } from '../learner-info/learner-info.entity';
import { School } from '../learner-info/types';
import { VolunteerInfo } from '../volunteer-info/volunteer-info.entity';
import { Applicant } from '../applicants/applicant.entity';
import { Admin } from '../users/admin.entity';

const ADMIN_SEED = [
  {
    firstName: 'Indie',
    lastName: 'Kitt',
    email: 'indie.kitt@northeastern.edu',
    discipline: DISCIPLINE_VALUES.RN,
  },
  {
    firstName: 'Linda',
    lastName: 'Johnson',
    email: 'linda.johnson@northeastern.edu',
    discipline: DISCIPLINE_VALUES.PublicHealth,
  },
  {
    firstName: 'Lucine',
    lastName: 'Armen',
    email: 'lucine.armen@northeastern.edu',
    discipline: DISCIPLINE_VALUES.SocialWork,
  },
];

const APPLICANT_SEED: Applicant[] = [
  {
    appId: 1,
    firstName: 'Jane',
    lastName: 'Doe',
    proposedStartDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30'),
  },
  {
    appId: 2,
    firstName: 'John',
    lastName: 'Smith',
    proposedStartDate: new Date('2026-01-01'),
    endDate: new Date('2026-06-30'),
  },
];

const APPLICATION_SEED: Application[] = [
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
    interest: [
      InterestArea.MEDICAL_RESPITE_INPATIENT,
      InterestArea.FAMILY_AND_YOUTH_SERVICES,
    ],
    license: 'nursing license',
    applicantType: ApplicantType.VOLUNTEER,
    phone: '123-456-7890',
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
    emergencyContactName: 'Bob Doe',
    emergencyContactPhone: '111-111-1111',
    emergencyContactRelationship: 'Mother',
    heardAboutFrom: [],
  },
  {
    appId: 2,
    appStatus: AppStatus.IN_REVIEW,
    mondayAvailability: '12pm and on every other week',
    tuesdayAvailability: 'approximately 10am-3pm',
    wednesdayAvailability: 'no availability',
    thursdayAvailability: 'maybe before 10am',
    fridayAvailability: 'Sometime between 4-6',
    saturdayAvailability: 'no availability',
    experienceType: ExperienceType.BS,
    interest: [InterestArea.HEP_C_CARE],
    license: 'n/a',
    applicantType: ApplicantType.LEARNER,
    phone: '123-456-7890',
    email: 'test@example.com',
    discipline: DISCIPLINE_VALUES.RN,
    referred: false,
    weeklyHours: 20,
    pronouns: 'he/him',
    nonEnglishLangs: 'spoken chinese only',
    desiredExperience:
      'I want to give back to the boston community and learn to talk better with patients',
    resume: 'johndoe_resume_2_6_2026.pdf',
    coverLetter: 'johndoe_coverLetter_2_6_2026.pdf',
    emergencyContactName: 'Bob Doe',
    emergencyContactPhone: '111-111-1111',
    emergencyContactRelationship: 'Mother',
    heardAboutFrom: [],
  },
  {
    appId: 3,
    appStatus: AppStatus.INACTIVE,
    mondayAvailability: '12pm and on every other week',
    tuesdayAvailability: 'approximately 10am-3pm',
    wednesdayAvailability: 'no availability',
    thursdayAvailability: 'maybe before 10am',
    fridayAvailability: 'Sometime between 4-6',
    saturdayAvailability: 'no availability',
    experienceType: ExperienceType.BS,
    interest: [InterestArea.WOMENS_HEALTH],
    license: 'n/a',
    applicantType: ApplicantType.VOLUNTEER,
    phone: '123-456-7890',
    email: 'test@example.com',
    discipline: DISCIPLINE_VALUES.RN,
    referred: false,
    weeklyHours: 20,
    pronouns: 'they/them',
    nonEnglishLangs: 'spoken chinese only',
    desiredExperience:
      'I want to give back to the boston community and learn to talk better with patients',
    resume: 'sam_resume_2_6_2026.pdf',
    coverLetter: 'sam_coverLetter_2_6_2026.pdf',
    emergencyContactName: 'sam senior',
    emergencyContactPhone: '111-111-1111',
    emergencyContactRelationship: 'Parent',
    heardAboutFrom: [],
  },
];

const LEARNER_INFO_SEED: LearnerInfo[] = [
  {
    appId: 1,
    school: School.HARVARD_MEDICAL_SCHOOL,
    isSupervisorApplying: false,
    isLegalAdult: true,
  },
];
const VOLUNTEER_INFO_SEED: VolunteerInfo[] = [
  {
    appId: 2,
    license: '1234567890',
  },
  {
    appId: 3,
    license: '1234567890',
  },
];

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Initialize the data source
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Create disciplines
    console.log('📚 Creating disciplines...');
    await dataSource.getRepository(Discipline).save(
      Object.values(DISCIPLINE_VALUES).map((name) => ({
        name,
        admin_ids: [],
      })),
    );
    console.log('✅ Disciplines created');

    // Create admin test data
    console.log('📋 Creating applicants...');
    const adminRepo: Repository<Admin> = dataSource.getRepository(Admin);
    const admins = await adminRepo.save(ADMIN_SEED as DeepPartial<Admin>[]);
    console.log(`✅ Created ${admins.length} admins`);

    // Create application test data
    console.log('📋 Creating applications...');
    const applicationRepo: Repository<Application> =
      dataSource.getRepository(Application);
    const applications = await applicationRepo.save(
      APPLICATION_SEED as DeepPartial<Application>[],
    );
    console.log(`✅ Created ${applications.length} applications`);

    // Create applicant test data
    console.log('📋 Creating applicants...');
    const applicantRepo: Repository<Applicant> =
      dataSource.getRepository(Applicant);
    const applicants = await applicantRepo.save(
      APPLICANT_SEED as DeepPartial<Applicant>[],
    );
    console.log(`✅ Created ${applicants.length} applicants`);

    // Create learner info test data
    console.log('📋 Creating applicants...');
    const learnerInfoRepo: Repository<LearnerInfo> =
      dataSource.getRepository(LearnerInfo);
    const learnerInfos = await learnerInfoRepo.save(
      LEARNER_INFO_SEED as DeepPartial<LearnerInfo>[],
    );
    console.log(`✅ Created ${learnerInfos.length} learner infos`);

    // Create learner info test data
    console.log('📋 Creating applicants...');
    const volunteerInfoRepo: Repository<VolunteerInfo> =
      dataSource.getRepository(VolunteerInfo);
    const volunteerInfos = await volunteerInfoRepo.save(
      VOLUNTEER_INFO_SEED as DeepPartial<VolunteerInfo>[],
    );
    console.log(`✅ Created ${volunteerInfos.length} volunteer infos`);

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
