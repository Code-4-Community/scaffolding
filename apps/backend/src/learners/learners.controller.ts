import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LearnersService } from './learners.service';
import { AuthGuard } from '@nestjs/passport';
import { Learner } from './learner.entity';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';

/**
 * Controller to expose callable HTTP endpoints to interface, extract, and change information about the app's learners, including start and end date
 */
@Controller('learners')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CurrentUserInterceptor)
export class LearnersController {
  constructor(private learnersService: LearnersService) {}

  @Post()
  async createLearner(
    //TODO: Replace with established DTO later
    @Body()
    createLearnerDto: {
      appId: number;
      name: string;
      startDate: string;
      endDate: string;
    },
  ): Promise<Learner> {
    return this.learnersService.create(
      createLearnerDto.appId,
      createLearnerDto.name,
      new Date(createLearnerDto.startDate),
      new Date(createLearnerDto.endDate),
    );
  }

  @Get()
  async getAllLearners(): Promise<Learner[]> {
    return this.learnersService.findAll();
  }

  @Get('/:appId')
  async getLearner(
    @Param('appId', ParseIntPipe) appId: number,
  ): Promise<Learner> {
    return this.learnersService.findOne(appId);
  }

  @Patch('/:id/start-date')
  async updateStartDate(
    @Param('id', ParseIntPipe) id: number,
    @Body('startDate') startDate: string,
  ): Promise<Learner> {
    return this.learnersService.updateStartDate(id, new Date(startDate));
  }

  @Patch('/:id/end-date')
  async updateEndDate(
    @Param('id', ParseIntPipe) id: number,
    @Body('endDate') endDate: string,
  ): Promise<Learner> {
    return this.learnersService.updateEndDate(id, new Date(endDate));
  }
}
