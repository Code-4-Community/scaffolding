import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Site } from '../types';

// TODO: Add class validators

/**
 * Defines the expected shape of data for creating a new admin.
 */
export class CreateAdminDto {
  /**
   * The name of the admin to create.
   *
   * Example: 'Jane Doe'.
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * The email of the admin to create.
   *
   * Example: 'jane.doe@northeastern.edu'.
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * The site for which the person is to be an admin of.
   */
  @IsEnum(Site)
  @IsDefined()
  site: Site;
}
