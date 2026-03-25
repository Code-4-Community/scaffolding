import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { Status } from './types';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(
    email: string,
    firstName: string,
    lastName: string,
    status: Status = Status.VOLUNTEER,
    publishingName?: string,
  ) {
    const maxIdRow = await this.repo
      .createQueryBuilder('user')
      .select('MAX(user.id)', 'maxId')
      .getRawOne<{ maxId: string | null }>();
    const userId = (Number(maxIdRow?.maxId) || 0) + 1;

    const user = this.repo.create({
      id: userId,
      status,
      firstName,
      lastName,
      email,
      publishingName,
    });

    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repo.remove(user);
  }
}
