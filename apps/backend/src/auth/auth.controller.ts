import { Body, Controller, Logger, Post, Session } from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);

    Logger.log('signup');
    Logger.log(user);
    // session.userId = user.id;

    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);

    // session.userId = user.id;

    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    // session.userId = null;
  }
}
