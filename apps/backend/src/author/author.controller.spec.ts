import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Author } from './author.entity';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { EditAuthorDto } from './dtos/edit-author.dto';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

export const mockCreateAuthor1Dto: CreateAuthorDto = {
  name: 'Regina George',
  bio: '...',
  grade: 10,
};

export const mockCreateAuthor2Dto: CreateAuthorDto = {
  name: 'George Bush',
  bio: '...',
  grade: 11,
};

export const mockEditAuthor2Dto: EditAuthorDto = {
  name: 'John Bush',
  bio: 'new bio',
  grade: 9,
};

export const mockAuthor1: Author = {
  id: 0,
  name: 'Regina George',
  bio: '...',
  grade: 10,
  classPeriod: '',
  nameInBook: '',
  stories: [],
};

export const mockAuthor2: Author = {
  id: 1,
  name: 'George Bush',
  bio: '...',
  grade: 11,
  classPeriod: '',
  nameInBook: '',
  stories: [],
};

describe('AuthorController', () => {
  let controller: AuthorController;

  const mockAuthorService = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        CurrentUserInterceptor,
        {
          provide: AuthService,
          useValue: {
            getUser: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: AuthorService,
          useValue: mockAuthorService,
        },
      ],
    }).compile();

    controller = module.get<AuthorController>(AuthorController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAuthor', () => {
    it('should successfully create new author', async () => {
      mockAuthorService.create.mockResolvedValue({ id: 0, ...mockAuthor1 });

      const result = await controller.createAuthor(mockCreateAuthor1Dto);
      expect(result).toEqual({ id: 0, ...mockAuthor1 });
      expect(mockAuthorService.create).toHaveBeenCalledWith(
        mockCreateAuthor1Dto,
      );
    });
  });

  describe('updateAuthor', () => {
    it('should successfully update author if id found', async () => {
      mockAuthorService.update.mockResolvedValue(mockAuthor2);

      const result = await controller.updateAuthor(1, mockEditAuthor2Dto);

      expect(result).toEqual(mockAuthor2);
      expect(mockAuthorService.update).toHaveBeenCalledWith(
        1,
        mockEditAuthor2Dto,
      );
    });

    it('should throw not found exception if author id not found', async () => {
      mockAuthorService.update.mockRejectedValue(
        new NotFoundException('Author not found'),
      );

      await expect(
        controller.updateAuthor(2, mockEditAuthor2Dto),
      ).rejects.toThrow(NotFoundException);
      expect(mockAuthorService.update).toHaveBeenCalledWith(
        2,
        mockEditAuthor2Dto,
      );
    });
  });

  // get all authors
  describe('getAuthors', () => {
    it('should get all authors in repository', async () => {
      mockAuthorService.findAll.mockResolvedValue([mockAuthor1, mockAuthor2]);
      const result = await controller.getAuthors();
      expect(result).toEqual([mockAuthor1, mockAuthor2]);
      expect(mockAuthorService.findAll).toHaveBeenCalled();
    });
  });

  // get author by id (valid + invalid)
  describe('getAuthor', () => {
    it('should return null if invalid author id', async () => {
      mockAuthorService.findOne.mockResolvedValue(null);
      const result = await controller.getAuthor(1);
      expect(result).toEqual(null);
      expect(mockAuthorService.findOne).toHaveBeenCalledWith(1);
    });
    it('should return author if valid id', async () => {
      mockAuthorService.findOne.mockResolvedValue(mockAuthor2);
      const result = await controller.getAuthor(1);
      expect(result).toEqual(mockAuthor2);
      expect(mockAuthorService.findOne).toHaveBeenCalledWith(1);
    });
  });

  // remove author (valid + invalid)
  describe('removeAuthor', () => {
    it('should return author if valid id after removing', async () => {
      mockAuthorService.remove.mockResolvedValue(mockAuthor2);
      const result = await controller.removeAuthor(1);
      expect(result).toEqual(mockAuthor2);
    });
    it('should throw NotFoundException if invalid author id', async () => {
      mockAuthorService.remove.mockRejectedValue(
        new NotFoundException('Author not found'),
      );

      await expect(controller.removeAuthor(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockAuthorService.remove).toHaveBeenCalledWith(1);
    });
  });
});
