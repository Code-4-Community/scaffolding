import { Task } from './types/task.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  /** Creates a new task. */

  /** Edits a task by its ID. */

  /** Retrieves all tasks. */
  async getAllTasks() {
    return this.taskRepository.find();
  }

  /** Deletes a task by its ID. */

  /** Move task category by its ID. */

  /** Add labels to task by its ID. */

  /** Remove labels from task by its ID. */
}
