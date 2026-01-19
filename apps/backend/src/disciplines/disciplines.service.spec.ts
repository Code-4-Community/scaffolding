import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DisciplinesService } from './disciplines.service';
import { Discipline } from './disciplines.entity';
import { DISCIPLINE_VALUES } from './disciplines.constants';
import { CreateDisciplineRequestDto } from './dto/create-discipline.request.dto';

describe('DisciplinesService', () => {
  let service: DisciplinesService;
  let repository: Repository<Discipline>;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockDiscipline1: Discipline = {
    id: 1,
    name: DISCIPLINE_VALUES.Nursing,
    admin_ids: [1, 2],
  };

  const mockDiscipline2: Discipline = {
    id: 2,
    name: DISCIPLINE_VALUES.MD,
    admin_ids: [3],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisciplinesService,
        {
          provide: getRepositoryToken(Discipline),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DisciplinesService>(DisciplinesService);
    repository = module.get<Repository<Discipline>>(
      getRepositoryToken(Discipline),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of disciplines', async () => {
      const mockDisciplines = [mockDiscipline1, mockDiscipline2];
      mockRepository.find.mockResolvedValue(mockDisciplines);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(mockDisciplines);
    });

    it('should return empty array when no disciplines exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should pass along any repo errors without information loss', async () => {
      mockRepository.find.mockRejectedValue(
        new Error('There was a problem retrieving the info'),
      );

      await expect(service.findAll()).rejects.toThrow(
        'There was a problem retrieving the info',
      );
    });
  });

  describe('findOne', () => {
    it('should return a single discipline', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockDiscipline1);

      const result = await service.findOne(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockDiscipline1);
    });

    it('should return null when discipline is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(result).toBeNull();
    });

    it('should pass along any repo errors without information loss', async () => {
      mockRepository.findOneBy.mockRejectedValue(
        new Error('There was a problem retrieving the info'),
      );

      await expect(service.findOne(1)).rejects.toThrow(
        'There was a problem retrieving the info',
      );
    });
  });

  describe('create', () => {
    it('should create and save a new discipline', async () => {
      const createDisciplineDto: CreateDisciplineRequestDto = {
        name: DISCIPLINE_VALUES.Nursing,
        admin_ids: [1, 2],
      };

      mockRepository.create.mockReturnValue(mockDiscipline1);
      mockRepository.save.mockResolvedValue(mockDiscipline1);

      const result = await service.create(createDisciplineDto);

      expect(repository.create).toHaveBeenCalledWith(createDisciplineDto);
      expect(repository.save).toHaveBeenCalledWith(mockDiscipline1);
      expect(result).toEqual(mockDiscipline1);
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

      mockRepository.create.mockReturnValue(disciplineWithEmptyAdmins);
      mockRepository.save.mockResolvedValue(disciplineWithEmptyAdmins);

      const result = await service.create(createDisciplineDto);

      expect(repository.create).toHaveBeenCalledWith(createDisciplineDto);
      expect(repository.save).toHaveBeenCalledWith(disciplineWithEmptyAdmins);
      expect(result).toEqual(disciplineWithEmptyAdmins);
    });
  });
});
