import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Learner } from './learner.entity';

@Injectable()
export class LearnersService {
  constructor(
    @InjectRepository(Learner)
    private readonly repo: Repository<Learner>,
  ) {}

  /**
   * Creates a learner in the repository
   * @param appId the corresponding application id of the learner to create
   * @param name the name of the learner to create, generally in format 'First Last'
   * @param startDate the expected starting date of the learner's commitment
   * @param endDate the expected ending date of the learner's commitment
   * @returns the new learner
   * @throws BadRequestException if any of the fields are invalid.
   *         anything that the repository throws
   */
  async create(appId: number, name: string, startDate: Date, endDate: Date) {
    if (!appId || appId <= 0) {
      throw new BadRequestException('Valid app ID is required');
    }

    if (!name || name.trim().length === 0) {
      throw new BadRequestException('Learner name is required');
    }

    if (!startDate || !endDate) {
      throw new BadRequestException('Start date and end date are required');
    }

    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    const learner: Learner = this.repo.create({
      appId,
      name,
      startDate,
      endDate,
    });

    return await this.repo.save(learner);
  }

  /**
   * Returns a specific learner by id
   * @param id the appId of the desired learner to return
   * @returns the learner with the desired id
   * @throws anything that the repository throws.
   *         BadRequestException if the id field is invalid, e.g. null or undefined
   *         NotFoundException with message 'Learner with ID <id> not found' if
   *         the learner with specified id is found not to exist in the system
   */
  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('Learner ID is required');
    }

    const learner = await this.repo.findOneBy({ id });
    if (!learner) {
      throw new NotFoundException(`Learner with ID ${id} not found`);
    }

    return learner;
  }

  /**
   * Returns all learners in the repository
   * @returns all learners in the repository
   * @throws anything the repository throws
   */
  findAll() {
    return this.repo.find();
  }

  /**
   * Updates a learner's commitment starting date
   * @param id the id of the learner to update
   * @param startDate the new starting date for the learner's commitment
   * @returns the new learner object
   * @throws anything that the repository throws.
   *         BadRequestException if any fields are invalid.
   *         NotFoundException with message 'Learner with ID <id> not found'
   *         if the desired learner to update doesn't exist in the system
   */
  async updateStartDate(id: number, startDate: Date) {
    if (!id) {
      throw new BadRequestException('Learner ID is required');
    }

    if (!startDate) {
      throw new BadRequestException('Start date is required');
    }

    const learner = await this.repo.findOneBy({ id });
    if (!learner) {
      throw new NotFoundException(`Learner with ID ${id} not found`);
    }

    if (learner.endDate && startDate >= learner.endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    learner.startDate = startDate;
    return this.repo.save(learner);
  }

  /**
   * Updates a learner's commitment ending date
   * @param id the id of the learner to update
   * @param startDate the new ending date for the learner's commitment
   * @returns the new learner object
   * @throws anything that the repository throws.
   *         BadRequestException if any fields are invalid.
   *         NotFoundException with message 'Learner with ID <id> not found'
   *         if the desired learner to update doesn't exist in the system
   */
  async updateEndDate(id: number, endDate: Date) {
    if (!id) {
      throw new BadRequestException('Learner ID is required');
    }

    if (!endDate) {
      throw new BadRequestException('End date is required');
    }

    const learner = await this.repo.findOneBy({ id });
    if (!learner) {
      throw new NotFoundException(`Learner with ID ${id} not found`);
    }

    if (learner.startDate && learner.startDate >= endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    learner.endDate = endDate;
    return this.repo.save(learner);
  }

  async findByAppId(appId: number) {
    if (!appId || appId <= 0) {
      throw new BadRequestException('Valid app ID is required');
    }

    const learners = await this.repo.find({ where: { appId } });

    // Note: find() returns an empty array when no results found, never null
    // If you want to throw an error when no learners are found, uncomment below:
    // if (learners.length === 0) {
    //   throw new NotFoundException(`No learners found for app ID ${appId}`);
    // }

    return learners;
  }
}
