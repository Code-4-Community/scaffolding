import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { AuthGuard } from '@nestjs/passport';
import { Story } from './story.entity';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateStoryDto } from './dtos/create-story.dto';
import { UpdateStoryDto } from './dtos/update-story.dto';

@ApiTags('Story')
@ApiBearerAuth()
@Controller('story')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CurrentUserInterceptor)
export class StoryController {
  constructor(private storyService: StoryService) {}

  // TECH DEBT: why is anthologyId being passed in
  @Get('/library/anthology/:anthologyId/story/:storyId')
  async getStory(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
    @Param('storyId', ParseIntPipe) storyId: number,
  ): Promise<Story> {
    return this.storyService.findOne(storyId);
  }

  @Delete('/:storyId')
  async removeStory(
    @Param('storyId', ParseIntPipe) storyId: number,
  ): Promise<Story> {
    return this.storyService.remove(storyId);
  }

  @Post('/library/anthology/:anthologyId/story')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new story in a specific anthology' })
  @ApiResponse({
    status: 201,
    description: 'Story created successfully',
    type: Story,
  })
  @ApiResponse({
    status: 404,
    description: 'Anthology not found',
  })
  async createStory(@Body() createStoryDto: CreateStoryDto): Promise<Story> {
    return await this.storyService.createStory(
      createStoryDto.title,
      createStoryDto.anthologyId,
      createStoryDto.authorId,
      createStoryDto.studentBio,
      createStoryDto.description,
      createStoryDto.genre,
      createStoryDto.theme,
    );
  }

  @Post('/:storyId')
  async editStory(
    @Param('storyId', ParseIntPipe) storyId: number,
    @Body() updateStoryDto: UpdateStoryDto,
  ): Promise<Story> {
    if (Object.keys(updateStoryDto).length == 0) {
      throw new BadRequestException('Empty UpdateStoryDto payload');
    }
    return await this.storyService.editStory(
      storyId,
      updateStoryDto.title,
      updateStoryDto.anthologyId,
      updateStoryDto.authorId,
      updateStoryDto.studentBio,
      updateStoryDto.description,
      updateStoryDto.genre,
      updateStoryDto.theme,
    );
  }
}
