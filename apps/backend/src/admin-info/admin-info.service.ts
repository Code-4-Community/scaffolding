import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin-info.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminEmailDto } from './dto/update-admin-email.dto';

/**
 * Service to interface with the admin repository.
 */
@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  /**
   * Creates an admin in the system.
   * @param createAdminDto object containing all of the necessary fields to create an admin.
   * @returns the new admin object.
   * @throws {Error} anything that the repository throws.
   */
  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const admin = this.adminRepository.create({
      email: createAdminDto.email,
      discipline: createAdminDto.discipline,
    });
    return await this.adminRepository.save(admin);
  }

  /**
   * Returns all admins in the system.
   * @returns a list of admin objects.
   * @throws {Error} anything that the repository throws.
   */
  async findAll(): Promise<Admin[]> {
    return await this.adminRepository.find();
  }

  /**
   * Returns an admin's information by their email.
   * @param email the email of the desired admin.
   * @returns the admin with the desired email.
   * @throws {NotFoundException} if an admin with the desired email does not exist in the system.
   * @throws {Error} anything that the repository throws.
   */
  async findOne(email: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) {
      throw new NotFoundException(`Admin with email ${email} not found`);
    }
    return admin;
  }

  /**
   * Returns an admin's information by their email.
   * @param email the email of the desired admin.
   * @returns the admin with the desired email,
   *          or null if an admin with the specified email does not exist in the system.
   * @throws {Error} anything that the repository throws.
   */
  async findByEmail(email: string): Promise<Admin | null> {
    return await this.adminRepository.findOne({ where: { email } });
  }

  /**
   * Updates admin's email.
   * @param email the email of the desired admin to update.
   * @param updateEmailDto object containing the new email to update to.
   * @returns the updated admin object.
   * @throws {Error} anything that the repository throws.
   */
  async updateEmail(
    email: string,
    updateEmailDto: UpdateAdminEmailDto,
  ): Promise<Admin> {
    const admin = await this.findOne(email);
    admin.email = updateEmailDto.email;
    return await this.adminRepository.save(admin);
  }

  /**
   * Deletes an admin by email.
   * @param email the email of the admin to be deleted.
   * @throws {Error} anything that the repository throws.
   */
  async remove(email: string): Promise<void> {
    const admin = await this.findOne(email);
    await this.adminRepository.remove(admin);
  }
}
