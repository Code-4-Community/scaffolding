import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Applicant } from './candidate-info.entity';

/**
 * Service to interface with the applicant repository.
 */
@Injectable()
export class ApplicantsService {
  constructor(
    @InjectRepository(Applicant)
    private readonly repo: Repository<Applicant>,
  ) {}

  /**
   * Creates an applicant (candidate info) in the repository.
   * @param appId The corresponding application id of the applicant to create.
   * @param email The email of the applicant (primary key).
   * @returns The created applicant.
   * @throws {BadRequestException} if any of the fields are invalid.
   * @throws {Error} If the repository throws an error.
   */
  async create(appId: number, email: string): Promise<Applicant> {
    if (!appId || appId <= 0) {
      throw new BadRequestException('Valid app ID is required');
    }

    if (!email || email.trim().length === 0) {
      throw new BadRequestException('Applicant email is required');
    }

    const applicant: Applicant = this.repo.create({
      appId,
      email: email.trim(),
    });

    return await this.repo.save(applicant);
  }

  /**
   * Returns a specific applicant by email.
   * @param email The email of the desired applicant (primary key).
   * @returns The applicant with the desired email.
   * @throws {BadRequestException} if email is invalid.
   * @throws {NotFoundException} if the applicant with the specified email does not exist.
   * @throws {Error} If the repository throws an error.
   */
  async findOne(email: string): Promise<Applicant> {
    if (!email || email.trim().length === 0) {
      throw new BadRequestException('Applicant email is required');
    }

    const applicant = await this.repo.findOneBy({ email: email.trim() });
    if (!applicant) {
      throw new NotFoundException(`Applicant with email ${email} not found`);
    }

    return applicant;
  }

  /**
   * Returns all applicants in the repository.
   * @returns All applicants in the repository.
   * @throws {Error} If the repository throws an error.
   */
  findAll() {
    return this.repo.find();
  }

  async findByAppId(appId: number) {
    if (!appId || appId <= 0) {
      throw new BadRequestException('Valid app ID is required');
    }

    const applicants = await this.repo.find({ where: { appId } });

    // If we want to error out instead of returning an empty array:
    // if (applicants.length === 0) {
    //   throw new NotFoundException(`No applicants found for app ID ${appId}`);
    // }

    return applicants;
  }

  /**
   * Deletes an applicant by email.
   * @param email The email of the applicant to delete (primary key).
   * @returns The deleted applicant.
   * @throws {Error} If the repository throws an error.
   * @throws {NotFoundException} if the applicant with the specified email does not exist.
   */
  async delete(email: string): Promise<Applicant> {
    const applicant = await this.findOne(email);
    return this.repo.remove(applicant);
  }
}
