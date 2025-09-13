import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './task.service';
import { TasksController } from './task.controller';
import { Task } from './types/task.entity';
import { TaskCategory } from './types/category';
import { BadRequestException } from '@nestjs/common';

const mockCreateTaskDTO = {
  title: 'Task 1',
  description: 'Desc 1',
  dueDate: new Date('2025-08-13'),
  category: TaskCategory.DRAFT,
};

const mockUpdateTaskDTO = {
  title: 'Updated Task 1',
  description: 'Updated Desc 1',
  dueDate: new Date('2026-04-01'),
  category: TaskCategory.DRAFT,
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

export const mockGeneralUpdatedTask = {
  ...mockTask,
  title: 'Updated Task 1',
  description: 'Updated Desc 1',
  dueDate: new Date('2026-04-01'),
};

export const mockTaskService: Partial<TasksService> = {
  updateTaskCategory: jest.fn((id: number, newCategory: TaskCategory) =>
    Promise.resolve(mockUpdatedTaskCategory),
  ),
  getAllTasks: jest.fn(() => Promise.resolve(mockTasks)),
  createTask: jest.fn(),
  addTaskLabels: jest.fn(),
  removeTaskLabels: jest.fn(),
  updateTask: jest.fn(),
  getTaskById: jest.fn(() => Promise.resolve(mockTask)),
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
  describe('POST /tasks', () => {
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
  describe('PUT /tasks/:taskId/edit', () => {
    it('should update the task with the given id and return it', async () => {
      jest
        .spyOn(mockTaskService, 'updateTask')
        .mockResolvedValue(mockGeneralUpdatedTask);

      const res = await controller.updateTask(1, mockUpdateTaskDTO);

      expect(res).toEqual(mockGeneralUpdatedTask);
      expect(mockTaskService.updateTask).toHaveBeenCalledWith(
        1,
        mockUpdateTaskDTO,
      );
    });
  });

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
  describe('POST /tasks/add_labels', () => {
    it('should call service with correct parameters and return the result', async () => {
      const updateLabelsDto = {
        // actual schema doesn't matter here
        taskId: 1,
        labelIds: [10, 20],
      };
      const mockServiceResponse = { ...mockTask, labels: [] };

      jest
        .spyOn(mockTaskService, 'addTaskLabels')
        .mockResolvedValue(mockServiceResponse);

      const result = await controller.addTaskLabels(updateLabelsDto);

      expect(mockTaskService.addTaskLabels).toHaveBeenCalledWith(
        updateLabelsDto.taskId,
        updateLabelsDto.labelIds,
      );
      expect(result).toBe(mockServiceResponse);
    });
  });

  /* Tests for remove labels from task by id */
  describe('POST /tasks/remove_labels', () => {
    it('should call service with correct parameters and return the result', async () => {
      const updateLabelsDto = {
        taskId: 1,
        labelIds: [10, 20],
      };
      const mockServiceResponse = { ...mockTask, labels: [] };

      jest
        .spyOn(mockTaskService, 'removeTaskLabels')
        .mockResolvedValue(mockServiceResponse);

      const result = await controller.removeTaskLabels(updateLabelsDto);

      expect(mockTaskService.removeTaskLabels).toHaveBeenCalledWith(
        updateLabelsDto.taskId,
        updateLabelsDto.labelIds,
      );
      expect(result).toBe(mockServiceResponse);
    });
  });

  describe('GET /tasks/:taskId', () => {
    it('should return the task with the given ID', async () => {
      jest.spyOn(mockTaskService, 'getTaskById').mockResolvedValue(mockTask);

      const res = await controller.getTaskById(1);

      expect(res).toEqual(mockTask);
      expect(mockTaskService.getTaskById).toHaveBeenCalledWith(1);
    });
  });
});
