import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { AuthorService } from './author.service';
import { Author } from './author.entity';

describe('AuthorService', () => {
  let service: AuthorService;

  const mockAuthor: Author = {
    id: 1,
    name: 'Test Author',
    bio: 'Test bio',
    grade: 5,
  };

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
        AuthorService,
        {
          provide: getRepositoryToken(Author),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new author', async () => {
      const newAuthor: Author = {
        id: 1,
        name: 'New Author',
        bio: 'New bio',
        grade: 7,
      };

      mockRepository.count.mockResolvedValue(0);
      mockRepository.create.mockReturnValue(newAuthor);
      mockRepository.save.mockResolvedValue(newAuthor);

      const result = await service.create('New Author', 'New bio', 7);

      expect(result).toEqual(newAuthor);
      expect(mockRepository.count).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalledWith({
        id: 1,
        name: 'New Author',
        bio: 'New bio',
        grade: 7,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(newAuthor);
    });

    it('should increment id based on count', async () => {
      const created: Author = {
        id: 6,
        name: 'Another Author',
        bio: 'Another bio',
        grade: 3,
      };

      mockRepository.count.mockResolvedValue(5);
      mockRepository.create.mockReturnValue(created);
      mockRepository.save.mockResolvedValue(created);

      const result = await service.create('Another Author', 'Another bio', 3);

      expect(result).toEqual(created);
      expect(mockRepository.create).toHaveBeenCalledWith({
        id: 6,
        name: 'Another Author',
        bio: 'Another bio',
        grade: 3,
      });
    });
  });

  describe('findOne', () => {
    it('should return author when found', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockAuthor);

      const result = await service.findOne(1);

      expect(result).toEqual(mockAuthor);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null when author not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });

    it('should return null when id is falsy', async () => {
      const result = await service.findOne(0);

      expect(result).toBeNull();
      expect(mockRepository.findOneBy).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return authors', async () => {
      const authors: Author[] = [
        mockAuthor,
        { ...mockAuthor, id: 2, name: 'Second Author' },
      ];
      mockRepository.find.mockResolvedValue(authors);

      const result = await service.findAll();

      expect(result).toEqual(authors);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an author when found', async () => {
      const existing: Author = { ...mockAuthor };
      const updated: Author = { ...mockAuthor, bio: 'Updated bio' };

      mockRepository.findOneBy.mockResolvedValue(existing);
      mockRepository.save.mockResolvedValue(updated);

      const result = await service.update(1, { bio: 'Updated bio' });

      expect(result).toEqual(updated);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...existing,
        bio: 'Updated bio',
      });
    });

    it('should throw NotFoundException when author does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, { name: 'Nope' })).rejects.toThrow(
        new NotFoundException('Author not found'),
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove author when found', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockAuthor);
      mockRepository.remove.mockResolvedValue(mockAuthor);

      const result = await service.remove(1);

      expect(result).toEqual(mockAuthor);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockAuthor);
    });

    it('should throw NotFoundException when author not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Author not found'),
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});
