import { Controller, Get, Put, Param, Query  } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsModel } from './applications.model';
import { ApplicationStatus } from './applications.model';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get('applicationsInfo')
  public async getApplications(): Promise<ApplicationsModel[]> {
    return this.applicationsService.getApplications();
  }

  @Put('editApplication/:appId')
  public async changeApplicationStatus(
    @Param('appId') appId: number,
    @Query('applicationStatus') appStatus: ApplicationStatus
  ): Promise<ApplicationsModel> {
    // Check if the provided appStatus is a valid enum value
    if (!Object.values(ApplicationStatus).includes(appStatus)) {
      throw new Error(`Invalid application status: ${appStatus}`);
    }

    return this.applicationsService.updateApplicationStatus(appId, appStatus);
  }
}
