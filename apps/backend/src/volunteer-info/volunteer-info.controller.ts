import { Body, Controller, Post } from '@nestjs/common';
import { VolunteerInfo } from './volunteer-info.entity';
import { ApiTags } from '@nestjs/swagger';
import { VolunteerInfoService } from './volunteer-info.service';
import { CreateVolunteerInfoDto } from './dto/create-volunteer-info.request.dto';

/**
 * Controller to expose HTTP endpoints to interface, extract, and change information about volunteer-specific application info.
 */
@ApiTags('volunteerInfo')
@Controller('volunteer_info')
export class VolunteerInfoController {
  constructor(private volunteerInfoService: VolunteerInfoService) {}

  /**
   * Exposes an endpoint to create a volunteer info.
   * @param createvolunteerInfoDto The expected data required to create a volunteer specific info object
   * @returns The newly created application.
   * @throws {Error} which is unchanged from what repository throws.
   */
  @Post()
  async createVolunteerInfo(
    @Body() createvolunteerInfoDto: CreateVolunteerInfoDto,
  ): Promise<VolunteerInfo> {
    return await this.volunteerInfoService.create(createvolunteerInfoDto);
  }
}
