import { Injectable, NotFoundException } from '@nestjs/common';
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

  /**
   * Deletes a discipline by id
   * @param id the id of the discipline to delete
   * @returns the deleted discipline
   * @throws {NotFoundException} if a discipline of the specified id doesn't exist in the repository.
   * @throws {Error} if the repository throws an error.
   */
  async remove(id: number): Promise<Discipline> {
    const discipline = await this.findOne(id);
    if (!discipline) {
      throw new NotFoundException(`Discipline with ID ${id} not found`);
    }
    return this.disciplinesRepository.remove(discipline);
  }
  /**
   * Adds an admin ID to a discipline's admin_ids array
   * @param id the discipline id
   * @param adminId the admin id to add
   * @throws {NotFoundException} if a discipline of the specified id doesn't exist in the repository.
   * @throws {Error} if the repository throws an error.
   * @returns the updated discipline
   */
  async addAdmin(id: number, adminId: number): Promise<Discipline> {
    const discipline = await this.findOne(id);
    if (!discipline) {
      throw new NotFoundException(`Discipline with ID ${id} not found`);
    }

    if (!discipline.admin_ids.includes(adminId)) {
      discipline.admin_ids = [...discipline.admin_ids, adminId];
    }

    return this.disciplinesRepository.save(discipline);
  }

  /**
   * Removes an admin ID from a discipline's admin_ids array
   * @param id the discipline id
   * @param adminId the admin id to remove
   * @returns the updated discipline
   * @throws {NotFoundException} if a discipline of the specified id doesn't exist in the repository.
   * @throws {Error} if the repository throws an error.
   */
  async removeAdmin(id: number, adminId: number): Promise<Discipline> {
    const discipline = await this.findOne(id);
    if (!discipline) {
      throw new NotFoundException(`Discipline with ID ${id} not found`);
    }

    discipline.admin_ids = discipline.admin_ids.filter(
      (aid) => aid !== adminId,
    );

    return this.disciplinesRepository.save(discipline);
  }
}
