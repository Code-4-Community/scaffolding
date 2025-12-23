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

    // If we want to error out instead of returning an empty array:
    // if (learners.length === 0) {
    //   throw new NotFoundException(`No learners found for app ID ${appId}`);
    // }

    return learners;
  }
}
