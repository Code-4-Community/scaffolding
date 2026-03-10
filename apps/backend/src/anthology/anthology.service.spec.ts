import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Between } from 'typeorm';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { AgeCategory, AnthologyStatus, AnthologyPubLevel } from './types';

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

describe('AnthologyService', () => {
  let service: AnthologyService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnthologyService,
        {
          provide: getRepositoryToken(Anthology),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AnthologyService>(AnthologyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllSortedByTitle', () => {
    it('should return anthologies sorted by title ASC', async () => {
      mockRepository.find.mockResolvedValue([mockAnthology1, mockAnthology2]);
      const result = await service.findAllSortedByTitle();
      expect(result).toEqual([mockAnthology1, mockAnthology2]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { title: 'ASC' },
      });
    });

    it('should return empty array when no anthologies', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.findAllSortedByTitle();
      expect(result).toEqual([]);
    });
  });

  describe('findAllSortedByDateRecent', () => {
    it('should return anthologies sorted by publishedDate DESC', async () => {
      mockRepository.find.mockResolvedValue([mockAnthology2, mockAnthology1]);
      const result = await service.findAllSortedByDateRecent();
      expect(result).toEqual([mockAnthology2, mockAnthology1]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { publishedDate: 'DESC' },
      });
    });

    it('should return empty array when no anthologies', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.findAllSortedByDateRecent();
      expect(result).toEqual([]);
    });
  });

  describe('findAllSortedByDateOldest', () => {
    it('should return anthologies sorted by publishedDate ASC', async () => {
      mockRepository.find.mockResolvedValue([mockAnthology1, mockAnthology2]);
      const result = await service.findAllSortedByDateOldest();
      expect(result).toEqual([mockAnthology1, mockAnthology2]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { publishedDate: 'ASC' },
      });
    });

    it('should return empty array when no anthologies', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.findAllSortedByDateOldest();
      expect(result).toEqual([]);
    });
  });

  describe('findByAgeCategory', () => {
    it('should return anthologies matching the age category', async () => {
      mockRepository.find.mockResolvedValue([mockAnthology1, mockAnthology2]);
      const result = await service.findByAgeCategory(AgeCategory.YA);
      expect(result).toEqual([mockAnthology1, mockAnthology2]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { ageCategory: AgeCategory.YA },
      });
    });

    it('should return empty array when none match', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.findByAgeCategory(AgeCategory.YA);
      expect(result).toEqual([]);
    });
  });

  describe('findByPubDateRange', () => {
    it('should return anthologies within the date range', async () => {
      const start = '2020-01-01T00:00:00.000Z';
      const end = '2022-12-31T00:00:00.000Z';
      mockRepository.find.mockResolvedValue([mockAnthology1, mockAnthology2]);
      const result = await service.findByPubDateRange(start, end);
      expect(result).toEqual([mockAnthology1, mockAnthology2]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          publishedDate: Between(new Date(start), new Date(end)),
        },
      });
    });

    it('should return empty array when no anthologies in range', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.findByPubDateRange(
        '2030-01-01T00:00:00.000Z',
        '2031-01-01T00:00:00.000Z',
      );
      expect(result).toEqual([]);
    });
  });

  describe('findByGenre', () => {
    it('should call find with ILike for lowercase genre', async () => {
      mockRepository.find.mockResolvedValue([mockAnthology1]);
      const result = await service.findByGenre('mystery');
      expect(result).toEqual([mockAnthology1]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { genres: ILike('%mystery%') },
      });
    });

    it('should call find with ILike for mixed-case genre (Mystery)', async () => {
      mockRepository.find.mockResolvedValue([mockAnthology1]);
      await service.findByGenre('Mystery');
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { genres: ILike('%Mystery%') },
      });
    });

    it('should call find with ILike for uppercase genre (MYSTERY)', async () => {
      mockRepository.find.mockResolvedValue([mockAnthology1]);
      await service.findByGenre('MYSTERY');
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { genres: ILike('%MYSTERY%') },
      });
    });

    it('should return empty array when no matching anthologies', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.findByGenre('nonexistent');
      expect(result).toEqual([]);
    });
  });

  describe('findByProgram', () => {
    it('should call find with ILike for program value', async () => {
      mockRepository.find.mockResolvedValue([mockAnthology1]);
      const result = await service.findByProgram('after-school');
      expect(result).toEqual([mockAnthology1]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { programs: ILike('%after-school%') },
      });
    });

    it('should return empty array when no matching anthologies', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.findByProgram('nonexistent');
      expect(result).toEqual([]);
    });
  });
});
