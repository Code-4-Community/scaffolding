import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { DisciplinesService } from './disciplines.service';
import { CreateDisciplineRequestDto } from './dto/create-discipline.request.dto';
import { Discipline } from './disciplines.entity';

/**
 * Controller to expose callable HTTP endpoints to interface,
 * extract, and change information about the app's disciplines.
 */
@Controller('disciplines')
@UseInterceptors(CurrentUserInterceptor)
// @UseGuards(AuthGuard('jwt'))
export class DisciplinesController {
  constructor(private disciplinesService: DisciplinesService) {}

  /**
   * Exposes an endpoint to return a list of all disciplines
   * @returns a list of all disciplines
   */
  @Get()
  async getAll(): Promise<Discipline[]> {
    return this.disciplinesService.findAll();
  }

  /**
   * Exposes an endpoint to return a discipline by id
   * @param id the id of the discipline to return
   * @returns the discipline with the corresponding id
   */
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Discipline> {
    return this.disciplinesService.findOne(Number(id));
  }

  /**
   * Exposes an endpoint to create a new discipline
   * @param createDto object containing necessary info to create an new discipline, like the name
   * @returns the new discipline
   */
  @Post()
  async create(
    @Body() createDto: CreateDisciplineRequestDto,
  ): Promise<Discipline> {
    return this.disciplinesService.create(createDto);
  }
}
