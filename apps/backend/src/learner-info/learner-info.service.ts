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
   * @throws {Error} which is unchanged from what repository throws.
   */
  async findById(appId: number): Promise<LearnerInfo> {
    const learnerInfo: LearnerInfo = await this.learnerInfoRepository.findOne({
      where: { appId },
    });

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
    const learnerInfo = this.learnerInfoRepository.create(createLearnerInfoDto);
    return await this.learnerInfoRepository.save(learnerInfo);
  }

  /**
   * Updates the fields of a learner info in the repository.
   * @param appId The id of the application to update.
   * @param updateData Object containing the desired new learner info fields.
   * @returns The updated application object.
   * @throws {NotFoundException} with message 'Learner Info with AppId <id> not found'
   *         if the application does not exist.
   * @throws {Error} which is unchanged from what repository throws.
   */
  async update(
    appId: number,
    updateData: Partial<CreateLearnerInfoDto>,
  ): Promise<LearnerInfo> {
    const application = await this.findById(appId);
    if (!application) {
      throw new NotFoundException(`Application with ID ${appId} not found`);
    }
    Object.assign(application, updateData);
    return await this.learnerInfoRepository.save(application);
  }
}
