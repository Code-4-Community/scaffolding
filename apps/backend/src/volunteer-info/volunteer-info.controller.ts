import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VolunteerInfo } from './volunteer-info.entity';
import { ApiTags } from '@nestjs/swagger';
import { VolunteerInfoService } from './volunteer-info.service';
import { CreateVolunteerInfoDto } from './dto/create-volunteer-info.request.dto';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { UserType } from '../users/types';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

/**
 * Controller to expose HTTP endpoints to interface, extract, and change information about volunteer-specific application info.
 */
@ApiTags('volunteerInfo')
@Controller('volunteer_info')
@UseInterceptors(CurrentUserInterceptor)
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class VolunteerInfoController {
  constructor(private volunteerInfoService: VolunteerInfoService) {}

  /**
   * Exposes an endpoint to create a volunteer info.
   * @param createvolunteerInfoDto The expected data required to create a volunteer specific info object
   * @returns The newly created application.
   * @throws {Error} which is unchanged from what repository throws.
   */
  @Post()
  @Roles(UserType.ADMIN)
  async createVolunteerInfo(
    @Body() createvolunteerInfoDto: CreateVolunteerInfoDto,
  ): Promise<VolunteerInfo> {
    return await this.volunteerInfoService.create(createvolunteerInfoDto);
  }

  /**
   * Exposes an endpoint to retrieve a volunteer info by appId.
   * @param appId The appId of the volunteer info to be returned.
   * @returns The volunteer info with the given appId.
   * @throws {Error} If the repository throws an error.
   * @throws {NotFoundException} with message 'volunteer Info with AppId <id> not found'
   *         if an application with that id does not exist.
   * @throws {BadRequestException} if the id field is invalid (e.g. null or undefined)
   */
  @Get('/:appId')
  @Roles(UserType.ADMIN)
  async getVolunteerInfo(
    @Param('appId') appId: number,
  ): Promise<VolunteerInfo> {
    return await this.volunteerInfoService.findById(appId);
  }
}
