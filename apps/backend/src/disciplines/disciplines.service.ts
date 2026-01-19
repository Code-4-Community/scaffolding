import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discipline } from './disciplines.entity';
import { CreateDisciplineRequestDto } from './dto/create-discipline.request.dto';

/**
 * Service to interface with the disciplines repository.
 */
@Injectable()
export class DisciplinesService {
  constructor(
    @InjectRepository(Discipline)
    private disciplinesRepository: Repository<Discipline>,
  ) {}

  /**
   * Returns a list of all disciplines in the repository
   * @returns a list of all disciplines in the repository
   */
  async findAll(): Promise<Discipline[]> {
    return this.disciplinesRepository.find();
  }

  /**
   * Returns a discipline from the repository with the respective id
   * @param id the id corresponding to the desired discipline
   * @returns a discipline from the repository with the respective id
   */
  async findOne(id: number): Promise<Discipline | null> {
    return this.disciplinesRepository.findOneBy({ id });
  }

  /**
   * Creates a discipline with the requested fields
   * @param createDto the requested fields for the new discipline to have
   * @returns the new discipline
   */
  async create(createDto: CreateDisciplineRequestDto): Promise<Discipline> {
    const discipline = this.disciplinesRepository.create(createDto);
    return this.disciplinesRepository.save(discipline);
  }
}
