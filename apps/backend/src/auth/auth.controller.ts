import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Status } from '../users/types';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';

interface AuthenticatedUserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'volunteer';
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(CurrentUserInterceptor)
  @Get('/me')
  async me(@Req() request): Promise<AuthenticatedUserResponse> {
    const user = request.user;

    if (!user?.id) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.status === Status.ADMIN ? 'admin' : 'volunteer',
    };
  }

  @Post('/delete')
  async delete(@Body() body: DeleteUserDto): Promise<void> {
    const user = await this.usersService.findOne(body.userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    try {
      await this.authService.deleteUser(user.email);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }

    this.usersService.remove(user.id);
  }
}
