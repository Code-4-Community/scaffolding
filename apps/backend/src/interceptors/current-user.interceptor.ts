import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const userEmail = request.user?.email;

    if (!userEmail) {
      return handler.handle();
    }

    const users = await this.usersService.find(userEmail);

    if (users.length > 0) {
      const user = users[0];

      request.user = user;
    }

    return handler.handle();
  }
}
