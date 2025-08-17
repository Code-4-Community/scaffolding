import { Task } from './types/task.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { TaskCategory } from './types/category';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // Saves a new task to the 'tasks' table using the given CreateTaskDTO
  async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
    if (!createTaskDto.title) {
      throw new BadRequestException("The 'title' field cannot be null");
    }

    const newTask = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(newTask);
  }
  /** Edits a task by its ID. */

  /** Retrieves all tasks. */
  async getAllTasks() {
    return this.taskRepository.find();
  }

  /** Deletes a task by its ID. */

  /** Move task category by its ID. */
  async updateTaskCategory(id: number, newCategory: TaskCategory) {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      return null;
    }

    task.category = newCategory;
    return this.taskRepository.save(task);
  }

  /** Add labels to task by its ID. */

  /** Remove labels from task by its ID. */
  async deleteTask(id: number): Promise<DeleteResult> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new BadRequestException(`Task with id ${id} does not exist`);
    }
    return this.taskRepository.delete(task);
  }
}
