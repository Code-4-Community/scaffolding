import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { randomUUID } from 'crypto';
import { Status } from './types';
import { User, UserKey } from './user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
  ) {}

  async create(email: string, firstName: string, lastName: string) {
    const userId = randomUUID();
    return this.userModel.create({
      id: userId,
      status: Status.STANDARD,
      firstName,
      lastName,
      email,
    });
  }

  findOne(id: string) {
    if (!id) {
      return null;
    }

    return this.userModel.get({ id });
  }

  async findByEmail(email: string) {
    return this.userModel.scan({ email: { eq: email } }).exec();
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, attrs);

    return this.userModel.update({ id }, user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userModel.delete({ id });
  }
}
