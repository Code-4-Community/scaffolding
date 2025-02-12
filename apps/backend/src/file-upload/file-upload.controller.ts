import { Controller, Post, Param, BadRequestException, Body } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { Application } from '../applications/application.entity';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post(':applicationId')
  async uploadFile(
    @Param('applicationId') applicationId: number,
    @Body() file: any, // The file will now be passed in the body as a raw buffer
  ) {
    if (!applicationId) {
      throw new BadRequestException('Application ID is required');
    }

    return this.fileUploadService.handleFileUpload(file, applicationId);
  }
}
