import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discipline } from './disciplines.entity';

/**
 * Service to interface with the disciplines repository.
 */
@Injectable()
export class DisciplinesService {
  constructor(
    @InjectRepository(Discipline)
    private disciplinesRepository: Repository<Discipline>,
  ) {}

  async findAll(): Promise<Discipline[]> {
    return this.disciplinesRepository.find();
  }

  async findOne(id: number): Promise<Discipline | null> {
    return this.disciplinesRepository.findOneBy({ id });
  }

  async create(
    createDto: import('./dto/create-discipline.request.dto').CreateDisciplineRequestDto,
  ): Promise<Discipline> {
    const discipline = this.disciplinesRepository.create(createDto);
    return this.disciplinesRepository.save(discipline);
  }
}
