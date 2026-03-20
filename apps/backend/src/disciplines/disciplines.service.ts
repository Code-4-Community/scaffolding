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
   * Returns a discipline from the repository with the respective email
   * @param email the email corresponding to the desired discipline
   * @returns a discipline from the repository with the respective email
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
   * Deletes a discipline by email
   * @param email the email of the discipline to delete
   * @returns the deleted discipline
   * @throws {NotFoundException} if a discipline of the specified email doesn't exist in the repository.
   * @throws {Error} if the repository throws an error.
   */
  async remove(id: number): Promise<Discipline> {
    const discipline = await this.findOne(id);
    if (!discipline) {
      throw new NotFoundException(`Discipline with id ${id} not found`);
    }
    return this.disciplinesRepository.remove(discipline);
  }
  /**
   * Adds an admin email to a discipline's admin_emails array
   * @param id the discipline id
   * @param adminEmail the admin email to add
   * @throws {NotFoundException} if a discipline of the specified email doesn't exist in the repository.
   * @throws {Error} if the repository throws an error.
   * @returns the updated discipline
   */
  async addAdmin(id: number, adminEmail: string): Promise<Discipline> {
    const discipline = await this.findOne(id);
    if (!discipline) {
      throw new NotFoundException(`Discipline with id ${id} not found`);
    }

    if (!discipline.admin_emails.includes(adminEmail)) {
      discipline.admin_emails = [...discipline.admin_emails, adminEmail];
    }

    return this.disciplinesRepository.save(discipline);
  }

  /**
   * Removes an admin email from a discipline's admin_emails array
   * @param id the discipline id
   * @param adminEmail the admin email to remove
   * @returns the updated discipline
   * @throws {NotFoundException} if a discipline of the specified email doesn't exist in the repository.
   * @throws {Error} if the repository throws an error.
   */
  async removeAdmin(id: number, adminEmail: string): Promise<Discipline> {
    const discipline = await this.findOne(id);
    if (!discipline) {
      throw new NotFoundException(`Discipline with id ${id} not found`);
    }

    discipline.admin_emails = discipline.admin_emails.filter(
      (aid) => aid !== adminEmail,
    );

    return this.disciplinesRepository.save(discipline);
  }
}
