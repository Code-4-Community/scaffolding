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

/**
 * Controller to expose callable HTTP endpoints to interface,
 * extract, and change information about the app's disciplines.
 */
@Controller('disciplines')
@UseInterceptors(CurrentUserInterceptor)
@UseGuards(AuthGuard('jwt'))
export class DisciplinesController {
  constructor(private disciplinesService: DisciplinesService) {}
  @Get()
  async getAll() {
    return this.disciplinesService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.disciplinesService.findOne(Number(id));
  }

  @Post()
  async create(@Body() createDto: CreateDisciplineRequestDto) {
    return this.disciplinesService.create(createDto);
  }
}
