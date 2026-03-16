import { InterestArea } from './applications/types';

export type TargetTable =
  | 'application'
  | 'applicant'
  | 'learnerInfo'
  | 'volunteerInfo';

export interface ValidPayload {
  pandaDocKey: string;
  backendField: string;
  required: boolean;
  targetTable: TargetTable;
  transform?: (value: string) => unknown;
  defaultValue?: unknown;
}

export const PANDADOC_FIELD_MAP: ValidPayload[] = [
  // ── applicant table ──
  {
    pandaDocKey: 'name',
    backendField: 'firstName',
    transform: (value: string) => value.split(' ')[0],
    required: true,
    targetTable: 'applicant',
  },
  {
    pandaDocKey: 'name',
    backendField: 'lastName',
    transform: (value: string) => value.split(' ')[1],
    required: true,
    targetTable: 'applicant',
  },
  {
    pandaDocKey: 'start_date',
    backendField: 'startDate',
    transform: (value: string) => new Date(value),
    required: true,
    targetTable: 'applicant',
  },
  {
    pandaDocKey: 'end_date',
    backendField: 'endDate',
    transform: (value: string) => new Date(value),
    required: false,
    targetTable: 'applicant',
  },

  // ── application table ──
  {
    pandaDocKey: 'email',
    backendField: 'email',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'pronouns',
    backendField: 'pronouns',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'phone_number',
    backendField: 'phone',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'languages',
    backendField: 'nonEnglishLangs',
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'experience_type',
    backendField: 'desiredExperience',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'school_affiliation',
    backendField: 'school',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'other_school',
    backendField: 'otherSchool',
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'discipline',
    backendField: 'discipline',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'other_discipline',
    backendField: 'otherDisciplineDescription',
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'license',
    backendField: 'license',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'total_hours',
    backendField: 'weeklyHours',
    transform: (value: string) => parseInt(value, 10),
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'monday_availability',
    backendField: 'mondayAvailability',
    required: false,
    targetTable: 'application',
    defaultValue: '',
  },
  {
    pandaDocKey: 'tuesday_availability',
    backendField: 'tuesdayAvailability',
    required: false,
    targetTable: 'application',
    defaultValue: '',
  },
  {
    pandaDocKey: 'wednesday_availability',
    backendField: 'wednesdayAvailability',
    required: false,
    targetTable: 'application',
    defaultValue: '',
  },
  {
    pandaDocKey: 'thursday_availability',
    backendField: 'thursdayAvailability',
    required: false,
    targetTable: 'application',
    defaultValue: '',
  },
  {
    pandaDocKey: 'friday_availability',
    backendField: 'fridayAvailability',
    required: false,
    targetTable: 'application',
    defaultValue: '',
  },
  {
    pandaDocKey: 'saturday_availability',
    backendField: 'saturdayAvailability',
    required: false,
    targetTable: 'application',
    defaultValue: '',
  },
  {
    pandaDocKey: 'resume',
    backendField: 'resume',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'cover_letter',
    backendField: 'coverLetter',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'emergency_contact_name',
    backendField: 'emergencyContactName',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'emergency_contact_phone',
    backendField: 'emergencyContactPhone',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'emergency_contact_relationship',
    backendField: 'emergencyContactRelationship',
    required: true,
    targetTable: 'application',
  },

  // Interest area checkboxes — each checked box maps to the `interest` array
  {
    pandaDocKey: 'interest_womens_health',
    backendField: 'interest',
    transform: () => InterestArea.WOMENS_HEALTH,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'interest_addiction_medicine',
    backendField: 'interest',
    transform: () => InterestArea.ADDICTION_MEDICINE,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'interest_veterans_services',
    backendField: 'interest',
    transform: () => InterestArea.VETERANS_SERVICES,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'interest_hiv_services',
    backendField: 'interest',
    transform: () => InterestArea.HIV_SERVICES,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'interest_medical_respite',
    backendField: 'interest',
    transform: () => InterestArea.MEDICAL_RESPITE_INPATIENT,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'interest_primary_care',
    backendField: 'interest',
    transform: () => InterestArea.PRIMARY_CARE,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'interest_family_youth_services',
    backendField: 'interest',
    transform: () => InterestArea.FAMILY_AND_YOUTH_SERVICES,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'interest_case_management',
    backendField: 'interest',
    transform: () => InterestArea.CASE_MANAGEMENT,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'interest_street_medicine',
    backendField: 'interest',
    transform: () => InterestArea.STREET_MEDICINE,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'interest_behavioral_health',
    backendField: 'interest',
    transform: () => InterestArea.BEHAVIORAL_HEALTH,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'interest_hep_c_care',
    backendField: 'interest',
    transform: () => InterestArea.HEP_C_CARE,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'interest_dental',
    backendField: 'interest',
    transform: () => InterestArea.DENTAL,
    required: false,
    targetTable: 'application',
  },

  // ── learnerInfo table ──
  {
    pandaDocKey: 'applicant_role',
    backendField: 'isSupervisorApplying',
    transform: (value: string) => value === 'Supervisor/Instructor',
    required: true,
    targetTable: 'learnerInfo',
  },
  {
    pandaDocKey: 'over_18',
    backendField: 'isLegalAdult',
    transform: (value: string) => value === 'Yes',
    required: true,
    targetTable: 'learnerInfo',
  },
  {
    pandaDocKey: 'dob',
    backendField: 'dateOfBirth',
    transform: (value: string) => new Date(value),
    required: false,
    targetTable: 'learnerInfo',
  },
  {
    pandaDocKey: 'school_affiliation',
    backendField: 'school',
    required: true,
    targetTable: 'learnerInfo',
  },
  {
    pandaDocKey: 'school_department',
    backendField: 'schoolDepartment',
    required: false,
    targetTable: 'learnerInfo',
  },
  {
    pandaDocKey: 'course_requirements',
    backendField: 'courseRequirements',
    required: false,
    targetTable: 'learnerInfo',
  },
  {
    pandaDocKey: 'instructor_info',
    backendField: 'instructorInfo',
    required: false,
    targetTable: 'learnerInfo',
  },
  {
    pandaDocKey: 'syllabus',
    backendField: 'syllabus',
    required: false,
    targetTable: 'learnerInfo',
  },

  // ── volunteerInfo table ──
  {
    pandaDocKey: 'license',
    backendField: 'license',
    required: false,
    targetTable: 'volunteerInfo',
  },
];
