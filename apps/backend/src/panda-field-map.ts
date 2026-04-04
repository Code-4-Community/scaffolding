/**
 * PandaDoc field map and small transform helpers.
 *
 * This module declares the canonical mapping from PandaDoc field IDs
 * (the `pandaDocKey` values) to backend properties, plus lightweight
 * helpers used during mapping (date parsing and boolean normalization).
 */
import { HeardAboutFrom, InterestArea } from './applications/types';
import { School } from './learner-info/types';

// Parse MM-DD-YYYY, MM/DD/YYYY, or YYYY-MM-DD into a Date parsed as UTC midnight.
// This produces the same value as `new Date('YYYY-MM-DD')` for the same date
// (tests compare against `new Date('YYYY-MM-DD')`).
/**
 * Parse a user-supplied date string into a Date representing local-midnight
 * for the supplied date when input is in MM-DD-YYYY or MM/DD/YYYY formats.
 *
 * For ISO (YYYY-MM-DD) and other formats this defers to the native parser.
 * Tests expect that dates like "02-04-2026" map to the same Date value
 * produced by `new Date('YYYY-MM-DD')` for that date.
 *
 * @param value - date string from PandaDoc (may be MM-dd-yyyy or ISO)
 * @returns Date instance representing the parsed date
 */
function parseDate(value: string): Date {
  if (!value || typeof value !== 'string') return new Date(String(value));

  // MM-DD-YYYY or MM/DD/YYYY -> construct local-midnight Date to match
  // native `new Date('MM-DD-YYYY')` behavior in Node (avoids timezone shifts).
  const mmdd = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/;
  const m = value.match(mmdd);
  if (m) {
    const mm = parseInt(m[1], 10);
    const dd = parseInt(m[2], 10);
    const yyyy = parseInt(m[3], 10);
    return new Date(yyyy, mm - 1, dd);
  }

  // For ISO (YYYY-MM-DD) and other formats, defer to native parser.
  return new Date(value);
}

/**
 * Convert common user-visible truthy values into a boolean.
 *
 * Accepts values commonly produced by web forms or PandaDoc fields such as
 * "Yes", "on", "checked", and "true" (case-insensitive). Any other
 * input is considered false.
 *
 * @param value - raw field value from PandaDoc
 * @returns normalized boolean
 */
function parseBooleanish(value: string): boolean {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase();
  return (
    normalized === 'yes' ||
    normalized === 'true' ||
    normalized === 'on' ||
    normalized === 'checked'
  );
}

/**
 * The backend target tables which panda-doc fields map into.
 * Each field entry in `PANDADOC_FIELD_MAP` declares which of these
 * tables the value should be written to.
 */
export type TargetTable =
  | 'application'
  | 'candidateInfo'
  | 'learnerInfo'
  | 'volunteerInfo';

/**
 * Describes a single PandaDoc -> backend mapping.
 *
 * - `pandaDocKey` is the field id used in the PandaDoc form.
 * - `backendField` is the destination property name on the target table.
 * - `required` indicates the field must be present (non-empty) or mapping
 *    will throw a missing-field error.
 * - `targetTable` selects which of the backend buckets the value lands in.
 * - `transform` is an optional function that converts the raw string value
 *    into the appropriate runtime type (dates, enums, numbers, etc.).
 * - `defaultValue` will be used when the input is blank (only when the
 *    value is optional).
 */
export interface ValidPayload {
  pandaDocKey: string;
  backendField: string;
  required: boolean;
  targetTable: TargetTable;
  transform?: (value: string) => unknown;
  defaultValue?: unknown;
}

/**
 * The authoritative mapping from PandaDoc field IDs to backend fields.
 *
 * The mapper consumes the PandaDoc webhook payload (a simple record of
 * field_id -> value) and uses this table to populate backend insert/update
 * objects. Items that share the same `(targetTable, backendField)` pair are
 * treated as array-aggregated inputs (for example multiple interest
 * checkboxes mapping into `application.interest`).
 */
export const PANDADOC_FIELD_MAP: ValidPayload[] = [
  // ── candidateInfo table ──
  {
    pandaDocKey: 'email',
    backendField: 'email',
    required: true,
    targetTable: 'candidateInfo',
  },

  // ── application table ──
  {
    pandaDocKey: 'email',
    backendField: 'email',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_StartDate',
    backendField: 'proposedStartDate',
    transform: (value: string) => parseDate(value),
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_EndDate',
    backendField: 'endDate',
    transform: (value: string) => parseDate(value),
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Pronouns',
    backendField: 'pronouns',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Phone',
    backendField: 'phone',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Languages',
    backendField: 'nonEnglishLangs',
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Experience',
    backendField: 'desiredExperience',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Discipline',
    backendField: 'discipline',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Discipline_Other',
    backendField: 'otherDisciplineDescription',
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Discipline_Other',
    backendField: 'elaborateOtherDiscipline',
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_License',
    backendField: 'license',
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Referred',
    backendField: 'referred',
    transform: (value: string) => parseBooleanish(value),
    required: false,
    targetTable: 'application',
    defaultValue: false,
  },
  {
    pandaDocKey: 'Volunteer_ReferredEmail',
    backendField: 'referredEmail',
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_TotalHours',
    backendField: 'weeklyHours',
    transform: (value: string) => {
      const s = String(value ?? '');
      const m = s.match(/(\d+)/);
      return m ? parseInt(m[1], 10) : parseInt(s, 10);
    },
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_AvailabilityMonday',
    backendField: 'mondayAvailability',
    required: false,
    targetTable: 'application',
    defaultValue: '',
  },
  {
    pandaDocKey: 'Volunteer_AvailabilityTuesday',
    backendField: 'tuesdayAvailability',
    required: false,
    targetTable: 'application',
    defaultValue: '',
  },
  {
    pandaDocKey: 'Volunteer_AvailabilityWednesday',
    backendField: 'wednesdayAvailability',
    required: false,
    targetTable: 'application',
    defaultValue: '',
  },
  {
    pandaDocKey: 'Volunteer_AvailabilityThursday',
    backendField: 'thursdayAvailability',
    required: false,
    targetTable: 'application',
    defaultValue: '',
  },
  {
    pandaDocKey: 'Volunteer_AvailabilityFriday',
    backendField: 'fridayAvailability',
    required: false,
    targetTable: 'application',
    defaultValue: '',
  },
  {
    pandaDocKey: 'Volunteer_AvailabilitySaturday',
    backendField: 'saturdayAvailability',
    required: false,
    targetTable: 'application',
    defaultValue: '',
  },
  {
    pandaDocKey: 'Volunteer_ResumeUpload2',
    backendField: 'resume',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_CoverletterUpload2',
    backendField: 'coverLetter',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_EmergencyContactName',
    backendField: 'emergencyContactName',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_EmergencyContactPhone',
    backendField: 'emergencyContactPhone',
    required: true,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_EmergencyContactRelationship',
    backendField: 'emergencyContactRelationship',
    required: true,
    targetTable: 'application',
  },

  // Interest area checkboxes — each checked box maps to the `interest` array
  {
    pandaDocKey: 'Volunteer_Interest_WomensHealth',
    backendField: 'interest',
    transform: () => InterestArea.WOMENS_HEALTH,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Interest_AdditctionServices',
    backendField: 'interest',
    transform: () => InterestArea.ADDICTION_MEDICINE,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Interest_VeteransServices',
    backendField: 'interest',
    transform: () => InterestArea.VETERANS_SERVICES,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Interest_HIV',
    backendField: 'interest',
    transform: () => InterestArea.HIV_SERVICES,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Interest_Respite',
    backendField: 'interest',
    transform: () => InterestArea.MEDICAL_RESPITE_INPATIENT,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Interest_PrimaryCare',
    backendField: 'interest',
    transform: () => InterestArea.PRIMARY_CARE,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Interest_FamilyServices',
    backendField: 'interest',
    transform: () => InterestArea.FAMILY_AND_YOUTH_SERVICES,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Interest_CaseManagement',
    backendField: 'interest',
    transform: () => InterestArea.CASE_MANAGEMENT,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Interest_StreetMedicine',
    backendField: 'interest',
    transform: () => InterestArea.STREET_MEDICINE,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Interest_BehavioralHealth',
    backendField: 'interest',
    transform: () => InterestArea.BEHAVIORAL_HEALTH,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Interest_HepC',
    backendField: 'interest',
    transform: () => InterestArea.HEP_C_CARE,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_Interest_Dental',
    backendField: 'interest',
    transform: () => InterestArea.DENTAL,
    required: false,
    targetTable: 'application',
  },

  // How did you hear about us checkboxes
  {
    pandaDocKey: 'Volunteer_HearAboutUs_School',
    backendField: 'heardAboutFrom',
    transform: () => HeardAboutFrom.SCHOOL,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_HearAboutUs_Website',
    backendField: 'heardAboutFrom',
    transform: () => HeardAboutFrom.BHCHP_WEBSITE,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_HearAboutUs_OnlineSearch',
    backendField: 'heardAboutFrom',
    transform: () => HeardAboutFrom.ONLINE_SEARCH,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_HearAboutUs_FromStaff',
    backendField: 'heardAboutFrom',
    transform: () => HeardAboutFrom.FROM_A_BHCHP_STAFF_MEMBER,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_HearAboutUs_CurrentStaff',
    backendField: 'heardAboutFrom',
    transform: () => HeardAboutFrom.CURRENT_OR_FORMER_STAFF,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_HearAboutUs_FriendFamily',
    backendField: 'heardAboutFrom',
    transform: () => HeardAboutFrom.FRIEND_FAMILY,
    required: false,
    targetTable: 'application',
  },
  {
    pandaDocKey: 'Volunteer_HearAboutUs_Other',
    backendField: 'heardAboutFrom',
    transform: () => HeardAboutFrom.OTHER,
    required: false,
    targetTable: 'application',
  },

  // ── learnerInfo table ──
  {
    pandaDocKey: 'Volunteer_ Affiliation_Other',
    backendField: 'otherSchool',
    required: false,
    targetTable: 'learnerInfo',
  },
  {
    pandaDocKey: 'Volunteer_FormFor',
    backendField: 'isSupervisorApplying',
    transform: (value: string) => value === 'Supervisor/Instructor',
    required: true,
    targetTable: 'learnerInfo',
  },
  {
    pandaDocKey: 'Volunteer_Age',
    backendField: 'isLegalAdult',
    transform: (value: string) => value === 'Yes',
    required: true,
    targetTable: 'learnerInfo',
  },
  {
    pandaDocKey: 'Volunteer_DOB',
    backendField: 'dateOfBirth',
    transform: (value: string) => parseDate(value),
    required: true,
    targetTable: 'learnerInfo',
  },
  {
    // Map unknown PandaDoc school names to the enum `School.OTHER` and
    // store the raw value in `otherSchool` so persistence won't violate
    // the enum constraint.
    pandaDocKey: 'Volunteer_Affiliation',
    backendField: 'school',
    transform: () => School.OTHER,
    required: true,
    targetTable: 'learnerInfo',
  },

  {
    pandaDocKey: 'Volunteer_Department',
    backendField: 'schoolDepartment',
    required: false,
    targetTable: 'learnerInfo',
  },
  {
    pandaDocKey: 'Volunteer_CourseRequirements',
    backendField: 'courseRequirements',
    required: false,
    targetTable: 'learnerInfo',
  },
  {
    pandaDocKey: 'Volunteer_InstructorInfo',
    backendField: 'instructorInfo',
    required: false,
    targetTable: 'learnerInfo',
  },
  {
    pandaDocKey: 'Volunteer_SyllabusUpload',
    backendField: 'syllabus',
    required: false,
    targetTable: 'learnerInfo',
  },

  // ── volunteerInfo table ──
  {
    pandaDocKey: 'Volunteer_License',
    backendField: 'license',
    required: false,
    targetTable: 'volunteerInfo',
  },
];
