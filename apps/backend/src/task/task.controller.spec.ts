import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './task.service';
import { TasksController } from './task.controller';
import { Task } from './types/task.entity';
import { TaskCategory } from './types/category';
import { BadRequestException } from '@nestjs/common';
import { Label } from '../label/types/label.entity';

const mockCreateTaskDTO = {
  title: 'Task 1',
  description: 'Desc 1',
  dueDate: new Date('2025-08-13'),
};

export const mockTask = {
  id: 1,
  title: 'Task 1',
  description: 'Desc 1',
  dateCreated: new Date(),
  dueDate: new Date(),
  labels: [],
  category: TaskCategory.TODO,
};

// Mock implementation for Task Service
export const mockTasks: Task[] = [
  mockTask,
  {
    id: 2,
    title: 'Task 2',
    description: 'Desc 2',
    dateCreated: new Date('2025-02-11T00:00:00Z'),
    dueDate: new Date('2025-02-25T00:00:00Z'),
    labels: [],
    category: TaskCategory.IN_PROGRESS,
  },
];

export const mockUpdatedTaskCategory: Task = {
  ...mockTask,
  category: TaskCategory.IN_PROGRESS,
};

export const mockTaskService: Partial<TasksService> = {
  updateTaskCategory: jest.fn((id: number, newCategory: TaskCategory) =>
    Promise.resolve(mockUpdatedTaskCategory),
  ),
  getAllTasks: jest.fn(() => Promise.resolve(mockTasks)),
  createTask: jest.fn(),
  removeTaskLabels: jest.fn(),
};

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    jest.clearAllMocks();
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
  describe('POST /tasks/task', () => {
    it('should create a task and return it', async () => {
      jest.spyOn(mockTaskService, 'createTask').mockResolvedValue(mockTask);

      const res = await controller.createTask(mockCreateTaskDTO);

      expect(res).toEqual(mockTask);
      expect(mockTaskService.createTask).toHaveBeenCalledWith(
        mockCreateTaskDTO,
      );
    });
  });

  /* Tests for edit task by id */

  /* Tests for retrieve all tasks */
  it('should return an array of tasks', async () => {
    expect(await controller.getAllTasks()).toEqual(mockTasks);
    expect(mockTaskService.getAllTasks).toHaveBeenCalled();
  });
  /* Tests for delete task by id */

  /* Tests for move task category by id */
  it('should successfully update task category when valid data is provided', async () => {
    const taskId = mockTask.id;
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
  describe('POST /tasks/:taskId/remove_labels', () => {
    it('should successfully remove labels from task', async () => {
      const taskId = 1;
      const labelIds = [10, 20];
      const mockTaskAfterRemoval: Task = {
        id: taskId,
        title: 'Test Task',
        description: null,
        dateCreated: new Date('2024-01-01'),
        dueDate: new Date('2024-12-31'),
        category: TaskCategory.DRAFT,
        labels: [{ id: 30, name: 'Label 3' } as Label],
      };
      // mock service method output
      jest
        .spyOn(mockTaskService, 'removeTaskLabels')
        .mockResolvedValue(mockTaskAfterRemoval);

      const result = await controller.removeTaskLabels(taskId, labelIds);

      expect(result).toEqual(mockTaskAfterRemoval);
      expect(mockTaskService.removeTaskLabels).toHaveBeenCalledWith(
        taskId,
        labelIds,
      );
    });

    it('should throw BadRequestException when taskId does not exist', async () => {
      const taskId = null;
      const labelIds = [10, 20];

      await expect(
        controller.removeTaskLabels(taskId, labelIds),
      ).rejects.toThrow(
        new BadRequestException("taskId with ID null doesn't exist"),
      );

      expect(mockTaskService.removeTaskLabels).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when labelIds do not exist', async () => {
      const taskId = 1;
      const labelIds = [10, null, 20];

      await expect(
        controller.removeTaskLabels(taskId, labelIds),
      ).rejects.toThrow(
        new BadRequestException('at least 1 label id does not exist'),
      );

      expect(mockTaskService.removeTaskLabels).not.toHaveBeenCalled();
    });

    it('should call service when all validations pass', async () => {
      const taskId = 1;
      const labelIds = [10, 20, 30];
      const mockTaskAfterRemoval: Task = {
        id: taskId,
        title: 'Test Task',
        description: null,
        dateCreated: new Date('2024-01-01'),
        dueDate: new Date('2024-12-31'),
        category: TaskCategory.DRAFT,
        labels: [],
      };

      jest
        .spyOn(mockTaskService, 'removeTaskLabels')
        .mockResolvedValue(mockTaskAfterRemoval);

      const result = await controller.removeTaskLabels(taskId, labelIds);

      expect(mockTaskService.removeTaskLabels).toHaveBeenCalledWith(
        taskId,
        labelIds,
      );
      expect(result).toEqual(mockTaskAfterRemoval);
    });
  });
});
