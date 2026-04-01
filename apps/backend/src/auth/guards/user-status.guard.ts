import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_STATUS } from '../roles.decorator';
import { Status } from 'src/users/types';
import { User } from 'src/users/user.entity';

@Injectable()
export class UserStatusGuard implements CanActivate {
  private readonly logger = new Logger(UserStatusGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredStatuses = this.reflector.getAllAndOverride<Status[]>(
      USER_STATUS,
      [context.getHandler(), context.getClass()],
    );

    // no decorator
    if (!requiredStatuses || requiredStatuses.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    // no user
    if (!user || !user.status) {
      this.logger.warn(
        `UserStatusGuard: denied — no user or status on request (required: [${requiredStatuses.join(
          ', ',
        )}])`,
      );
      return false;
    }

    const allowed = requiredStatuses.includes(user.status);
    if (allowed) {
      this.logger.debug(
        `UserStatusGuard: granted — user status "${user.status}"`,
      );
    } else {
      this.logger.warn(
        `UserStatusGuard: denied — user status "${
          user.status
        }", required: [${requiredStatuses.join(', ')}]`,
      );
    }
    return allowed;
  }
}
