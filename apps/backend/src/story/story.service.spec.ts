import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { StoryService } from './story.service';
import { Story } from './story.entity';
import { Anthology } from '../anthology/anthology.entity';
import { Author } from '../author/author.entity';

describe('StoryService - editStory', () => {
  let service: StoryService;

  const mockStoryRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockAnthologyRepo = {
    findOne: jest.fn(),
  };

  const mockAuthorRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoryService,
        { provide: getRepositoryToken(Story), useValue: mockStoryRepo },
        { provide: getRepositoryToken(Anthology), useValue: mockAnthologyRepo },
        { provide: getRepositoryToken(Author), useValue: mockAuthorRepo },
      ],
    }).compile();

    service = module.get<StoryService>(StoryService);

    jest.clearAllMocks();
  });

  it('throws NotFoundException for invalid story id', async () => {
    mockStoryRepo.findOne.mockResolvedValue(null);

    await expect(service.editStory(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(mockStoryRepo.save).not.toHaveBeenCalled();
  });

  it('throws NotFoundException for invalid author id', async () => {
    const existingStory = { id: 1 } as Story;
    mockStoryRepo.findOne.mockResolvedValue(existingStory);
    mockAuthorRepo.findOne.mockResolvedValue(null);

    await expect(
      service.editStory(1, undefined, undefined, 42),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(mockStoryRepo.save).not.toHaveBeenCalled();
  });

  it('throws NotFoundException for invalid anthology id', async () => {
    const existingStory = { id: 1 } as Story;
    mockStoryRepo.findOne.mockResolvedValue(existingStory);
    mockAuthorRepo.findOne.mockResolvedValue({ id: 1 } as Author);
    mockAnthologyRepo.findOne.mockResolvedValue(null);

    await expect(service.editStory(1, undefined, 99, 1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(mockStoryRepo.save).not.toHaveBeenCalled();
  });

  it('updates and saves when data is valid', async () => {
    const existingStory = {
      id: 1,
      title: 'Old Title',
      studentBio: 'Old Bio',
      description: 'Old Desc',
      genre: 'Old Genre',
      theme: 'Old Theme',
      author: { id: 1 } as Author,
      anthology: { id: 1 } as Anthology,
    } as Story;

    const newAuthor = { id: 2 } as Author;
    const newAnthology = { id: 3 } as Anthology;

    mockStoryRepo.findOne.mockResolvedValue(existingStory);
    mockAuthorRepo.findOne.mockResolvedValue(newAuthor);
    mockAnthologyRepo.findOne.mockResolvedValue(newAnthology);
    mockStoryRepo.save.mockImplementation(async (story) => story);

    const result = await service.editStory(
      1,
      'New Title',
      3,
      2,
      'New Bio',
      'New Desc',
      'New Genre',
      'New Theme',
    );

    expect(mockAuthorRepo.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
    expect(mockAnthologyRepo.findOne).toHaveBeenCalledWith({
      where: { id: 3 },
    });
    expect(mockStoryRepo.save).toHaveBeenCalled();
    expect(result.title).toBe('New Title');
    expect(result.studentBio).toBe('New Bio');
    expect(result.description).toBe('New Desc');
    expect(result.genre).toBe('New Genre');
    expect(result.theme).toBe('New Theme');
    expect(result.author).toBe(newAuthor);
    expect(result.anthology).toBe(newAnthology);
  });
});
