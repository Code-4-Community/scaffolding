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
  NURSING = 'Nursing',
  HARM_REDUCTION = 'HarmReduction',
  WOMENS_HEALTH = 'WomensHealth',
}

/**
 * School of the applicant, includes well-known medical schools, or an other option
 */
export enum School {
  HARVARD_MEDICAL_SCHOOL = 'Harvard Medical School',
  JOHNS_HOPKINS = 'Johns Hopkins',
  STANFORD_MEDICINE = 'Stanford Medicine',
  MAYO_CLINIC = 'Mayo Clinic',
  OTHER = 'Other',
}

export enum DaysOfTheWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

export enum ApplicantType {
  LEARNER = 'Learner',
  VOLUNTEER = 'Volunteer',
}

/**
 * Phone number regex pattern for ###-###-#### format validation
 * found this online: https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number
 */
export const PHONE_REGEX = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
