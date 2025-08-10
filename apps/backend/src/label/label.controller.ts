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

  /** Creates a new label.
   * @param LabelDto - The data transfer object containing label details.
   * @returns The created label.
   * @throws BadRequestException if the label name is not unique
   * @throws BadRequestException if label name is not provided
   * @throws BadRequestException if color is not provided or is not hexadecimal
   */
}
