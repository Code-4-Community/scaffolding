import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { OmchaiService } from './omchai.service';
import { CreateOmchaiDto } from './dtos/create-omchai.dto';
import { EditOmchaiDto } from './dtos/edit-omchai.dto';
import { CreateOmchaiAssignmentsDto } from 'src/anthology/dtos/create-omchai-assignments-dto';
import { OmchaiRole } from './omchai.entity';
import { Anthology } from 'src/anthology/anthology.entity';
import { User } from 'src/users/user.entity';

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
    const createOmchaiDtos: CreateOmchaiDto[] = [];

    function createOmchaiDtosByRole(userIds: number[], role: OmchaiRole) {
      userIds.forEach((userId) => {
        createOmchaiDtos.push({
          anthologyId: createOmchaiAssignmentsDto.anthology_id,
          userId: userId,
          role: role,
          datetimeAssigned: createOmchaiAssignmentsDto.datetime_assigned,
          user: { id: userId } as User,
          anthology: {
            id: createOmchaiAssignmentsDto.anthology_id,
          } as Anthology,
        });
      });
    }

    createOmchaiDtosByRole(createOmchaiAssignmentsDto.owners, OmchaiRole.OWNER);
    createOmchaiDtosByRole(
      createOmchaiAssignmentsDto.managers,
      OmchaiRole.MANAGER,
    );
    createOmchaiDtosByRole(
      createOmchaiAssignmentsDto.consulted,
      OmchaiRole.CONSULTED,
    );
    createOmchaiDtosByRole(
      createOmchaiAssignmentsDto.helpers,
      OmchaiRole.HELPER,
    );
    createOmchaiDtosByRole(
      createOmchaiAssignmentsDto.approvers,
      OmchaiRole.APPROVER,
    );
    createOmchaiDtosByRole(
      createOmchaiAssignmentsDto.informers,
      OmchaiRole.INFORMED,
    );

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
