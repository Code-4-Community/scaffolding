import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { LearnerInfo } from './learner-info.entity';
import { ApiTags } from '@nestjs/swagger';
import { LearnerInfoService } from './learner-info.service';
import { CreateLearnerInfoDto } from './dto/create-learner-info.request.dto';

/**
 * Controller to expose HTTP endpoints to interface, extract, and change information about learner-specific application info.
 */
@ApiTags('LearnerInfo')
@Controller('learner_info')
export class LearnerInfoController {
  constructor(private learnerInfoService: LearnerInfoService) {}

  /**
   * Exposes an endpoint to create a learner info.
   * @param createLearnerInfoDto The expected data required to create a learner specific info object
   * @returns The newly created application.
   * @throws {Error} which is unchanged from what repository throws.
   */
  @Post()
  async createLearnerInfo(
    @Body() createLearnerInfoDto: CreateLearnerInfoDto,
  ): Promise<LearnerInfo> {
    return await this.learnerInfoService.create(createLearnerInfoDto);
  }
}
