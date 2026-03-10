import { Test, TestingModule } from '@nestjs/testing';
import { AnthologyController } from './anthology.controller';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { AgeCategory, AnthologyStatus, AnthologyPubLevel } from './types';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import {
  FilterByAgeCategoryDto,
  FilterByPubDateDto,
  FilterByStringDto,
} from './dtos/filter-anthology.dto';

const mockAnthology1: Anthology = {
  id: 1,
  title: 'Alpha Anthology',
  byline: '',
  subtitle: undefined,
  description: 'desc',
  genres: ['mystery'],
  themes: [],
  triggers: [],
  publishedDate: new Date('2020-01-01'),
  programs: ['after-school'],
  sponsors: [],
  status: AnthologyStatus.CAN_BE_SHARED,
  ageCategory: AgeCategory.YA,
  pubLevel: AnthologyPubLevel.ZINE,
  photoUrl: '',
  isbn: '',
  shopifyUrl: '',
  stories: [],
  inventoryHoldings: [],
  productionInfo: null,
  omchaiAssignments: [],
};

const mockAnthology2: Anthology = {
  id: 2,
  title: 'Beta Anthology',
  byline: '',
  subtitle: undefined,
  description: 'desc',
  genres: ['fiction'],
  themes: [],
  triggers: [],
  publishedDate: new Date('2022-06-15'),
  programs: ['summer'],
  sponsors: [],
  status: AnthologyStatus.CAN_BE_SHARED,
  ageCategory: AgeCategory.YA,
  pubLevel: AnthologyPubLevel.CHAPBOOK,
  photoUrl: '',
  isbn: '',
  shopifyUrl: '',
  stories: [],
  inventoryHoldings: [],
  productionInfo: null,
  omchaiAssignments: [],
};

describe('AnthologyController', () => {
  let controller: AnthologyController;

  const mockAnthologyService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    findAllSortedByTitle: jest.fn(),
    findAllSortedByDateRecent: jest.fn(),
    findAllSortedByDateOldest: jest.fn(),
    findByAgeCategory: jest.fn(),
    findByPubDateRange: jest.fn(),
    findByGenre: jest.fn(),
    findByProgram: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnthologyController],
      providers: [
        CurrentUserInterceptor,
        {
          provide: AuthService,
          useValue: { getUser: jest.fn() },
        },
        {
          provide: UsersService,
          useValue: { find: jest.fn() },
        },
        {
          provide: AnthologyService,
          useValue: mockAnthologyService,
        },
      ],
    }).compile();

    controller = module.get<AnthologyController>(AnthologyController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllByTitle', () => {
    it('should return anthologies sorted by title', async () => {
      mockAnthologyService.findAllSortedByTitle.mockResolvedValue([
        mockAnthology1,
        mockAnthology2,
      ]);
      const result = await controller.getAllByTitle();
      expect(result).toEqual([mockAnthology1, mockAnthology2]);
      expect(mockAnthologyService.findAllSortedByTitle).toHaveBeenCalled();
    });

    it('should return empty array when no anthologies', async () => {
      mockAnthologyService.findAllSortedByTitle.mockResolvedValue([]);
      const result = await controller.getAllByTitle();
      expect(result).toEqual([]);
    });
  });

  describe('getAllByDateRecent', () => {
    it('should return anthologies sorted by date newest first', async () => {
      mockAnthologyService.findAllSortedByDateRecent.mockResolvedValue([
        mockAnthology2,
        mockAnthology1,
      ]);
      const result = await controller.getAllByDateRecent();
      expect(result).toEqual([mockAnthology2, mockAnthology1]);
      expect(mockAnthologyService.findAllSortedByDateRecent).toHaveBeenCalled();
    });

    it('should return empty array when no anthologies', async () => {
      mockAnthologyService.findAllSortedByDateRecent.mockResolvedValue([]);
      const result = await controller.getAllByDateRecent();
      expect(result).toEqual([]);
    });
  });

  describe('getAllByDateOldest', () => {
    it('should return anthologies sorted by date oldest first', async () => {
      mockAnthologyService.findAllSortedByDateOldest.mockResolvedValue([
        mockAnthology1,
        mockAnthology2,
      ]);
      const result = await controller.getAllByDateOldest();
      expect(result).toEqual([mockAnthology1, mockAnthology2]);
      expect(mockAnthologyService.findAllSortedByDateOldest).toHaveBeenCalled();
    });

    it('should return empty array when no anthologies', async () => {
      mockAnthologyService.findAllSortedByDateOldest.mockResolvedValue([]);
      const result = await controller.getAllByDateOldest();
      expect(result).toEqual([]);
    });
  });

  describe('getByAgeCategory', () => {
    it('should return anthologies matching age category', async () => {
      const dto: FilterByAgeCategoryDto = { value: AgeCategory.YA };
      mockAnthologyService.findByAgeCategory.mockResolvedValue([
        mockAnthology1,
        mockAnthology2,
      ]);
      const result = await controller.getByAgeCategory(dto);
      expect(result).toEqual([mockAnthology1, mockAnthology2]);
      expect(mockAnthologyService.findByAgeCategory).toHaveBeenCalledWith(
        AgeCategory.YA,
      );
    });

    it('should return empty array when no matching anthologies', async () => {
      const dto: FilterByAgeCategoryDto = { value: AgeCategory.YA };
      mockAnthologyService.findByAgeCategory.mockResolvedValue([]);
      const result = await controller.getByAgeCategory(dto);
      expect(result).toEqual([]);
    });
  });

  describe('getByPubDateRange', () => {
    it('should return anthologies in date range', async () => {
      const dto: FilterByPubDateDto = {
        start: '2020-01-01',
        end: '2022-12-31',
      };
      mockAnthologyService.findByPubDateRange.mockResolvedValue([
        mockAnthology1,
        mockAnthology2,
      ]);
      const result = await controller.getByPubDateRange(dto);
      expect(result).toEqual([mockAnthology1, mockAnthology2]);
      expect(mockAnthologyService.findByPubDateRange).toHaveBeenCalledWith(
        '2020-01-01',
        '2022-12-31',
      );
    });

    it('should return empty array when no anthologies in range', async () => {
      const dto: FilterByPubDateDto = {
        start: '2030-01-01',
        end: '2031-01-01',
      };
      mockAnthologyService.findByPubDateRange.mockResolvedValue([]);
      const result = await controller.getByPubDateRange(dto);
      expect(result).toEqual([]);
    });
  });

  describe('getByGenre', () => {
    it('should return anthologies matching genre (lowercase)', async () => {
      const dto: FilterByStringDto = { value: 'mystery' };
      mockAnthologyService.findByGenre.mockResolvedValue([mockAnthology1]);
      const result = await controller.getByGenre(dto);
      expect(result).toEqual([mockAnthology1]);
      expect(mockAnthologyService.findByGenre).toHaveBeenCalledWith('mystery');
    });

    it('should call service with same value regardless of case (Mystery)', async () => {
      const dto: FilterByStringDto = { value: 'Mystery' };
      mockAnthologyService.findByGenre.mockResolvedValue([mockAnthology1]);
      await controller.getByGenre(dto);
      expect(mockAnthologyService.findByGenre).toHaveBeenCalledWith('Mystery');
    });

    it('should call service with same value regardless of case (MYSTERY)', async () => {
      const dto: FilterByStringDto = { value: 'MYSTERY' };
      mockAnthologyService.findByGenre.mockResolvedValue([mockAnthology1]);
      await controller.getByGenre(dto);
      expect(mockAnthologyService.findByGenre).toHaveBeenCalledWith('MYSTERY');
    });

    it('should return empty array when no matching anthologies', async () => {
      const dto: FilterByStringDto = { value: 'nonexistent' };
      mockAnthologyService.findByGenre.mockResolvedValue([]);
      const result = await controller.getByGenre(dto);
      expect(result).toEqual([]);
    });
  });

  describe('getByProgram', () => {
    it('should return anthologies matching program', async () => {
      const dto: FilterByStringDto = { value: 'after-school' };
      mockAnthologyService.findByProgram.mockResolvedValue([mockAnthology1]);
      const result = await controller.getByProgram(dto);
      expect(result).toEqual([mockAnthology1]);
      expect(mockAnthologyService.findByProgram).toHaveBeenCalledWith(
        'after-school',
      );
    });

    it('should return empty array when no matching anthologies', async () => {
      const dto: FilterByStringDto = { value: 'nonexistent' };
      mockAnthologyService.findByProgram.mockResolvedValue([]);
      const result = await controller.getByProgram(dto);
      expect(result).toEqual([]);
    });
  });
});
