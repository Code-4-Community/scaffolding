import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
   * Returns a learner info by appId from the repository.
   * @param appId The desired learner info appId to search for.
   * @returns A promise resolving to the learner info object with that appId.
   * @throws {NotFoundException} with message 'Learner Info with AppId <id> not found'
   *         if an application with that id does not exist.
   * @throws {BadRequestException} if the id field is invalid (e.g. null or undefined)
   * @throws {Error} which is unchanged from what repository throws.
   */
  async findById(appId: number): Promise<LearnerInfo> {
    const learnerInfo: LearnerInfo = await this.learnerInfoRepository.findOne({
      where: { appId },
    });

    if (!appId && appId !== 0) {
      throw new BadRequestException(`Learner info ID is required`);
    }

    if (!learnerInfo) {
      throw new NotFoundException(`Learner Info with AppId ${appId} not found`);
    }

    return learnerInfo;
  }

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
    // Prevent creating duplicate learner-info for the same appId
    const existing = await this.learnerInfoRepository.findOne({
      where: { appId: createLearnerInfoDto.appId },
    });

    if (existing) {
      throw new BadRequestException(
        `Learner Info with AppId ${createLearnerInfoDto.appId} already exists`,
      );
    }
    const learnerInfo = this.learnerInfoRepository.create(createLearnerInfoDto);
    return await this.learnerInfoRepository.save(learnerInfo);
  }
}
