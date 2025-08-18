import { Task } from './types/task.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { TaskCategory } from './types/category';
import { Label } from '../label/types/label.entity';
import { Simulate } from 'react-dom/test-utils';
import invalid = Simulate.invalid;

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
  async removeTaskLabels(taskId: number, labelIds: number[]) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['labels'], // will do the JOIN for us
    });
    if (!task) {
      throw new BadRequestException('taskId does not exist in database');
    }
    // validate that the labelIds are associated with the given task
    const currentLabelIds = task.labels.map((label) => label.id);
    const invalidLabelIds = labelIds.filter(
      (id) => !currentLabelIds.includes(id),
    );

    if (invalidLabelIds.length > 0) {
      throw new BadRequestException(
        `Label IDs ${invalidLabelIds.join(', ')} are not assigned to this task`,
      );
    }

    // they are valid, now remove
    task.labels = task.labels.filter((label) => !labelIds.includes(label.id));
    return this.taskRepository.save(task);
  }
}
