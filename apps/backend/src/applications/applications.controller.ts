import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { Application } from './application.entity';
import { CreateApplicationDto } from './dto/create-application.request.dto';
import { PandaDocWebhookDto } from './dto/pandadoc-webhook.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  private readonly logger = new Logger(ApplicationsController.name);

  constructor(private applicationsService: ApplicationsService) {}

  @Get()
  async getAllApplications(): Promise<Application[]> {
    return await this.applicationsService.findAll();
  }

  @Get('/:appId')
  async getApplicationById(
    @Param('appId', ParseIntPipe) appId: number,
  ): Promise<Application> {
    return await this.applicationsService.findById(appId);
  }

  @Post()
  async createApplication(
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    return await this.applicationsService.create(createApplicationDto);
  }

  @Post('webhook/pandadoc')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Receive PandaDoc webhook events' })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
    type: Application,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid webhook payload or unsupported event type',
  })
  async receivePandaDocWebhook(
    @Body() webhookData: PandaDocWebhookDto,
  ): Promise<{
    success: boolean;
    application?: Application;
    message?: string;
  }> {
    try {
      this.logger.log(
        `Received PandaDoc webhook: event=${webhookData.event}, documentId=${webhookData.data.id}`,
      );

      const application = await this.applicationsService.handlePandaDocWebhook(
        webhookData,
      );

      this.logger.log(
        `Successfully processed webhook and created application ID: ${application.appId}`,
      );

      return {
        success: true,
        application,
      };
    } catch (error) {
      this.logger.error(
        `Failed to process PandaDoc webhook: ${error.message}`,
        error.stack,
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }
}
