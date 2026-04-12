import {
  Controller,
  Delete,
  Get,
  Param,
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
 * Email is the primary key; use encoded email in path (e.g. user%40example.com).
 */
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Exposes an endpoint to get all users.
   * @returns All users in the system.
   */
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * Exposes an endpoint to get a user's information by their email.
   * @param email The email of the desired user (URL-encoded).
   * @returns The user with the corresponding email or null if not found.
   */
  @Get('email/:email')
  async getUser(@Param('email') email: string): Promise<User | null> {
    const decoded = decodeURIComponent(email);
    return this.usersService.findOne(decoded);
  }

  /**
   * Exposes an endpoint to delete a user by their email.
   * @param email The email of the user to delete (URL-encoded).
   */
  @Delete('email/:email')
  async removeUser(@Param('email') email: string): Promise<void> {
    const decoded = decodeURIComponent(email);
    await this.usersService.remove(decoded);
  }
}
