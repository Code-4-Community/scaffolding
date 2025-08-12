import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './types/task.entity';
import { TasksService } from './task.service';
import { TaskCategory } from './types/category';
import { mockTasks } from './task.controller.spec';

const mockTaskRepository = mock<Repository<Task>>();
mockTaskRepository.find.mockResolvedValue(mockTasks);

describe('TasksService', () => {
  let service: TasksService;

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

  /* Tests for edit task by id */

  /* Tests for retrieve all tasks */
  it('should return all tasks', async () => {
    const taskDataReturned = await service.getAllTasks();
    expect(taskDataReturned[0]).toEqual(mockTasks[0]);
    expect(taskDataReturned[1]).toEqual(mockTasks[1]);
  });

  /* Tests for delete task by id */

  /* Tests for move task category by id */

  /* Tests for add labels to task by id */

  /* Tests for remove labels from task by id */
});
