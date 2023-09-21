import { Body, Controller, Logger, Post, Session } from '@nestjs/common';

import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: SignUpDto, @Session() session) {
    await this.authService.signup(body.email, body.password);
    const user = await this.usersService.create(
      body.email,
      body.firstName,
      body.lastName,
    );

    Logger.log('signup');
    Logger.log(user);
    // session.userId = user.id;

    return user;
  }

  @Post('/signin')
  async signin(@Body() body: SignInDto, @Session() session) {
    const user = await this.authService.signin(body.email, body.password);

    // session.userId = user.id;

    return user;
  }

  @Post('/signout')
  signOut(@Session() session) {
    // session.userId = null;
  }
}
