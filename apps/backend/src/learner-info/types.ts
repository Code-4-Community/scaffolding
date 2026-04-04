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
  BIDMC_RESIDENTS = 'BIDMC - Residents',
  BMC_ADDICTION_MEDICINE = 'BMC Addiction Medicine',
  BMC_FAMILY_MEDICINE = 'BMC - Family Medicine',
  BMC_CENTER_FOR_MULTICULTURAL_TRAINING_IN_PSYCHOLOGY = 'BMC School of Medicine - Center for Multicultural Training in Psychology',
  BOSTON_COLLEGE_LYNCH_SCHOOL = 'Boston College - Lynch School of Education and Human Development',
  BOSTON_GRADUATE_SCHOOL_OF_PSYCHOANALYSIS = 'Boston Graduate School of Psychoanalysis',
  BOSTON_UNIVERSITY = 'Boston University',
  BOSTON_MEDICAL_CENTER_GRAYKEN_CENTER = 'Boston Medical Center Grayken Center',
  BOSTON_UNIVERSITY_SCHOOL_OF_MEDICINE_PA = 'Boston University School of Medicine Division of Graduate Medical Sciences physician assistant program',
  BU_MENTAL_HEALTH_COUNSELING_AND_BEHAVIORAL_MEDICINE = 'BU Mental Health Counseling and Behavioral Medicine Program',
  BWH_ADDICTION_MEDICINE = 'BWH Addiction Medicine',
  CAPELLA_UNIVERSITY = 'Capella University',
  FISHER_COLLEGE = 'Fisher College',
  GEORGETOWN_UNIVERSITY_SCHOOL_OF_MEDICINE = 'Georgetown University School of Medicine',
  JOHNS_HOPKINS = 'Johns Hopkins',
  LABOURE_COLLEGE = 'Laboure College',
  MEDEX_NORTHWEST_PA = 'Medex Northwest PA',
  MGH_ADDICTION_MEDICINE = 'MGH Addiction Medicine',
  MGH_PEDIATRIC_RESIDENCY_PROGRAM = 'MGH Pediatric Residency Program',
  MICHIGAN_STATE_UNIVERSITY = 'Michigan State University',
  NORTHEASTERN = 'Northeastern',
  NORTHEASTERN_BOUVE_COLLEGE_OF_HEALTH_SCIENCES = 'Northeastern Bouve College of Health Sciences',
  NORWICH_UNIVERSITY = 'Norwich University',
  SALEM_STATE = 'Salem State',
  STATE_UNIVERSITY_OF_NEW_YORK = 'State University of New York',
  UMASS_BOSTON_NP_PA = 'UMass Boston - NP/PA',
  UMASS_BOSTON_NURSING = 'UMass Boston - Nursing',
  UNIVERSITY_OF_WASHINGTON_SCHOOL_OF_MEDICINE = 'University of Washington School of Medicine',
  WESTERN_GOVERNORS_UNIVERSITY = 'Western Governors University',
  WORCESTER_STATE_UNIVERSITY = 'Worcester State University',
  OTHER = 'Other',
  DOES_NOT_APPLY = 'Does not apply',
}
