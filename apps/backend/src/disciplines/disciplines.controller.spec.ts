import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DisciplinesController } from './disciplines.controller';
import { DisciplinesService } from './disciplines.service';
import { Discipline } from './disciplines.entity';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { DISCIPLINE_VALUES } from './disciplines.constants';
import { CreateDisciplineRequestDto } from './dto/create-discipline.request.dto';

const mockDisciplinesService: Partial<DisciplinesService> = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockAuthService = {
  getUser: jest.fn(),
};

const mockUsersService = {
  find: jest.fn(),
};

const defaultDiscipline: Discipline = {
  id: 1,
  name: DISCIPLINE_VALUES.Nursing,
  admin_ids: [1, 2],
};

describe('DisciplinesController', () => {
  let controller: DisciplinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisciplinesController],
      providers: [
        {
          provide: DisciplinesService,
          useValue: mockDisciplinesService,
        },
        {
          provide: getRepositoryToken(Discipline),
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<DisciplinesController>(DisciplinesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all disciplines', async () => {
      const disciplines = [
        defaultDiscipline,
        {
          id: 2,
          name: DISCIPLINE_VALUES.MD,
          admin_ids: [3],
        },
      ];
      jest
        .spyOn(mockDisciplinesService, 'findAll')
        .mockResolvedValue(disciplines);

      const result = await controller.getAll();

      expect(result).toEqual(disciplines);
      expect(mockDisciplinesService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no disciplines exist', async () => {
      jest.spyOn(mockDisciplinesService, 'findAll').mockResolvedValue([]);

      const result = await controller.getAll();

      expect(result).toEqual([]);
      expect(mockDisciplinesService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should error out without information loss if the service throws an error', async () => {
      jest
        .spyOn(mockDisciplinesService, 'findAll')
        .mockRejectedValue(
          new Error('There was a problem retrieving the info'),
        );

      await expect(controller.getAll()).rejects.toThrow(
        'There was a problem retrieving the info',
      );
    });
  });

  describe('getOne', () => {
    it('should return a specific discipline', async () => {
      jest
        .spyOn(mockDisciplinesService, 'findOne')
        .mockResolvedValue(defaultDiscipline);

      const result = await controller.getOne('1');

      expect(result).toEqual(defaultDiscipline);
      expect(mockDisciplinesService.findOne).toHaveBeenCalledWith(1);
    });

    it('should return null if discipline is not found', async () => {
      jest.spyOn(mockDisciplinesService, 'findOne').mockResolvedValue(null);

      const result = await controller.getOne('999');

      expect(result).toBeNull();
      expect(mockDisciplinesService.findOne).toHaveBeenCalledWith(999);
    });

    it('should handle service errors when retrieving discipline', async () => {
      const errorMessage = 'There was a problem retrieving the info';
      jest
        .spyOn(mockDisciplinesService, 'findOne')
        .mockRejectedValue(new Error(errorMessage));

      await expect(controller.getOne('1')).rejects.toThrow(errorMessage);
    });

    it('should convert string id to number correctly', async () => {
      jest
        .spyOn(mockDisciplinesService, 'findOne')
        .mockResolvedValue(defaultDiscipline);

      const result = await controller.getOne('42');

      expect(result).toEqual(defaultDiscipline);
      expect(mockDisciplinesService.findOne).toHaveBeenCalledWith(42);
    });
  });

  describe('create', () => {
    it('should create a new discipline', async () => {
      const createDisciplineDto: CreateDisciplineRequestDto = {
        name: DISCIPLINE_VALUES.Nursing,
        admin_ids: [1, 2],
      };

      jest
        .spyOn(mockDisciplinesService, 'create')
        .mockResolvedValue(defaultDiscipline);

      const result = await controller.create(createDisciplineDto);

      expect(result).toEqual(defaultDiscipline);
      expect(mockDisciplinesService.create).toHaveBeenCalledWith(
        createDisciplineDto,
      );
    });

    it('should create a discipline with empty admin_ids array', async () => {
      const createDisciplineDto: CreateDisciplineRequestDto = {
        name: DISCIPLINE_VALUES.IT,
        admin_ids: [],
      };

      const disciplineWithEmptyAdmins: Discipline = {
        id: 3,
        name: DISCIPLINE_VALUES.IT,
        admin_ids: [],
      };

      jest
        .spyOn(mockDisciplinesService, 'create')
        .mockResolvedValue(disciplineWithEmptyAdmins);

      const result = await controller.create(createDisciplineDto);

      expect(result).toEqual(disciplineWithEmptyAdmins);
      expect(mockDisciplinesService.create).toHaveBeenCalledWith(
        createDisciplineDto,
      );
    });

    it('should handle service errors when creating discipline', async () => {
      const createDisciplineDto: CreateDisciplineRequestDto = {
        name: DISCIPLINE_VALUES.Nursing,
        admin_ids: [1, 2],
      };

      const errorMessage = 'Failed to create discipline';
      jest
        .spyOn(mockDisciplinesService, 'create')
        .mockRejectedValue(new Error(errorMessage));

      await expect(controller.create(createDisciplineDto)).rejects.toThrow(
        errorMessage,
      );
    });

    it('should create discipline with different discipline values', async () => {
      const createDisciplineDto: CreateDisciplineRequestDto = {
        name: DISCIPLINE_VALUES.MD,
        admin_ids: [5],
      };

      const mdDiscipline: Discipline = {
        id: 4,
        name: DISCIPLINE_VALUES.MD,
        admin_ids: [5],
      };

      jest
        .spyOn(mockDisciplinesService, 'create')
        .mockResolvedValue(mdDiscipline);

      const result = await controller.create(createDisciplineDto);

      expect(result).toEqual(mdDiscipline);
      expect(mockDisciplinesService.create).toHaveBeenCalledWith(
        createDisciplineDto,
      );
    });
  });
});
