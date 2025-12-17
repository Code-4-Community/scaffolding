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

  findAll() {
    return this.repo.find();
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
