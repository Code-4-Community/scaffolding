/**
 * Status of the application in the system/ review process
 */
export enum AppStatus {
  APP_SUBMITTED = 'App submitted',
  IN_REVIEW = 'In review',
  FORMS_SENT = 'Forms sent',
  ACCEPTED = 'Accepted',
  NO_AVAILABILITY = 'No Availability',
  DECLINED = 'Declined',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

/**
 * Experience type/ level of the applicant, generally in terms of medical experience/ degree
 */
export enum ExperienceType {
  BS = 'BS',
  MS = 'MS',
  PHD = 'PhD',
  MD = 'MD',
  MD_PHD = 'MD PhD',
  RN = 'RN',
  NP = 'NP',
  PA = 'PA',
  OTHER = 'Other',
}

/**
 * Applicant's area of interest for the commitment
 */
export enum InterestArea {
  WOMENS_HEALTH = "Women's Health",
  MEDICAL_RESPITE_INPATIENT = 'Medical Respite/Inpatient',
  STREET_MEDICINE = 'Street Medicine',
  ADDICTION_MEDICINE = 'Addiction Medicine',
  PRIMARY_CARE = 'Primary Care',
  BEHAVIORAL_HEALTH = 'Behavioral Health',
  VETERANS_SERVICES = 'Veterans Services',
  FAMILY_AND_YOUTH_SERVICES = 'Family and Youth Services',
  HEP_C_CARE = 'Hep C Care',
  HIV_SERVICES = 'HIV Services',
  CASE_MANAGEMENT = 'Case Management',
  DENTAL = 'Dental',
}

/**
 * Type of the applicant, either learner (currently enrolled in school)
 * or volunteer (graduated)
 */
export enum ApplicantType {
  LEARNER = 'Learner',
  VOLUNTEER = 'Volunteer',
}

/**
 * Phone number regex pattern for ###-###-#### format validation
 * @see https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number
 */
export const PHONE_REGEX = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;

/**
 * How the applicant heard about BHCHP
 */
export enum HeardAboutFrom {
  ONLINE_SEARCH = 'Online Search',
  BHCHP_WEBSITE = 'BHCHP Website',
  SCHOOL = 'School',
  FROM_A_BHCHP_STAFF_MEMBER = 'From a BHCHP Staff Member',
  OTHER = 'Other',
  FRIEND_FAMILY = 'Friend/Family',
  CURRENT_OR_FORMER_STAFF = 'I am a current/former BHCHP staff member',
}
