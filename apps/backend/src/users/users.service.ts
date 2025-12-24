import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { Status } from './types';

/**
 * Service to interface with the user repository
 */
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  /**
   * A method to create a user in the repository
   * @param email email of the user to create
   * @param firstName first name of the user to create
   * @param lastName last name of the user to create
   * @param status status or position of the user to create, e.g. standard or admin
   * @returns the created user
   * @throws whatever the repository may throw
   */
  async create(
    email: string,
    firstName: string,
    lastName: string,
    status: Status = Status.STANDARD,
  ) {
    const userId = (await this.repo.count()) + 1;
    const user = this.repo.create({
      id: userId,
      status,
      firstName,
      lastName,
      email,
    });

    return this.repo.save(user);
  }

  /**
   * A method to return the data of a user from the repository by id
   * @param id the id of the user to find
   * @returns the desired user if they exist
   * @throws anything that the repository throws
   */
  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  /**
   * A method to return the data of a user from the repository by email
   * @param email the email of the user to find
   * @returns the desired user if they exist
   * @throws anything that the repository throws
   */
  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  /**
   * A method to update a user by id with any desired new field values
   * @param id the id of the user to update
   * @param attrs any desired new fields values to replace
   * @returns the newly modified user
   * @throws NotFoundException if a user of the specified id doesn't exist in the repository.
   *         Anything that the repository throws
   */
  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  /**
   * A method to remove a user by id
   * @param id the id of the user to delete
   * @throws NotFoundException if a user of specified id doesn't exist in the repository.
   *         Anything that the repository throws.
   *
   * Does not return a value.
   */
  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repo.remove(user);
  }
}
