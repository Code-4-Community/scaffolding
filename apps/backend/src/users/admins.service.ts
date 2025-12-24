import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { Site } from './types';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UpdateAdminEmailDto } from './dtos/update-admin-email.dto';

/**
 * Service to interface with the admin repository
 */
@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  /**
   * Creates an admin in the system
   * @param createAdminDto object containing all of the necessary fields to create an admin
   * @returns the new admin object
   * @throws anything that the repository throws
   */
  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const admin = this.adminRepository.create(createAdminDto);
    return await this.adminRepository.save(admin);
  }

  /**
   * Returns all admins in the system
   * @returns a list of admin objects
   * @throws anything that the repository throws
   */
  async findAll(): Promise<Admin[]> {
    return await this.adminRepository.find();
  }

  /**
   * Returns an admin's information by their id
   * @param id the id of the desired admin
   * @returns the admin with the desired id
   * @throws anything that the repository throws.
   *         NotFoundException if an admin with the
   *         desired id does not exist in the system
   */
  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  /**
   * Returns an admin's information by their email
   * @param email the email of the desired admin
   * @returns the admin with the desired email,
   *          or null if an admin with the specified email does not exist in the system
   * @throws anything that the repository throws
   */
  async findByEmail(email: string): Promise<Admin | null> {
    return await this.adminRepository.findOne({ where: { email } });
  }

  /**
   * Returns all admins that correspond to the specified site
   * @param site the desired site assigned to admins for which you want to see a list of
   * @returns a list of admin objects
   * @throws anything that the repository throws
   */
  async findBySite(site: Site): Promise<Admin[]> {
    return await this.adminRepository.find({ where: { site } });
  }

  /**
   * Updates admin's email
   * @param id the id fo the desired admin to update
   * @param updateEmailDto object containing the new email to update to
   * @returns the new admin object
   * @throws anything that the repository throws
   */
  async updateEmail(
    id: number,
    updateEmailDto: UpdateAdminEmailDto,
  ): Promise<Admin> {
    const admin = await this.findOne(id);
    admin.email = updateEmailDto.email;
    return await this.adminRepository.save(admin);
  }

  /**
   * Deletes an admin by id
   * @param id the id of the admin to be deleted
   * @throws anything that the repository throws
   *
   * Does not return a value.
   */
  async remove(id: number): Promise<void> {
    const admin = await this.findOne(id);
    await this.adminRepository.remove(admin);
  }
}
