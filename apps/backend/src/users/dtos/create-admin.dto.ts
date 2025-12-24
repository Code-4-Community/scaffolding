import { Site } from '../types';

// TODO: Add class validators

/**
 * Defines the expected shape of data for creating a new admin
 */
export interface CreateAdminDto {
  /**
   * The name of the admin to create
   *
   * Example: 'Jane Doe'
   */
  name: string;

  /**
   * The email of the admin to create
   *
   * Example 'jane.doe@northeastern.edu'
   */
  email: string;

  /**
   * The site for which the person is to be an admin of
   */
  site: Site;
}
