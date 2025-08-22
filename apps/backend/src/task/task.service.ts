import { Task } from './types/task.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { TaskCategory } from './types/category';
import { UpdateTaskDTO } from './dtos/update-task.dto';
import { Label } from '../label/types/label.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
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
  async updateTask(id: number, updateTaskDto: UpdateTaskDTO) {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new BadRequestException(`No tasks exist with id ${id}`);
    }

    if (Object.keys(updateTaskDto).length === 0) {
      throw new BadRequestException(
        'At least one property (title, description, or dueDate) must be provided',
      );
    }

    Object.assign(task, updateTaskDto);
    if (!task.title) {
      throw new BadRequestException("The 'title' field cannot be null");
    }

    return this.taskRepository.save(task);
  }

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
  async addTaskLabels(taskId: number, labelIds: number[]) {
    // check that task actually exists
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['labels'],
    });

    // if doesn't, throw exception
    if (!task) {
      throw new BadRequestException(
        `Task with ID ${taskId} does not exist in database`,
      );
    }

    // checking that all labels are valid
    const labelsToAdd = await this.labelRepository.find({
      where: { id: In(labelIds) },
    });

    // Check if all requested label IDs exist
    const foundLabelIds = labelsToAdd.map((label) => label.id);
    const missingLabelIds = labelIds.filter(
      (id) => !foundLabelIds.includes(id),
    );

    if (missingLabelIds.length === 1) {
      throw new BadRequestException(
        `Label with ID ${missingLabelIds[0]} does not exist in database`,
      );
    } else if (missingLabelIds.length > 1) {
      throw new BadRequestException(
        `Labels with IDs ${missingLabelIds.join(
          ', ',
        )} do not exist in database`,
      );
    }

    // avoid duplicate labels
    const currentLabelIds = task.labels.map((label) => label.id);
    const newLabels = labelsToAdd.filter(
      (label) => !currentLabelIds.includes(label.id),
    );

    // Add new labels to the task
    task.labels = [...task.labels, ...newLabels];

    return this.taskRepository.save(task);
  }

  /** Remove labels from task by its ID. */
  async removeTaskLabels(taskId: number, labelIds: number[]) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['labels'], // will do the JOIN for us
    });
    if (!task) {
      throw new BadRequestException(
        `taskId with ID ${taskId} does not exist in database`,
      );
    }
    // validate that the labelIds are associated with the given task
    const currentLabelIds = task.labels.map((label) => label.id);
    const invalidLabelIds = labelIds.filter(
      (id) => !currentLabelIds.includes(id),
    );

    if (invalidLabelIds.length == 1) {
      throw new BadRequestException(
        `Label ID ${invalidLabelIds[0]} is not assigned to this task`,
      );
    } else if (invalidLabelIds.length > 1) {
      throw new BadRequestException(
        `Label IDs ${invalidLabelIds.join(', ')} are not assigned to this task`,
      );
    }

    // they are valid, now remove
    task.labels = task.labels.filter((label) => !labelIds.includes(label.id));
    return this.taskRepository.save(task);
  }
}
