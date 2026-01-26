import {
  IsNumber,
  IsDefined,
  Min,
  IsString,
  IsNotEmpty,
} from 'class-validator';

/**
 * Defines the expected shape of data for creating a volunter info
 *
 * DTO - data transfer object (defines and validates the structure of data sent over the network).
 */
export class CreateVolunteerInfoDto {
  /**
   * The id corresponding to the application this information belongs to
   */
  @IsNumber()
  @Min(0)
  @IsDefined()
  appId!: number;

  // TODO: clarify what format this string is in, and why it's not an array
  // if people can hold multiple licenses in real life
  @IsString()
  @IsNotEmpty()
  license!: string;
}
