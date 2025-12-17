import {
  Controller,
  Get,
  Post,
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
}
