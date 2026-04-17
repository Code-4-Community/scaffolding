import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { OmchaiService } from './omchai.service';
import { CreateOmchaiDto } from './dtos/create-omchai.dto';
import { EditOmchaiDto } from './dtos/edit-omchai.dto';
import { CreateOmchaiAssignmentsDto } from 'src/anthology/dtos/create-omchai-assignments-dto';
import { OmchaiRole } from './omchai.entity';

@Controller('omchai')
export class OmchaiController {
  constructor(private readonly omchaiService: OmchaiService) {}

  @Post()
  create(@Body() createOmchaiDto: CreateOmchaiDto) {
    return this.omchaiService.create(createOmchaiDto);
  }

  @Post('batch-assignments')
  createBatchAssignments(
    @Body() createOmchaiAssignmentsDto: CreateOmchaiAssignmentsDto,
  ) {
    // TODO: refactor to be less repetitive
    const createOmchaiDtos: CreateOmchaiDto[] = [];
    createOmchaiAssignmentsDto.owners.forEach((userId) => {
      createOmchaiDtos.push({
        anthology_id: createOmchaiAssignmentsDto.anthology_id,
        user_id: userId,
        role: OmchaiRole.OWNER,
        datetime_assigned: createOmchaiAssignmentsDto.datetime_assigned,
      });
    });
    createOmchaiAssignmentsDto.managers.forEach((userId) => {
      createOmchaiDtos.push({
        anthology_id: createOmchaiAssignmentsDto.anthology_id,
        user_id: userId,
        role: OmchaiRole.OWNER,
        datetime_assigned: createOmchaiAssignmentsDto.datetime_assigned,
      });
    });
    createOmchaiAssignmentsDto.consulted.forEach((userId) => {
      createOmchaiDtos.push({
        anthology_id: createOmchaiAssignmentsDto.anthology_id,
        user_id: userId,
        role: OmchaiRole.OWNER,
        datetime_assigned: createOmchaiAssignmentsDto.datetime_assigned,
      });
    });
    createOmchaiAssignmentsDto.helpers.forEach((userId) => {
      createOmchaiDtos.push({
        anthology_id: createOmchaiAssignmentsDto.anthology_id,
        user_id: userId,
        role: OmchaiRole.OWNER,
        datetime_assigned: createOmchaiAssignmentsDto.datetime_assigned,
      });
    });
    createOmchaiAssignmentsDto.approvers.forEach((userId) => {
      createOmchaiDtos.push({
        anthology_id: createOmchaiAssignmentsDto.anthology_id,
        user_id: userId,
        role: OmchaiRole.OWNER,
        datetime_assigned: createOmchaiAssignmentsDto.datetime_assigned,
      });
    });
    createOmchaiAssignmentsDto.informers.forEach((userId) => {
      createOmchaiDtos.push({
        anthology_id: createOmchaiAssignmentsDto.anthology_id,
        user_id: userId,
        role: OmchaiRole.OWNER,
        datetime_assigned: createOmchaiAssignmentsDto.datetime_assigned,
      });
    });

    return this.omchaiService.createMany(createOmchaiDtos);
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
