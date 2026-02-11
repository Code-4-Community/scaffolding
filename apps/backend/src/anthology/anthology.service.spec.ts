import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { AnthologyPubLevel, AnthologyStatus } from './types';
import { Story } from '../story/story.entity';

describe('AnthologyService', () => {
  let service: AnthologyService;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockStoryRepo = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnthologyService,
        { provide: getRepositoryToken(Anthology), useValue: mockRepo },
        { provide: getRepositoryToken(Story), useValue: mockStoryRepo },
      ],
    }).compile();

    service = module.get<AnthologyService>(AnthologyService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('persists a new anthology successfully', async () => {
      const payload = {
        title: 'Anthology Title',
        description: 'Desc',
        published_year: 2024,
        status: AnthologyStatus.DRAFTING,
        pub_level: AnthologyPubLevel.ZINE,
        photo_url: 'photo.jpg',
        isbn: '1234567890',
        shopify_url: 'https://shopify.com/a',
        programs: ['After School'],
      };

      const created = { id: 1, ...payload } as Anthology;
      mockRepo.create.mockReturnValue(created);
      mockRepo.save.mockResolvedValue(created);

      const result = await service.create(
        payload.title,
        payload.description,
        payload.published_year,
        payload.status,
        payload.pub_level,
        payload.photo_url,
        payload.isbn,
        payload.shopify_url,
        payload.programs,
      );

      expect(mockRepo.create).toHaveBeenCalledWith(payload);
      expect(mockRepo.save).toHaveBeenCalledWith(created);
      expect(result).toBe(created);
    });
  });

  describe('getStories', () => {
    it('throws when anthology is not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.getStories(42)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 42 },
      });
    });

    it('returns stories when anthology exists', async () => {
      const stories = [{ id: 1 } as Story, { id: 2 } as Story];
      mockRepo.findOne.mockResolvedValue({ id: 5 } as Anthology);
      mockStoryRepo.find.mockResolvedValue(stories);

      const result = await service.getStories(5);

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 5 },
      });
      expect(mockStoryRepo.find).toHaveBeenCalledWith({
        where: { anthologyId: 5 },
      });
      expect(result).toEqual(stories);
    });
  });

  describe('edit', () => {
    it('throws when anthology does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.edit(7, 'New')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepo.save).not.toHaveBeenCalled();
    });

    it('updates and saves anthology when found', async () => {
      const existing = {
        id: 3,
        title: 'Old',
        description: 'Old desc',
        published_year: 2020,
        status: AnthologyStatus.ARCHIVED,
        pub_level: AnthologyPubLevel.SIGNATURE,
        photo_url: 'old.jpg',
        isbn: 'old-isbn',
        shopify_url: 'old-shopify',
        programs: ['Old Program'],
      } as Anthology;

      mockRepo.findOne.mockResolvedValue(existing);
      mockRepo.save.mockImplementation(async (anthology) => anthology);

      const result = await service.edit(
        3,
        'New Title',
        'New desc',
        2025,
        AnthologyStatus.DRAFTING,
        AnthologyPubLevel.ZINE,
        'new.jpg',
        'new-isbn',
        'new-shopify',
        ['New Program'],
      );

      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Title',
          description: 'New desc',
          published_year: 2025,
          status: AnthologyStatus.DRAFTING,
          pub_level: AnthologyPubLevel.ZINE,
          photo_url: 'new.jpg',
          isbn: 'new-isbn',
          shopify_url: 'new-shopify',
          programs: ['New Program'],
        }),
      );
      expect(result.title).toBe('New Title');
      expect(result.published_year).toBe(2025);
      expect(result.status).toBe(AnthologyStatus.DRAFTING);
      expect(result.pub_level).toBe(AnthologyPubLevel.ZINE);
      expect(result.programs).toEqual(['New Program']);
    });
  });
});
