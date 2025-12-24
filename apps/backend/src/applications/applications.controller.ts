import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { Application } from './application.entity';
import { CreateApplicationDto } from './dto/create-application.request.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateApplicationStatusDto } from './dto/update-application-status.request.dto';
import { UpdateApplicationInterestDto } from './dto/update-application-interest.request.dto';

/**
 * Controller to expose callable HTTP endpoints to interface, extract, and change information about the app's applications
 */
@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  /**
   * Exposes an endpoint to return all applications
   * @param req the request object from the caller (frontend), currently not used.
   * @returns a promise of the list of all available applications
   * @throws anything the repository throws.
   */
  @Get()
  async getAllApplications(@Request() req): Promise<Application[]> {
    return await this.applicationsService.findAll();
  }

  /**
   * Exposes an endpoint to return an application by Id
   * @param appId The desired application Id to search for
   * @param req the request object from the caller (frontend), currently not used.
   * @returns a promise of the application with that id
   * @throws NotFoundException with message 'Application with ID <id> not found'
   *         if an application of that Id does not exist. Will also throw anything
   *         that the repository throws.
   */
  @Get('/:appId')
  async getApplicationById(
    @Param('appId', ParseIntPipe) appId: number,
    @Request() req,
  ): Promise<Application> {
    return await this.applicationsService.findById(appId);
  }

  /**
   * Exposes an endpoint to create an application
   * @param createApplicationDto the expected data required to create an application (applicant's info)
   * @param req the request object from the caller (frontend), currently not used.
   * @returns the newly created application
   * @throws anything the repository throws.
   */
  @Post()
  async createApplication(
    @Body() createApplicationDto: CreateApplicationDto,
    @Request() req,
  ): Promise<Application> {
    return await this.applicationsService.create(createApplicationDto);
  }

  /**
   * Exposes an endpoint to update the status of the application
   * @param appId the Id of the application to update
   * @param updateStatusDto object containing the desired new application status
   * @param req the request object from the caller (frontend), currently not used.
   * @returns the new application object after changes have been made
   * @throws NotFoundException with message 'Application with ID <id> not found'
   *         if an application of that Id does not exist. Will also throw anything
   *         that the repository throws.
   */
  @Patch('/:appId/status')
  async updateApplicationStatus(
    @Param('appId', ParseIntPipe) appId: number,
    @Body() updateStatusDto: UpdateApplicationStatusDto,
    @Request() req,
  ): Promise<Application> {
    return await this.applicationsService.update(appId, {
      appStatus: updateStatusDto.appStatus,
    });
  }

  /**
   * Exposes an endpoint to update the applicant's interest in their application
   * @param appId the Id of the application to make changes to
   * @param updateInterestDtoobject containing the desired new interest
   * @returns the new application object after changes have been made
   * @throws NotFoundException with message 'Application with ID <id> not found'
   *         if an application of that Id does not exist. Will also throw anything
   *         that the repository throws.
   */
  @Patch('/:appId/interest')
  async updateApplicationInterest(
    @Param('appId', ParseIntPipe) appId: number,
    @Body() updateInterestDto: UpdateApplicationInterestDto,
    @Request() req,
  ): Promise<Application> {
    return await this.applicationsService.update(appId, {
      interest: updateInterestDto.interest,
    });
  }

  /**
   * Exposes an endpoint to delete an application from the system
   * @param appId the Id of the application to delete
   * @param req the request object from the caller (frontend), currently not used.
   * @returns nothing
   * @throws NotFoundException with message 'Application with ID <id> not found'
   *         if an application of that Id does not exist. Will also throw anything
   *         that the repository throws.
   *
   * Does not return a value.
   */
  @Delete('/:appId')
  async deleteApplication(
    @Param('appId', ParseIntPipe) appId: number,
    @Request() req,
  ): Promise<void> {
    return await this.applicationsService.delete(appId);
  }
}
