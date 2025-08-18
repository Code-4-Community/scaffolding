import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TasksService } from './task.service';
import { Task } from './types/task.entity';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { UpdateTaskDTO } from './dtos/update-task.dto';
import { TaskCategory } from './types/category';

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
  @Post('/task')
  async createTask(@Body() createTaskDto: CreateTaskDTO): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  /**
   * Edits a task by its ID.
   * @param id The ID of the task to edit.
   * @param updateTaskDto The data to update the task.
   * @returns The updated task.
   * @throws BadRequestException if the task with the given ID does not exist.
   * @throws BadRequestException if none of the title, description, or due date is provided in the given DTO.
   */
  @Put('/:taskId/edit')
  async updateTask(
    @Param('taskId') id: number,
    @Body() updateTaskDto: UpdateTaskDTO,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  /** Retrieves all tasks.
   * @returns An array of all tasks.
   */
  @Get('/task')
  async getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

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
  @Put('/:taskId/category')
  async updateTaskCategory(
    @Param('taskId') id: number,
    @Body('categoryId') newCategory: TaskCategory,
  ): Promise<Task> {
    if (!newCategory) {
      throw new BadRequestException('New category does not exist');
    }

    const updatedTask = await this.tasksService.updateTaskCategory(
      id,
      newCategory,
    );
    if (!updatedTask) {
      throw new BadRequestException(`No tasks exists with id ${id}`);
    }

    return updatedTask;
  }

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
