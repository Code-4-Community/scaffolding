import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './types/task.entity';
import { TasksService } from './task.service';
import { mockTask } from './task.controller.spec';
import { TaskCategory } from './types/category';
import { mockTasks } from './task.controller.spec';
import { mock } from 'jest-mock-extended';
import { BadRequestException } from '@nestjs/common';
import { Label } from '../label/types/label.entity';

const mockTaskRepository = mock<Repository<Task>>();
const mockLabelRepository = mock<Repository<Label>>();

describe('TasksService', () => {
  let service: TasksService;

  const mockValidCreateTaskDTO = {
    title: 'Task 1',
    description: 'Desc 1',
    dueDate: new Date('2025-08-13'),
  };

  const mockInvalidCreateTaskDTO = {
    title: '',
    description: 'Desc 2',
    dueDate: new Date('2025-03-13'),
  };

  const mockUpdateTaskDtoNoDesc = {
    title: 'Updated Test Task',
    dueDate: new Date('2025-07-04'),
  };

  const mockUpdateTaskDtoNoTitle = {
    title: '',
    description: 'Desc 2',
    dueDate: new Date('2025-03-13'),
  };

  const mockUpdateTaskDtoNothing = {};

  const mockCurrentTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test description',
    dateCreated: new Date('2024-01-01'),
    dueDate: new Date('2024-12-31'),
    labels: [],
    category: TaskCategory.DRAFT,
  };

  const mockUpdatedTask: Task = {
    ...mockCurrentTask,
    title: mockUpdateTaskDtoNoDesc.title,
    dueDate: mockUpdateTaskDtoNoDesc.dueDate,
    category: TaskCategory.IN_PROGRESS,
  };

  beforeEach(async () => {
    mockTaskRepository.find.mockReset();
    mockTaskRepository.findOne.mockReset();
    mockTaskRepository.findOneBy.mockReset();
    mockTaskRepository.save.mockReset();
    mockTaskRepository.create.mockReset();
    mockLabelRepository.find.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: getRepositoryToken(Label),
          useValue: mockLabelRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /* Tests for create new task */
  describe('createTask', () => {
    it('should save a valid task into the database', async () => {
      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(mockTask);

      const res = await service.createTask(mockValidCreateTaskDTO);

      expect(res).toEqual(mockTask);
    });
    it('should throw a BadRequestException when given bad data', async () => {
      expect(async () => {
        await service.createTask(mockInvalidCreateTaskDTO);
      }).rejects.toThrow("The 'title' field cannot be null");
    });
  });

  /* Tests for edit task by id */
  describe('updateTask', () => {
    it('should save a valid updated task into the database', async () => {
      const taskId = mockCurrentTask.id;
      const { title: newTitle, dueDate: newDueDate } = mockUpdateTaskDtoNoDesc;

      mockTaskRepository.findOneBy.mockResolvedValue(mockCurrentTask);
      mockTaskRepository.save.mockResolvedValue(mockUpdatedTask);

      const res = await service.updateTask(taskId, mockUpdateTaskDtoNoDesc);

      expect(mockTaskRepository.findOneBy).toHaveBeenCalledWith({ id: taskId });
      expect(mockTaskRepository.save).toHaveBeenCalledWith({
        ...mockCurrentTask,
        title: newTitle,
        dueDate: newDueDate,
      });
      expect(res).toEqual(mockUpdatedTask);
    });

    it('should throw a BadRequestException if the title is null', async () => {
      const taskId = mockCurrentTask.id;

      mockTaskRepository.findOneBy.mockResolvedValue(mockCurrentTask);

      expect(async () => {
        await service.updateTask(taskId, mockUpdateTaskDtoNoTitle);
      }).rejects.toThrow("The 'title' field cannot be null");
    });

    it('should throw a BadRequestException if nothing is provided in the given updateTaskDto', async () => {
      const taskId = mockCurrentTask.id;

      mockTaskRepository.findOneBy.mockResolvedValue(mockCurrentTask);

      expect(async () => {
        await service.updateTask(taskId, mockUpdateTaskDtoNothing);
      }).rejects.toThrow(
        'At least one property (title, description, or dueDate) must be provided',
      );
    });

    it('should throw a BadRequestException if the task with the given id does not exist', async () => {
      expect(async () => {
        await service.updateTask(999, mockUpdateTaskDtoNoDesc);
      }).rejects.toThrow('No tasks exist with id 999');
    });
  });

  /* Tests for retrieve all tasks */
  it('should return all tasks', async () => {
    mockTaskRepository.find.mockResolvedValue(mockTasks);

    const taskDataReturned = await service.getAllTasks();
    expect(taskDataReturned[0]).toEqual(mockTasks[0]);
    expect(taskDataReturned[1]).toEqual(mockTasks[1]);
  });

  /* Tests for delete task by id */

  /* Tests for move task category by id */
  it('should return null when task does not exist', async () => {
    const taskId = 999;
    const newCategory = TaskCategory.COMPLETED;

    mockTaskRepository.findOneBy.mockResolvedValue(null);

    const result = await service.updateTaskCategory(taskId, newCategory);

    expect(mockTaskRepository.findOneBy).toHaveBeenCalledWith({ id: taskId });
    expect(mockTaskRepository.save).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should successfully update task category when task exists', async () => {
    const taskId = mockCurrentTask.id;
    const newCategory = TaskCategory.IN_PROGRESS;

    mockTaskRepository.findOneBy.mockResolvedValue(mockCurrentTask);
    mockTaskRepository.save.mockResolvedValue(mockUpdatedTask);

    const result = await service.updateTaskCategory(taskId, newCategory);

    expect(mockTaskRepository.findOneBy).toHaveBeenCalledWith({ id: taskId });
    expect(mockTaskRepository.save).toHaveBeenCalledWith({
      ...mockCurrentTask,
      category: newCategory,
    });
    expect(result).toEqual(mockUpdatedTask);
  });
  /* Tests for add labels to task by id */
  describe('addTaskLabels', () => {
    beforeEach(async () => {
      mockTaskRepository.findOne.mockReset();
      mockTaskRepository.save.mockReset();
      mockLabelRepository.find.mockReset();
    });

    it('should successfully add labels to a task', async () => {
      const taskId = 1;
      const labelIdsToAdd = [10, 20];

      const mockTask: Task = {
        id: taskId,
        title: 'Test Task',
        description: null,
        dateCreated: new Date('2024-01-01'),
        dueDate: new Date('2024-12-31'),
        category: TaskCategory.DRAFT,
        labels: [{ id: 30, name: 'Label 3' } as Label],
      };

      const labelsToAdd: Label[] = [
        { id: 10, name: 'Label 1' } as Label,
        { id: 20, name: 'Label 2' } as Label,
      ];

      const expectedTaskAfterAddition: Task = {
        ...mockTask,
        labels: [
          { id: 30, name: 'Label 3' } as Label,
          { id: 10, name: 'Label 1' } as Label,
          { id: 20, name: 'Label 2' } as Label,
        ],
      };

      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockLabelRepository.find.mockResolvedValue(labelsToAdd);
      mockTaskRepository.save.mockResolvedValue(expectedTaskAfterAddition);

      const result = await service.addTaskLabels(taskId, labelIdsToAdd);

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
        relations: ['labels'],
      });

      expect(mockLabelRepository.find).toHaveBeenCalledWith({
        where: { id: expect.anything() },
      });

      expect(result).toEqual(expectedTaskAfterAddition);
      expect(result.labels).toHaveLength(3);
    });

    it('should not add duplicate labels', async () => {
      const taskId = 1;
      const labelIdsToAdd = [10, 20]; // 10 already exists

      const mockTask: Task = {
        id: taskId,
        title: 'Test Task',
        description: null,
        dateCreated: new Date('2024-01-01'),
        dueDate: new Date('2024-12-31'),
        category: TaskCategory.DRAFT,
        labels: [{ id: 10, name: 'Label 1' } as Label], // Label 10 already exists
      };

      const labelsToAdd: Label[] = [
        { id: 10, name: 'Label 1' } as Label,
        { id: 20, name: 'Label 2' } as Label,
      ];

      const expectedTaskAfterAddition: Task = {
        ...mockTask,
        labels: [
          { id: 10, name: 'Label 1' } as Label,
          { id: 20, name: 'Label 2' } as Label, // Only label 20 should be added
        ],
      };

      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockLabelRepository.find.mockResolvedValue(labelsToAdd);
      mockTaskRepository.save.mockResolvedValue(expectedTaskAfterAddition);

      const result = await service.addTaskLabels(taskId, labelIdsToAdd);

      expect(result.labels).toHaveLength(2);
    });

    it('should throw BadRequestException when task does not exist', async () => {
      const nonExistentTaskId = 999;
      const labelIdsToAdd = [10, 20];

      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(
        service.addTaskLabels(nonExistentTaskId, labelIdsToAdd),
      ).rejects.toThrow(
        new BadRequestException(
          `Task with ID ${nonExistentTaskId} does not exist in database`,
        ),
      );

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: nonExistentTaskId },
        relations: ['labels'],
      });

      expect(mockLabelRepository.find).not.toHaveBeenCalled();
      expect(mockTaskRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when one label does not exist', async () => {
      const taskId = 1;
      const labelIdsToAdd = [10, 999]; // 999 doesn't exist

      const mockTask: Task = {
        id: taskId,
        title: 'Test Task',
        description: null,
        dateCreated: new Date('2024-01-01'),
        dueDate: new Date('2024-12-31'),
        category: TaskCategory.DRAFT,
        labels: [],
      };

      const existingLabels: Label[] = [{ id: 10, name: 'Label 1' } as Label];

      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockLabelRepository.find.mockResolvedValue(existingLabels);

      await expect(
        service.addTaskLabels(taskId, labelIdsToAdd),
      ).rejects.toThrow(
        new BadRequestException('Label with ID 999 does not exist in database'),
      );

      expect(mockTaskRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when multiple labels do not exist', async () => {
      const taskId = 1;
      const labelIdsToAdd = [10, 998, 999]; // 998 and 999 don't exist

      const mockTask: Task = {
        id: taskId,
        title: 'Test Task',
        description: null,
        dateCreated: new Date('2024-01-01'),
        dueDate: new Date('2024-12-31'),
        category: TaskCategory.DRAFT,
        labels: [],
      };

      const existingLabels: Label[] = [{ id: 10, name: 'Label 1' } as Label];

      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockLabelRepository.find.mockResolvedValue(existingLabels);

      await expect(
        service.addTaskLabels(taskId, labelIdsToAdd),
      ).rejects.toThrow(
        new BadRequestException(
          'Labels with IDs 998, 999 do not exist in database',
        ),
      );

      expect(mockTaskRepository.save).not.toHaveBeenCalled();
    });
  });

  /* Tests for remove labels from task by id */

  describe('removeTaskLabels', () => {
    // setup/reset mock service
    beforeEach(async () => {
      mockTaskRepository.findOne.mockReset();
      mockTaskRepository.save.mockReset();
    });

    it('should successfully remove 2 valid labels from task', async () => {
      const taskId = 1;
      const labelIdsToRemove = [10, 20];

      const mockTask: Task = {
        id: taskId,
        title: 'Test Task',
        description: null,
        dateCreated: new Date('2024-01-01'),
        dueDate: new Date('2024-12-31'),
        category: TaskCategory.DRAFT,
        labels: [
          { id: 10, name: 'Label 1' } as Label,
          { id: 20, name: 'Label 2' } as Label,
          { id: 30, name: 'Label 3' } as Label,
        ],
      };

      const expectedTaskAfterRemoval: Task = {
        id: taskId,
        title: 'Test Task',
        description: null,
        dateCreated: new Date('2024-01-01'),
        dueDate: new Date('2024-12-31'),
        category: TaskCategory.DRAFT,
        labels: [{ id: 30, name: 'Label 3' } as Label],
      };

      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(expectedTaskAfterRemoval);

      const result = await service.removeTaskLabels(taskId, labelIdsToRemove);

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
        relations: ['labels'],
      });

      // verify the task was modified correctly before saving
      expect(mockTaskRepository.save).toHaveBeenCalledWith(
        expectedTaskAfterRemoval,
      );

      expect(result).toEqual(expectedTaskAfterRemoval);
      expect(result.labels).toHaveLength(1);
      expect(result.labels[0].id).toBe(30);
    });

    it('should throw BadRequestException when one label is invalid', async () => {
      const taskId = 1;
      const labelIdsToRemove = [10, 99]; // 10 is valid, 99 is invalid

      const mockTask: Task = {
        id: taskId,
        title: 'Test Task',
        description: null,
        dateCreated: new Date('2024-01-01'),
        dueDate: new Date('2024-12-31'),
        category: TaskCategory.DRAFT,
        labels: [
          { id: 10, name: 'Label 1' } as Label,
          { id: 20, name: 'Label 2' } as Label,
        ],
      };

      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      await expect(
        service.removeTaskLabels(taskId, labelIdsToRemove),
      ).rejects.toThrow('Label ID 99 is not assigned to this task');

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
        relations: ['labels'],
      });

      // verify save was never called since validation failed
      expect(mockTaskRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when taskId does not exist', async () => {
      const nonExistentTaskId = 999;
      const labelIdsToRemove = [10, 20];

      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(
        service.removeTaskLabels(nonExistentTaskId, labelIdsToRemove),
      ).rejects.toThrow(
        new BadRequestException(
          'taskId with ID 999 does not exist in database',
        ),
      );

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: nonExistentTaskId },
        relations: ['labels'],
      });

      expect(mockTaskRepository.save).not.toHaveBeenCalled();
    });
  });
});
