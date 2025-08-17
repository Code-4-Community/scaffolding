import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './types/task.entity';
import { TasksService } from './task.service';
import { mockTask } from './task.controller.spec';
import { TaskCategory } from './types/category';
import { mockTasks } from './task.controller.spec';
import { mock } from 'jest-mock-extended';

const mockTaskRepository = mock<Repository<Task>>();

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
    category: TaskCategory.IN_PROGRESS,
  };

  beforeEach(async () => {
    mockTaskRepository.find.mockReset();
    mockTaskRepository.findOneBy.mockReset();
    mockTaskRepository.save.mockReset();
    mockTaskRepository.create.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
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

  /* Tests for remove labels from task by id */
});
