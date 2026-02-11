import { Injectable } from '@nestjs/common';
import { CreateOmchaiDto } from './dtos/create-omchai.dto';
import { EditOmchaiDto } from './dtos/edit-omchai.dto';

@Injectable()
export class OmchaiService {
  create(createOmchaiDto: CreateOmchaiDto) {
    return 'This action adds a new omchai';
  }

  findAll() {
    return 'This action returns all omchai';
  }

  findByAnthologyId(anthologyId: number) {
    return `This action returns all omchai for the anthology #${anthologyId}`;
  }

  update(id: number, updateOmchaiDto: EditOmchaiDto) {
    return `This action updates omchai #${id}`;
  }
}