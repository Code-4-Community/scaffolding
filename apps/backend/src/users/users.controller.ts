import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:userId')
  async getUser(@Param('userId') userId: string): Promise<User> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // Example endpoint for email sending (DO NOT DEPLOY THIS)
  /*
  @Post('/test-email')
  sendTestEmail(@Body() body: { recipient: string }) {
    return this.usersService.sendTestEmail(body.recipient);
  }
  */
}
