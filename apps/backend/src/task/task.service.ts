import { Task } from './types/task.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dtos/create-task.dto';

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
}
