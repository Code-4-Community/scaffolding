import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseInterceptors,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
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
// TODO: Uncomment after JWT authentication is setup with Cognito
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

  /**
   * Deletes a discipline by id
   * @param id the id of the discipline to delete
   * @returns the deleted discipline
   * @throws {NotFoundException} if a discipline of the specified id doesn't exist in the repository.
   * @throws {Error} if the repository throws an error.
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Discipline> {
    return this.disciplinesService.remove(id);
  }

  /**
   * Adds an admin ID to a discipline
   * @param id the discipline id
   * @param adminId the admin id to add
   * @returns the updated discipline
   * @throws {NotFoundException} if a discipline of the specified id doesn't exist in the repository.
   * @throws {Error} if the repository throws an error.
   */
  @Post(':id/admins/:adminId')
  async addAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Param('adminId', ParseIntPipe) adminId: number,
  ): Promise<Discipline> {
    return this.disciplinesService.addAdmin(id, adminId);
  }

  /**
   * Removes an admin ID from a discipline
   * @param id the discipline id
   * @param adminId the admin id to remove
   * @returns the updated discipline
   * @throws {NotFoundException} if a discipline of the specified id doesn't exist in the repository.
   * @throws {Error} if the repository throws an error.
   */
  @Delete(':id/admins/:adminId')
  async removeAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Param('adminId', ParseIntPipe) adminId: number,
  ): Promise<Discipline> {
    return this.disciplinesService.removeAdmin(id, adminId);
  }
}
