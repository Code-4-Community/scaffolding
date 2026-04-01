import { SetMetadata } from '@nestjs/common';
import { OmchaiRole } from 'src/omchai/omchai.entity';
import { Status } from 'src/users/types';

// Key used to store roles metadata
export const OMCHAI_ROLES = 'omchai_roles';
// Custom decorator to set roles metadata on route handlers for proper parsing by RolesGuard
export const OmchaiRoles = (...roles: OmchaiRole[]) =>
  SetMetadata(OMCHAI_ROLES, roles);

export const USER_STATUS = 'user_status';
export const UserStatus = (...statuses: Status[]) =>
  SetMetadata(USER_STATUS, statuses);
