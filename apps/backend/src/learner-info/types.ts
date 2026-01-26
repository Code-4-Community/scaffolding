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
