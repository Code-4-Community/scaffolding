import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Anthologies')
@Controller('anthologies')
export class AnthologyController {
  constructor(private readonly anthologyService: AnthologyService) {}

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

  @Get()
  async getAllAnthologies(): Promise<Anthology[]> {
    return this.anthologyService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:anthologyId')
  async removeAnthology(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
  ): Promise<{ message: string }> {
    await this.anthologyService.remove(anthologyId);
    return { message: 'Anthology deleted successfully' };
  }
}
