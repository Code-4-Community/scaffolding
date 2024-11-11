import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel, Role } from './user.model';
import { NewUserInput } from '../dtos/newUserDTO';

/**
 * The controller for user endpoints.
 */
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  public async getUser(@Param('id') userId?: number): Promise<UserModel> {
    return this.userService.getUser(userId);
  }

  @Post('addVolunteer')
  public async addVolunteer(@Body() userData: NewUserInput) {
    return this.userService.postUser(userData, Role.VOLUNTEER);
  }

  @Post('addAdmin')
  public async addAdmin(@Body() userData: NewUserInput) {
    return this.userService.postUser(userData, Role.ADMIN);
  }

  @Get(':id/sites')
  public async getUserSites(@Param('id') userId?: number): Promise<any> {
    return this.userService.getUserTables(userId);
  }
}
