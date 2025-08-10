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
import { TasksService } from './task.service';
import { Task } from './types/task.entity';
import { CreateTaskDTO } from './dtos/create-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Creates a new task.
   * @param createTaskDto The data to create the task.
   * @returns The created task.
   * @throws BadRequestException if the task data is invalid.
   */
  @Post('/create-task')
  async createTask(@Body() createTaskDto: CreateTaskDTO): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  /**
   * Edits a task by its ID.
   * @param id The ID of the task to edit.
   * @param updateTaskDto The data to update the task.
   * @returns The updated task.
   * @throws BadRequestException if the task with the given ID does not exist.
   * @throws BadRequestException if the task with the given ID does not exist.
   */

  /** Retrieves all tasks.
   * @returns An array of all tasks.
   */

  /**
   * Deletes a task by its ID.
   * @param id The ID of the task to delete.
   * @returns A delete result.
   * @throws BadRequestException if the task with the given ID does not exist.
   * @throws BadRequestException if the task with the given ID does not exist.
   */

  /**
   * Move task category by its ID.
   * @param id The ID of the task to move.
   * @param newCategory The new category to move the task to.
   * @returns The updated task.
   * @throws BadRequestException if the task with the given ID does not exist.
   * @throws BadRequestException if the new category is invalid.
   */

  /** Add labels to task by its ID
   * @param id The ID of the task to add labels to.
   * @param labels The labels to add to the task.
   * @returns The updated task.
   * @throws BadRequestException if the task with the given ID does not exist.
   * @throws BadRequestException if the labels are invalid.
   */

  /** Remove labels from task by its ID
   * @param id The ID of the task to remove labels from.
   * @param labels The labels to remove from the task.
   * @returns The updated task.
   * @throws BadRequestException if the task with the given ID does not exist.
   * @throws BadRequestException if the labels are invalid.
   */
}
