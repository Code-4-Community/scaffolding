import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './types/task.entity';
import { TasksService } from './task.service';
import { mockTask } from './task.controller.spec';

const mockTaskRepository: Partial<Repository<Task>> = {
  create: jest.fn().mockImplementation(async () => mockTask),
  save: jest.fn().mockImplementation(async () => mockTask),
};

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

  beforeEach(async () => {
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

  /* Tests for delete task by id */

  /* Tests for move task category by id */

  /* Tests for add labels to task by id */

  /* Tests for remove labels from task by id */
});
