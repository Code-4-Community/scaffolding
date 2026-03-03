import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { ApplicantsService } from './candidate-info.service';
import { AuthGuard } from '@nestjs/passport';
import { Applicant } from './candidate-info.entity';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { CreateApplicantDto } from './dto/candidate-info.dto';

/**
 * Controller exposing HTTP endpoints to get, create, and change information
 * about the app's applicants, including start and end dates.
 */
@Controller('applicants')
// @UseGuards(AuthGuard('jwt'))
@UseInterceptors(CurrentUserInterceptor)
export class ApplicantsController {
  constructor(private applicantsService: ApplicantsService) {}

  /**
   * Exposes an endpoint to create a applicant.
   * @param createApplicantDto Object with the necessary starting data for the
   *                         applicant corresponding to their application.
   * @returns The new applicant.
   * @throws {Error} If the repository throws an error.
   * @throws {BadRequestException} if any fields are invalid.
   */
  @Post()
  async createApplicant(
    @Body()
    createApplicantDto: CreateApplicantDto,
  ): Promise<Applicant> {
    return this.applicantsService.create(
      createApplicantDto.appId,
      createApplicantDto.email,
    );
  }

  /**
   * Exposes an endpoint to return all applicants in the system.
   * @returns An array of applicant objects.
   * @throws {Error} If the repository throws an error.
   */
  @Get()
  async getAllApplicants(): Promise<Applicant[]> {
    return this.applicantsService.findAll();
  }

  /**
   * Exposes an endpoint to return a specific applicant by email.
   * @param email The email of the desired applicant (primary key).
   * @returns The applicant with the desired email.
   * @throws {Error} If the repository throws an error.
   * @throws {NotFoundException} if the applicant with the specified email does not exist.
   */
  @Get('email/:email')
  async getApplicantByEmail(@Param('email') email: string): Promise<Applicant> {
    return this.applicantsService.findOne(email);
  }

  /**
   * Exposes an endpoint to return a specific applicant by appId (returns first match if multiple).
   * @param appId The appId of the desired applicant to return.
   * @returns The applicant(s) with the desired appId.
   */
  @Get('/:appId')
  async getApplicantsByAppId(
    @Param('appId', ParseIntPipe) appId: number,
  ): Promise<Applicant[]> {
    return this.applicantsService.findByAppId(appId);
  }

  /**
   * Exposes an endpoint to delete an applicant by email.
   * @param email The email of the applicant to delete (primary key).
   * @returns The deleted applicant object.
   * @throws {Error} If the repository throws an error.
   * @throws {NotFoundException} if the applicant with the specified email does not exist.
   */
  @Delete('email/:email')
  async deleteApplicant(@Param('email') email: string): Promise<Applicant> {
    return this.applicantsService.delete(email);
  }
}
