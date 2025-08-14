import { Task } from './types/task.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskCategory } from './types/category';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  /** Creates a new task. */

  /** Edits a task by its ID. */

  /** Retrieves all tasks. */

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
}
