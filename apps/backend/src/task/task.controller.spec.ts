import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './task.service';
import { TasksController } from './task.controller';
import { TaskCategory } from './types/category';
import { BadRequestException } from '@nestjs/common';
import { Task } from './types/task.entity';

export const mockTasks = {
  id: 1,
  title: 'Task 1',
  description: 'Desc 1',
  dateCreated: new Date(),
  dueDate: new Date(),
  labels: [],
  category: TaskCategory.TODO,
};

export const mockUpdatedTaskCategory: Task = {
  ...mockTasks,
  category: TaskCategory.IN_PROGRESS,
};

export const mockTaskService: Partial<TasksService> = {
  updateTaskCategory: jest.fn((id: number, newCategory: TaskCategory) =>
    Promise.resolve(mockUpdatedTaskCategory),
  ),
};

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /* Tests for create new task */

  /* Tests for edit task by id */

  /* Tests for retrieve all tasks */

  /* Tests for delete task by id */

  /* Tests for move task category by id */
  it('should successfully update task category when valid data is provided', async () => {
    const taskId = mockTasks.id;
    const newCategory = TaskCategory.IN_PROGRESS;

    const result = await controller.updateTaskCategory(taskId, newCategory);

    expect(result).toEqual(mockUpdatedTaskCategory);
    expect(mockTaskService.updateTaskCategory).toHaveBeenCalledWith(
      taskId,
      newCategory,
    );
  });

  it('should throw BadRequestException when task does not exist in DB', async () => {
    const taskId = 0;
    const newCategory = TaskCategory.COMPLETED;

    (mockTaskService.updateTaskCategory as jest.Mock).mockResolvedValue(null);

    await expect(
      controller.updateTaskCategory(taskId, newCategory),
    ).rejects.toThrow(BadRequestException);

    expect(mockTaskService.updateTaskCategory).toHaveBeenCalledWith(
      taskId,
      newCategory,
    );
  });

  /* Tests for add labels to task by id */

  /* Tests for remove labels from task by id */
});
