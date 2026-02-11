import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { UpdateStoryDto } from './dtos/update-story.dto';
import { Story } from './story.entity';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { AuthGuard } from '@nestjs/passport';

describe('StoryController - editStory', () => {
  let controller: StoryController;

  const mockStoryService = { editStory: jest.fn() };

  beforeEach(async () => {
    mockStoryService.editStory = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoryController],
      providers: [{ provide: StoryService, useValue: mockStoryService }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .overrideInterceptor(CurrentUserInterceptor)
      .useValue({ intercept: (_ctx, next) => next.handle() })
      .compile();

    controller = module.get<StoryController>(StoryController);
  });

  it('throws BadRequestException when body is empty', async () => {
    await expect(
      controller.editStory(1, {} as UpdateStoryDto),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(mockStoryService.editStory).not.toHaveBeenCalled();
  });

  it('passes partial payload to service and returns result', async () => {
    const payload: UpdateStoryDto = {
      title: 'Updated Title',
    } as UpdateStoryDto;
    const story = { id: 1, title: 'Updated Title' } as Story;
    mockStoryService.editStory.mockResolvedValue(story);

    const result = await controller.editStory(1, payload);

    expect(mockStoryService.editStory).toHaveBeenCalledWith(
      1,
      'Updated Title',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
    expect(result).toBe(story);
  });
});
