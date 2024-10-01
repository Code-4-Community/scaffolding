import { IsString, MaxLength, IsPhoneNumber } from 'class-validator';

/**
 * A Dto to represent user phone numbers.
 */
export class PhoneNumberDto {
    @IsPhoneNumber("US")
    number: String
}