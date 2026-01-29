import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';

import { AnthologyController } from './anthology.controller';
import { AnthologyService } from './anthology.service';
import { AnthologyPubLevel, AnthologyStatus } from './types';
import { CreateAnthologyDto } from './dtos/create-anthology.dto';
import { UpdateAnthologyDto } from './dtos/update-anthology.dto';
import { Story } from '../story/story.entity';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';

describe('AnthologyController', () => {
  let controller: AnthologyController;

  const mockService = {
    create: jest.fn(),
    getStories: jest.fn(),
    edit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnthologyController],
      providers: [{ provide: AnthologyService, useValue: mockService }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .overrideInterceptor(CurrentUserInterceptor)
      .useValue({ intercept: (_ctx, next) => next.handle() })
      .compile();

    controller = module.get<AnthologyController>(AnthologyController);
    jest.clearAllMocks();
  });

  it('creates an anthology and returns success message', async () => {
    const dto: CreateAnthologyDto = {
      title: 'New Anthology',
      description: 'Description',
      published_year: 2024,
      status: AnthologyStatus.DRAFTING,
      pub_level: AnthologyPubLevel.ZINE,
      photo_url: 'photo.jpg',
      isbn: '123',
      shopify_url: 'shopify',
      programs: ['Program'],
    };

    const response = await controller.createAnthology(dto);

    expect(mockService.create).toHaveBeenCalledWith(
      dto.title,
      dto.description,
      dto.published_year,
      dto.status,
      dto.pub_level,
      dto.photo_url,
      dto.isbn,
      dto.shopify_url,
      dto.programs,
    );
    expect(response).toEqual({ message: 'Anthology created successfully' });
  });

  it('returns stories for an anthology', async () => {
    const stories = [{ id: 1 } as Story];
    mockService.getStories.mockResolvedValue(stories);

    const result = await controller.getStories(5);

    expect(mockService.getStories).toHaveBeenCalledWith(5);
    expect(result).toBe(stories);
  });

  it('edits an anthology and returns success message', async () => {
    mockService.edit.mockResolvedValue({});
    const dto: UpdateAnthologyDto = {
      title: 'Updated',
      status: AnthologyStatus.CAN_BE_SHARED,
    } as UpdateAnthologyDto;

    const response = await controller.editAnthology(7, dto);

    expect(mockService.edit).toHaveBeenCalledWith(
      7,
      dto.title,
      dto.description,
      dto.published_year,
      dto.status,
      dto.pub_level,
      dto.photo_url,
      dto.isbn,
      dto.shopify_url,
      dto.programs,
    );
    expect(response).toEqual({
      message: 'Anthology with id 7 updated successfully',
    });
  });
});
