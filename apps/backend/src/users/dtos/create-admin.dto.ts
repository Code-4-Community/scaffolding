import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DISCIPLINE_VALUES } from '../../disciplines/disciplines.constants';

// TODO: Add class validators

/**
 * Defines the expected shape of data for creating a new admin.
 */
export class CreateAdminDto {
  /**
   * The first name of the admin to create.
   *
   * Example: 'Jane Doe'.
   */
  @IsString()
  @IsNotEmpty()
  firstName: string;

  /**
   * The last name of the admin to create.
   *
   * Example: 'Doe'.
   */
  @IsString()
  @IsNotEmpty()
  lastName: string;

  /**
   * The email of the admin to create.
   *
   * Example: 'jane.doe@northeastern.edu'.
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * The discipline of the admin to create.
   *
   * Example: DISCIPLINE_VALUES.Nursing.
   */
  @IsEnum(DISCIPLINE_VALUES)
  @IsNotEmpty()
  discipline: DISCIPLINE_VALUES;
}
