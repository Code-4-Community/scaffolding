import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { Status } from './types';

/**
 * Service to interface with the user repository.
 */
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  /**
   * Creates a user in the repository.
   * @param email Email of the user to create.
   * @param firstName First name of the user to create.
   * @param lastName Last name of the user to create.
   * @param status Status or position of the user to create (e.g. standard or admin).
   * @returns The created user.
   * @throws {Error} If the repository throws an error.
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
   * Returns the data of a user from the repository by id.
   * @param id The id of the user to find.
   * @returns The desired user if they exist.
   * @throws {Error} If the repository throws an error.
   */
  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  /**
   * Returns the data of a user from the repository by email.
   * @param email The email of the user to find.
   * @returns The desired user if they exist.
   * @throws {Error} If the repository throws an error.
   */
  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  /**
   * Updates a user by id with any desired new field values.
   * @param id The id of the user to update.
   * @param attrs Any desired new field values to apply.
   * @returns The updated user.
   * @throws {NotFoundException} if a user of the specified id doesn't exist in the repository.
   * @throws {Error} Also throws any error the repository throws.
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
   * Removes a user by id.
   * @param id The id of the user to delete.
   * @throws {NotFoundException} if a user of the specified id doesn't exist in the repository.
   * @throws {Error} Also throws any error the repository throws.
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
