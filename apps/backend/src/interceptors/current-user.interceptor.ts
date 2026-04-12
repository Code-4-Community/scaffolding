import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

/**
 * Injects the database user into the payload based on the previously
 * set email and idUser in the payload (from JWTVerification)
 */
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  /**
   * Injects the database user into the payload based on the previously
   * set email and idUser in the payload (from JWTVerification)
   * @param context execution context used to get payload
   * @param handler used to advance the execution flow.
   */
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();

    if (!request.user || !request.user.idUser || !request.user.email) {
      return handler.handle();
    }

    const user = await this.usersService.findOne(request.user.email);

    if (user) {
      request.user = user;
    }

    return handler.handle();
  }
}
