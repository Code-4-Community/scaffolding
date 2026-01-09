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
import { NotFoundException } from '@nestjs/common';

/**
 * Controller to expose HTTP endpoints to interface, extract, and change information about the app's applications.
 */
@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  /**
   * Exposes an endpoint to return all applications.
   * @param req The request object from the caller (frontend). Currently not used.
   * @returns A promise of the list of all available applications.
   * @throws {Error} which is unchanged from what repository throws.
   */
  @Get()
  async getAllApplications(@Request() req): Promise<Application[]> {
    return await this.applicationsService.findAll();
  }

  /**
   * Exposes an endpoint to return an application by id.
   * @param appId The desired application id to search for.
   * @param req The request object from the caller (frontend). Currently not used.
   * @returns A promise of the application with that id.
   * @throws {NotFoundException} with message 'Application with ID <id> not found'
   *         if an application with that id does not exist.
   * @throws {Error} which is unchanged from what repository throws.
   */
  @Get('/:appId')
  async getApplicationById(
    @Param('appId', ParseIntPipe) appId: number,
    @Request() req,
  ): Promise<Application> {
    return await this.applicationsService.findById(appId);
  }

  /**
   * Exposes an endpoint to create an application.
   * @param createApplicationDto The expected data required to create an application (applicant's info).
   * @param req The request object from the caller (frontend). Currently not used.
   * @returns The newly created application.
   * @throws {Error} which is unchanged from what repository throws.
   */
  @Post()
  async createApplication(
    @Body() createApplicationDto: CreateApplicationDto,
    @Request() req,
  ): Promise<Application> {
    return await this.applicationsService.create(createApplicationDto);
  }

  /**
   * Exposes an endpoint to update the status of the application.
   * @param appId The id of the application to update.
   * @param updateStatusDto Object containing the desired new application status.
   * @param req The request object from the caller (frontend). Currently not used.
   * @returns The updated application object.
   * @throws {NotFoundException} with message 'Application with ID <id> not found'
   *         if the application does not exist.
   * @throws {Error} which is unchanged from what repository throws.
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
   * Exposes an endpoint to update the applicant's interest in their application.
   * @param appId The id of the application to modify.
   * @param updateInterestDto Object containing the desired new interest.
   * @returns The updated application object.
   * @throws {NotFoundException} with message 'Application with ID <id> not found'
   *         if the application does not exist.
   * @throws {Error} which is unchanged from what repository throws.
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
   * Exposes an endpoint to delete an application from the system.
   * @param appId The id of the application to delete.
   * @param req The request object from the caller (frontend). Currently not used.
   * @throws {NotFoundException} with message 'Application with ID <id> not found'
   *         if the application does not exist.
   * @throws {Error} which is unchanged from what repository throws.
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
