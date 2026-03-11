/**
 * Status or level of the user (currently admin or standard).
 */
export enum Status {
  ADMIN = 'ADMIN',
  STANDARD = 'STANDARD',
}

/**
 * Type of the user (admin or standard).
 */
export enum UserType {
  ADMIN = 'ADMIN',
  STANDARD = 'STANDARD',
}

/**
 * Sites the user belongs to (and for admins, sites they administrate).
 */
export enum Site {
  FENWAY = 'fenway',
  SITE_A = 'site_a',
  // Add more sites as needed
  // SITE_B = 'site_b',
  // SITE_C = 'site_c',
}
