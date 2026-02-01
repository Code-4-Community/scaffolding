import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';

@Injectable()
export class AuthorService {
  constructor(@InjectRepository(Author) private repo: Repository<Author>) {}

  async create(name: string, bio: string, grade: number) {
    const id = (await this.repo.count()) + 1;
    const author = this.repo.create({
      id: id,
      name: name,
      bio: bio,
      grade: grade,
    });

    return this.repo.save(author);
  }

  async remove(id: number) {
    const author = await this.findOne(id);

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    return this.repo.remove(author);
  }

  async update(id: number, attrs: Partial<Author>) {
    const author = await this.findOne(id);

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    Object.assign(author, attrs);

    return this.repo.save(author);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  findAll() {
    return this.repo.find();
  }
}
