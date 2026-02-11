import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  Body,
  Post,
} from '@nestjs/common';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateAnthologyDto } from './dtos/create-anthology.dto';
import { Story } from '../story/story.entity';
import { UpdateAnthologyDto } from './dtos/update-anthology.dto';

@ApiTags('Anthologies')
@ApiBearerAuth()
@Controller('anthologies')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CurrentUserInterceptor)
export class AnthologyController {
  constructor(private readonly anthologyService: AnthologyService) {}

  @Get('/:id')
  async getAnthology(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Anthology> {
    return this.anthologyService.findOne(id);
  }

  @Get()
  async getAllAnthologies(): Promise<Anthology[]> {
    return this.anthologyService.findAll();
  }

  @Delete('/:anthologyId')
  async removeAnthology(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
  ): Promise<{ message: string }> {
    await this.anthologyService.remove(anthologyId);
    return { message: 'Anthology deleted successfully' };
  }

  @Post()
  async createAnthology(
    @Body() createAnthologyDto: CreateAnthologyDto,
  ): Promise<{ message: string }> {
    await this.anthologyService.create(
      createAnthologyDto.title,
      createAnthologyDto.description,
      createAnthologyDto.published_year,
      createAnthologyDto.status,
      createAnthologyDto.pub_level,
      createAnthologyDto.photo_url,
      createAnthologyDto.isbn,
      createAnthologyDto.shopify_url,
      createAnthologyDto.programs,
    );
    return { message: 'Anthology created successfully' };
  }

  @Get('/:anthologyId/stories')
  async getStories(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
  ): Promise<Story[]> {
    return await this.anthologyService.getStories(anthologyId);
  }

  @Post('/:anthologyId')
  async editAnthology(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
    @Body() updateAnthologyDto: UpdateAnthologyDto,
  ): Promise<{ message: string }> {
    await this.anthologyService.edit(
      anthologyId,
      updateAnthologyDto.title,
      updateAnthologyDto.description,
      updateAnthologyDto.published_year,
      updateAnthologyDto.status,
      updateAnthologyDto.pub_level,
      updateAnthologyDto.photo_url,
      updateAnthologyDto.isbn,
      updateAnthologyDto.shopify_url,
      updateAnthologyDto.programs,
    );
    return { message: `Anthology with id ${anthologyId} updated successfully` };
  }
}
