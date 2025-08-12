import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './task.service';
import { TasksController } from './task.controller';
import { TaskCategory } from './types/category';
import { Task } from './types/task.entity';

// Mock implementation for Task Service
export const mockTasks: Task[] = [
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

export const mockTaskService: Partial<TasksService> = {
  getAllTasks: jest.fn(() => Promise.resolve(mockTasks)),
};

describe('TasksController', () => {
  let controller: TasksController;

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
  it('should return an array of tasks', async () => {
    expect(await controller.getAllTasks()).toEqual(mockTasks);
    expect(mockTaskService.getAllTasks).toHaveBeenCalled();
  });
  /* Tests for delete task by id */

  /* Tests for move task category by id */

  /* Tests for add labels to task by id */

  /* Tests for remove labels from task by id */
});
