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

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get()
  async getAllApplications(@Request() req): Promise<Application[]> {
    return await this.applicationsService.findAll();
  }

  @Get('/:appId')
  async getApplicationById(
    @Param('appId', ParseIntPipe) appId: number,
    @Request() req,
  ): Promise<Application> {
    return await this.applicationsService.findById(appId);
  }

  @Post()
  async createApplication(
    @Body() createApplicationDto: CreateApplicationDto,
    @Request() req,
  ): Promise<Application> {
    return await this.applicationsService.create(createApplicationDto);
  }

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

  @Delete('/:appId')
  async deleteApplication(
    @Param('appId', ParseIntPipe) appId: number,
    @Request() req,
  ): Promise<void> {
    return await this.applicationsService.delete(appId);
  }
}
