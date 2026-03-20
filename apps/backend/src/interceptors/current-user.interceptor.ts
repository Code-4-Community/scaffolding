import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();

    if (!request.user || !request.user.idUser) {
      return handler.handle();
    }

    const cognitoUserAttributes = await this.authService.getUser(
      request.user.idUser,
    );
    const userEmail = cognitoUserAttributes.find(
      (attribute) => attribute.Name === 'email',
    ).Value;
    const user = await this.usersService.findOne(userEmail);

    if (user) {
      request.user = user;
    }

    return handler.handle();
  }
}
