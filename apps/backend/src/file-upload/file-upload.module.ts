import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUpload } from './entities/file-upload.entity';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { Application } from '../applications/application.entity';

@Module({
  imports: [
    // TypeORM setup for managing database storage
    TypeOrmModule.forFeature([FileUpload, Application]),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [TypeOrmModule],
})
export class FileUploadModule {}
