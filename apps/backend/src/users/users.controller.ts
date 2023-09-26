import { Controller, Get, Param } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  //TODO get method
  @Get('/:userId')
  getUser(@Param('userId') userId: string) {
    return this.usersService.findOne(parseInt(userId));
  }
}
