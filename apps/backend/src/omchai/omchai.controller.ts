import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { OmchaiService } from './omchai.service';
import { CreateOmchaiDto } from './dtos/create-omchai.dto';
import { EditOmchaiDto } from './dtos/edit-omchai.dto';

@Controller('omchai')
export class OmchaiController {
  constructor(private readonly omchaiService: OmchaiService) {}

  @Post()
  create(@Body() createOmchaiDto: CreateOmchaiDto) {
    return this.omchaiService.create(createOmchaiDto);
  }

  @Get()
  findAll() {
    return this.omchaiService.findAll();
  }

  @Get('anthology/:anthologyId')
  findByAnthologyId(@Param('anthologyId') anthologyId: string) {
    return this.omchaiService.findByAnthologyId(+anthologyId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() editOmchaiDto: EditOmchaiDto) {
    return this.omchaiService.update(+id, editOmchaiDto);
  }
}