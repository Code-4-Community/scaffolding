import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './types';

import { User } from './user.entity';
import { getCurrentUser } from './utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(userId: number) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const currentUser = getCurrentUser();

    const currentStatus = currentUser.status;
    const targetStatus = user.status;
    switch (currentStatus) {
      case Status.RECRUITER:
        if (targetStatus === Status.ADMIN) {
          throw new BadRequestException('User not found');
        }
        break;
      case Status.APPLICANT:
        if (currentUser.id !== user.id) {
          throw new BadRequestException('User not found');
        }
        break;
      case Status.MEMBER:
      case Status.ALUMNI:
        if (currentUser.status === Status.APPLICANT) {
          throw new BadRequestException('User not found');
        }
        break;
    }

    return user;
  }
}
