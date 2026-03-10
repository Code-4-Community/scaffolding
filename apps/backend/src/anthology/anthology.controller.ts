import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  FilterByAgeCategoryDto,
  FilterByPubDateDto,
  FilterByStringDto,
} from './dtos/filter-anthology.dto';

@ApiTags('Anthologies')
@ApiBearerAuth()
@Controller('anthologies')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CurrentUserInterceptor)
export class AnthologyController {
  constructor(private readonly anthologyService: AnthologyService) {}

  @Get('sort/title')
  getAllByTitle(): Promise<Anthology[]> {
    return this.anthologyService.findAllSortedByTitle();
  }

  @Get('sort/date-recent')
  getAllByDateRecent(): Promise<Anthology[]> {
    return this.anthologyService.findAllSortedByDateRecent();
  }

  @Get('sort/date-oldest')
  getAllByDateOldest(): Promise<Anthology[]> {
    return this.anthologyService.findAllSortedByDateOldest();
  }

  @Get('filter/age-category')
  getByAgeCategory(@Query() dto: FilterByAgeCategoryDto): Promise<Anthology[]> {
    return this.anthologyService.findByAgeCategory(dto.value);
  }

  @Get('filter/pub-date')
  getByPubDateRange(@Query() dto: FilterByPubDateDto): Promise<Anthology[]> {
    return this.anthologyService.findByPubDateRange(dto.start, dto.end);
  }

  @Get('filter/genre')
  getByGenre(@Query() dto: FilterByStringDto): Promise<Anthology[]> {
    return this.anthologyService.findByGenre(dto.value);
  }

  @Get('filter/program')
  getByProgram(@Query() dto: FilterByStringDto): Promise<Anthology[]> {
    return this.anthologyService.findByProgram(dto.value);
  }

  @Get()
  async getAllAnthologies(): Promise<Anthology[]> {
    return this.anthologyService.findAll();
  }

  @Get(':id')
  async getAnthology(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Anthology> {
    const anthology = await this.anthologyService.findOne(id);

    if (!anthology) {
      throw new NotFoundException(`Anthology with ID ${id} not found`);
    }

    return anthology;
  }

  @Delete('/:anthologyId')
  async removeAnthology(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
  ): Promise<{ message: string }> {
    await this.anthologyService.remove(anthologyId);
    return { message: 'Anthology deleted successfully' };
  }
}
