/**
 * Defines the expected shape of data for updating an admin's email
 */
export interface UpdateAdminEmailDto {
  /**
   * The new email to change to
   *
   * Example: 'jane.doe@northeastern.edu'
   */
  email: string;
}
