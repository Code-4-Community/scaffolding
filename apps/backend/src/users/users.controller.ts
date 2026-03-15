import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

/**
 * Controller to expose callable HTTP endpoints to
 * extract information about the app's users or delete them.
 */
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Exposes an endpoint to get a user's information by their id.
   * @param userId the id of the desired user to get information about.
   * @returns the user with the corresponding id or null if the user was not found.
   * @throws {Error} anything that the repository throws.
   */
  @Get('/:userId')
  async getUser(@Param('userId', ParseIntPipe) userId: number): Promise<User> {
    return this.usersService.findOne(userId);
  }

  /**
   * Exposes an endpoint to delete a user by their id.
   * @param appId the id of the user to delete.
   * @throws {Error} anything that the repository throws.
   * @throws {NotFoundException} if a user with the specified id does not exist.
   *
   * Does not return a value.
   */
  @Delete('/:appId')
  removeUser(@Param('appId', ParseIntPipe) appId: number) {
    return this.usersService.remove(appId);
  }
}
