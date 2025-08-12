import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './types/task.entity';
import { TasksService } from './task.service';
import { TaskCategory } from './types/category';

const mockTaskRepository = mock<Repository<Task>>();

describe('TasksService', () => {
  let service: TasksService;

  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Desc 1',
      dateCreated: new Date('2025-02-10T00:00:00Z'),
      dueDate: new Date('2025-02-20T00:00:00Z'),
      labels: [],
      category: TaskCategory.TODO,
    },
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
    const result = await service.getAllTasks();

    expect(result).toEqual(mockTasks);
    expect(mockTaskRepository.find).toHaveBeenCalledTimes(1);
  });

  /* Tests for delete task by id */

  /* Tests for move task category by id */

  /* Tests for add labels to task by id */

  /* Tests for remove labels from task by id */
});
