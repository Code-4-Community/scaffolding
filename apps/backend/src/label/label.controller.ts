import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LabelsService } from './label.service';
import { Label } from './types/label.entity';

@ApiTags('labels')
@Controller('labels')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}
}
