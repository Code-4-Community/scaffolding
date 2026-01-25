import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearnerInfo } from './learner-info.entity';
import { CreateLearnerInfoDto } from './dto/create-learner-info.request.dto';

/**
 * Service for applications that interfaces with the application repository.
 */
@Injectable()
export class LearnerInfoService {
  constructor(
    @InjectRepository(LearnerInfo)
    private learnerInfoRepository: Repository<LearnerInfo>,
  ) {}

  /**
   * Creates a learner info in the repository.
   * @param createLearnerInfoDto The expected data required to create a learner specific info object
   * @returns The newly created learner-specific information object.
   * @throws {Error} which is unchanged from what repository throws.
   * @throws {BadRequestException} if any fields are invalid
   */
  async create(
    createLearnerInfoDto: CreateLearnerInfoDto,
  ): Promise<LearnerInfo> {
    if (createLearnerInfoDto.appId < 0) {
      throw new BadRequestException('appId must not be negative');
    }
    const learnerInfo = this.learnerInfoRepository.create(createLearnerInfoDto);
    return await this.learnerInfoRepository.save(learnerInfo);
  }
}
