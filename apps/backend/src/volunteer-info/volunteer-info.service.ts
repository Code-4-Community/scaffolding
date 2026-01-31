import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VolunteerInfo } from './volunteer-info.entity';
import { CreateVolunteerInfoDto } from './dto/create-volunteer-info.request.dto';

/**
 * Service for applications that interfaces with the application repository.
 */
@Injectable()
export class VolunteerInfoService {
  constructor(
    @InjectRepository(VolunteerInfo)
    private volunteerInfoRepository: Repository<VolunteerInfo>,
  ) {}

  /**
   * Returns a volunteer info by appId from the repository.
   * @param appId The desired volunteer info appId to search for.
   * @returns A promise resolving to the volunteer info object with that appId.
   * @throws {NotFoundException} with message 'volunteer Info with AppId <id> not found'
   *         if an application with that id does not exist.
   * @throws {Error} which is unchanged from what repository throws.
   */
  async findById(appId: number): Promise<VolunteerInfo> {
    const volunteerInfo: VolunteerInfo =
      await this.volunteerInfoRepository.findOne({
        where: { appId },
      });

    if (!volunteerInfo) {
      throw new NotFoundException(
        `volunteer Info with AppId ${appId} not found`,
      );
    }

    return volunteerInfo;
  }

  /**
   * Creates a volunteer info in the repository.
   * @param createvolunteerInfoDto The expected data required to create a volunteer specific info object
   * @returns The newly created volunteer-specific information object.
   * @throws {Error} which is unchanged from what repository throws.
   * @throws {BadRequestException} if any fields are invalid
   */
  async create(
    createvolunteerInfoDto: CreateVolunteerInfoDto,
  ): Promise<VolunteerInfo> {
    if (createvolunteerInfoDto.appId < 0) {
      throw new BadRequestException('appId must not be negative');
    }
    const volunteerInfo = this.volunteerInfoRepository.create(
      createvolunteerInfoDto,
    );
    return await this.volunteerInfoRepository.save(volunteerInfo);
  }
}
