import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './task.service';
import { TasksController } from './task.controller';
import { Task } from './types/task.entity';
import { TaskCategory } from './types/category';

// Mock implementation for Task Service
export const mockTaskService: Partial<TasksService> = {
  createTask: jest.fn(),
};

const mockCreateTaskDTO = {
  title: 'Task 1',
  description: 'Desc 1',
  dueDate: new Date('2025-08-13'),
};

export const mockTask: Task = {
  id: 1,
  title: mockCreateTaskDTO.title,
  description: mockCreateTaskDTO.description,
  dateCreated: new Date(Date.now()),
  dueDate: mockCreateTaskDTO.dueDate,
  labels: [],
  category: TaskCategory.DRAFT,
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

  /* Tests for delete task by id */

  /* Tests for move task category by id */

  /* Tests for add labels to task by id */

  /* Tests for remove labels from task by id */
});
