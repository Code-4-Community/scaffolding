import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDTO } from './update-user.dto';
import { Status } from './types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: MongoRepository<User>,
  ) {}

  async create(email: string, firstName: string, lastName: string) {
    const userId = (await this.usersRepository.count()) + 1;
    const user = this.usersRepository.create({
      userId,
      status: Status.MEMBER,
      firstName,
      lastName,
      email,
    });

    return this.usersRepository.save(user);
  }

  async findAll(currentUser: User, getAllMembers: boolean): Promise<User[]> {
    if (!getAllMembers) return [];

    if (currentUser.status === Status.APPLICANT) {
      throw new UnauthorizedException();
    }

    const users: User[] = await this.usersRepository.find({
      where: {
        status: { $not: { $eq: Status.APPLICANT } },
      },
    });

    return users;
  }

  async findOne(currentUser: User, userId: number) {
    const user = await this.usersRepository.findOneBy({ userId });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const currentStatus = currentUser.status;
    const targetStatus = user.status;
    switch (currentStatus) {
      //admin can access all users
      case Status.ADMIN:
        break;
      //recruiter can access applicant, and themselves
      case Status.RECRUITER:
        if (targetStatus == Status.APPLICANT) {
          break;
        } else if (currentUser.userId !== user.userId) {
          throw new BadRequestException('User not found');
        }
        break;
      //everyone else can only access themselves
      default:
        if (currentUser.userId !== user.userId) {
          throw new BadRequestException('User not found');
        }
    }

    return user;
  }

  async updateUser(
    currentUser: User,
    updateUserDTO: UpdateUserDTO,
    userId: number,
  ): Promise<User> {
    const user: User = await this.usersRepository.findOne({
      where: {
        userId: { $eq: userId },
      },
    });

    if (!user) {
      throw new BadRequestException(`User ${userId} not found.`);
    }

    if (currentUser.status !== Status.ADMIN && userId !== currentUser.userId) {
      throw new UnauthorizedException();
    }

    await this.usersRepository.update({ userId }, updateUserDTO);
    return await this.usersRepository.findOne({
      where: {
        userId: { $eq: userId },
      },
    });
  }

  /* TODO merge these methods with the above methods */
  find(email: string) {
    return this.usersRepository.find({ where: { email } });
  }

  async update(currentUser: User, userId: number, attrs: Partial<User>) {
    const user = await this.findOne(currentUser, userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, attrs);

    return this.usersRepository.save(user);
  }

  async remove(currentUser: User, userId: number) {
    const user = await this.findOne(currentUser, userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.usersRepository.remove(user);
  }
  /* TODO merge these methods with the above methods */
}
