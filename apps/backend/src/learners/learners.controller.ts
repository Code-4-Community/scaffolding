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
 * Controller to expose callable HTTP endpoints to interface
 * extract, and change information about the app's learners, including start and end date
 */
@Controller('learners')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CurrentUserInterceptor)
export class LearnersController {
  constructor(private learnersService: LearnersService) {}

  /**
   * Exposes an endpoint to create a learner
   * @param createLearnerDto object with all of the necessary
   *                         starting data for the learner corresponding with their application
   * @returns the new learner
   * @throws anything the repository throws.
   *         BadRequestException if any fields are invalid
   */
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

  /**
   * Exposes an endpoint to return all learners in the system
   * @returns an array of learner objects
   * @throws anything that the repository throws
   */
  @Get()
  async getAllLearners(): Promise<Learner[]> {
    return this.learnersService.findAll();
  }

  /**
   * Exposes an endpoint to return a specific learner by appId
   * @param appId the appId of the desired learner to return
   * @returns the learner with the desired appId
   * @throws anything that the repository throws.
   *         BadRequestException if the id field is invalid, e.g. null or undefined
   *         NotFoundException with message 'Learner with ID <id> not found' if
   *         the learner with specified appId is found not to exist in the system
   */
  @Get('/:appId')
  async getLearner(
    @Param('appId', ParseIntPipe) appId: number,
  ): Promise<Learner> {
    return this.learnersService.findOne(appId);
  }

  /**
   * Exposes an endpoint to update a learner's commitment starting date
   * @param id the appId of the learner to update
   * @param startDate the new starting date for the learner's commitment
   * @returns the new learner object
   * @throws anything that the repository throws.
   *         BadRequestException if any fields are invalid.
   *         NotFoundException with message 'Learner with ID <id> not found'
   *         if the desired learner to update doesn't exist in the system
   */
  @Patch('/:id/start-date')
  async updateStartDate(
    @Param('id', ParseIntPipe) id: number,
    @Body('startDate') startDate: string,
  ): Promise<Learner> {
    return this.learnersService.updateStartDate(id, new Date(startDate));
  }

  /**
   * Exposes an endpoint to update a learner's commitment ending date
   * @param id the appId of the learner to update
   * @param startDate the new ending date for the learner's commitment
   * @returns the new learner object
   * @throws anything that the repository throws.
   *         BadRequestException if any fields are invalid.
   *         NotFoundException with message 'Learner with ID <id> not found'
   *         if the desired learner to update doesn't exist in the system
   */
  @Patch('/:id/end-date')
  async updateEndDate(
    @Param('id', ParseIntPipe) id: number,
    @Body('endDate') endDate: string,
  ): Promise<Learner> {
    return this.learnersService.updateEndDate(id, new Date(endDate));
  }
}
