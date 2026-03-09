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
import { ApplicantsService } from './applicants.service';
import { AuthGuard } from '@nestjs/passport';
import { Applicant } from './applicant.entity';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { CreateApplicantDto } from './dto/applicant.dto';

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
      createApplicantDto.firstName,
      createApplicantDto.lastName,
      new Date(createApplicantDto.proposedStartDate),
      new Date(createApplicantDto.endDate),
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
   * Exposes an endpoint to return a specific applicant by appId.
   * @param appId The appId of the desired applicant to return.
   * @returns The applicant with the desired appId.
   * @throws {Error} If the repository throws an error.
   * @throws {BadRequestException} if the id field is invalid (e.g. null or undefined).
   * @throws {NotFoundException} with message 'Applicant with ID <id> not found'
   *                             if the applicant with the specified appId does not exist.
   */
  @Get('/:appId')
  async getApplicant(
    @Param('appId', ParseIntPipe) appId: number,
  ): Promise<Applicant> {
    return this.applicantsService.findOne(appId);
  }

  /**
   * Exposes an endpoint to update a applicant's commitment starting date.
   * @param appId The appId of the applicant to update.
   * @param proposedStartDate The new starting date for the applicant's commitment.
   * @throws {Error} If the repository throws an error.
   * @throws {BadRequestException} if any field is invalid (e.g. null or undefined).
   * @throws {NotFoundException} with message 'Applicant with ID <appId> not found'
   *                             if the applicant with the specified appId does not exist.
   */
  @Patch('/:appId/start-date')
  async updateproposedStartDate(
    @Param('appId', ParseIntPipe) appId: number,
    @Body('proposedStartDate') proposedStartDate: string,
  ): Promise<Applicant> {
    return this.applicantsService.updateproposedStartDate(
      appId,
      new Date(proposedStartDate),
    );
  }

  /**
   * Exposes an endpoint to update a applicant's commitment ending date.
   * @param appId The appId of the applicant to update.
   * @param endDate The new ending date for the applicant's commitment.
   * @returns The updated applicant object.
   * @throws {Error} If the repository throws an error.
   * @throws {BadRequestException} if any field is invalid (e.g. null or undefined).
   * @throws {NotFoundException} with message 'Applicant with ID <appId> not found'
   *                             if the applicant with the specified appId does not exist.
   */
  @Patch('/:appId/end-date')
  async updateEndDate(
    @Param('appId', ParseIntPipe) appId: number,
    @Body('endDate') endDate: string,
  ): Promise<Applicant> {
    return this.applicantsService.updateEndDate(appId, new Date(endDate));
  }

  /**
   * Exposes an endpoint to delete a applicant by id.
   * @param id The id of the applicant to delete.
   * @returns The deleted applicant object.
   * @throws {Error} If the repository throws an error.
   * @throws {NotFoundException} with message 'Applicant with ID <id> not found'
   *                             if the applicant with the specified id does not exist.
   */
  @Delete('/:id')
  async deleteApplicant(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Applicant> {
    return this.applicantsService.delete(id);
  }
}
