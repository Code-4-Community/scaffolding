import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Session,
} from '@nestjs/common';

import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { VerifyUserDto } from './dtos/verify-user.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: SignUpDto) {
    try {
      await this.authService.signup(body.email, body.password);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    const user = await this.usersService.create(
      body.email,
      body.firstName,
      body.lastName,
    );

    return user;
  }

  @Post('/verify')
  async verifyUser(@Body() body: VerifyUserDto) {
    try {
      await this.authService.verifyUser(
        body.email,
        String(body.verificationCode),
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('/signin')
  async signin(@Body() body: SignInDto, @Session() session) {
    const userSession = await this.authService.signin(
      body.email,
      body.password,
    );

    // session.userId = user.id;

    // TODO exclude unnecessary fields in `userSession`
    return userSession;
  }

  @Post('/signout')
  signOut(@Session() session) {
    // session.userId = null;
  }

  @Post('/delete')
  async delete(@Body() body: DeleteUserDto) {
    const user = await this.usersService.findOne(body.userId);

    try {
      await this.authService.deleteUser(user.email);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    this.usersService.remove(user.id);
  }
}
