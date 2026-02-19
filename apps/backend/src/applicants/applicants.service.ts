import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Applicant } from './applicant.entity';

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
   * Creates a applicant in the repository.
   * @param appId The corresponding application id of the applicant to create.
   * @param name The name of the applicant to create (generally in the format 'First Last').
   * @param startDate The expected starting date of the applicant's commitment.
   * @param endDate The expected ending date of the applicant's commitment.
   * @returns The created applicant.
   * @throws {BadRequestException} if any of the fields are invalid.
   * @throws {Error} If the repository throws an error.
   */
  async create(
    appId: number,
    firstName: string,
    lastName: string,
    startDate: Date,
    endDate: Date,
  ) {
    if (!appId || appId <= 0) {
      throw new BadRequestException('Valid app ID is required');
    }

    if (!firstName || firstName.trim().length === 0) {
      throw new BadRequestException('Applicant first name is required');
    }

    if (!lastName || lastName.trim().length === 0) {
      throw new BadRequestException('Applicant last name is required');
    }

    if (!startDate || !endDate) {
      throw new BadRequestException('Start date and end date are required');
    }

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException(
        'Start date and end date must be valid dates',
      );
    }
    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    const applicant: Applicant = this.repo.create({
      appId,
      firstName,
      lastName,
      startDate,
      endDate,
    });

    return await this.repo.save(applicant);
  }

  /**
   * Returns a specific applicant by id.
   * @param appId The id of the desired applicant to return.
   * @returns The applicant with the desired id.
   * @throws {Error} If the repository throws an error.
   * @throws {BadRequestException} if any field is invalid (e.g. null or undefined).
   * @throws {NotFoundException} with message 'Applicant with ID <id> not found'
   *                             if the applicant with the specified appId does not exist.
   */
  async findOne(appId: number) {
    if (!appId) {
      throw new BadRequestException('Applicant ID is required');
    }

    const applicant = await this.repo.findOneBy({ appId });
    if (!applicant) {
      throw new NotFoundException(`Applicant with ID ${appId} not found`);
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

  /**
   * Updates a applicant's commitment starting date.
   * @param appId The appId of the applicant to update.
   * @param startDate The new starting date for the applicant's commitment.
   * @returns The updated applicant object.
   * @throws {Error} If the repository throws an error.
   * @throws {BadRequestException} if any field is invalid (e.g. null or undefined).
   * @throws {NotFoundException} with message 'Applicant with ID <id> not found'
   *                             if the applicant with the specified appId does not exist.
   */
  async updateStartDate(appId: number, startDate: Date) {
    if (!appId) {
      throw new BadRequestException('Applicant ID is required');
    }

    if (!startDate) {
      throw new BadRequestException('Start date is required');
    }

    if (isNaN(startDate.getTime())) {
      throw new BadRequestException('Start date must be a valid date');
    }

    const applicant = await this.repo.findOneBy({ appId });
    if (!applicant) {
      throw new NotFoundException(`Applicant with ID ${appId} not found`);
    }

    if (applicant.endDate && startDate >= applicant.endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    applicant.startDate = startDate;
    return this.repo.save(applicant);
  }

  /**
   * Updates a applicant's commitment ending date.
   * @param appId The appId of the applicant to update.
   * @param endDate The new ending date for the applicant's commitment.
   * @returns The updated applicant object.
   * @throws {Error} If the repository throws an error.
   * @throws {BadRequestException} if any field is invalid (e.g. null or undefined).
   * @throws {NotFoundException} with message 'Applicant with ID <appId> not found'
   *                             if the applicant with the specified appId does not exist.
   */
  async updateEndDate(appId: number, endDate: Date) {
    if (!appId) {
      throw new BadRequestException('Applicant ID is required');
    }

    if (!endDate) {
      throw new BadRequestException('End date is required');
    }

    if (isNaN(endDate.getTime())) {
      throw new BadRequestException('End date must be a valid date');
    }

    const applicant = await this.repo.findOneBy({ appId });
    if (!applicant) {
      throw new NotFoundException(`Applicant with ID ${appId} not found`);
    }

    if (applicant.startDate && applicant.startDate >= endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    applicant.endDate = endDate;
    return this.repo.save(applicant);
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
   * Deletes a applicant by id.
   * @param id The id of the applicant to delete.
   * @returns The deleted applicant.
   * @throws {Error} If the repository throws an error.
   * @throws {BadRequestException} if any field is invalid (e.g. null or undefined).
   * @throws {NotFoundException} with message 'Applicant with ID <id> not found'
   *                             if the applicant with the specified appId does not exist.
   */
  async delete(id: number) {
    const applicant = await this.findOne(id);
    if (!applicant) {
      throw new NotFoundException(`Applicant with ID ${id} not found`);
    }
    return this.repo.remove(applicant);
  }
}
