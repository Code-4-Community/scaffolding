import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Anthology } from './anthology.entity';
import { AnthologyStatus, AnthologyPubLevel } from './types';

@Injectable()
export class AnthologyService {
  constructor(
    @InjectRepository(Anthology) private repo: Repository<Anthology>,
  ) {}

  async create(
    title: string,
    description: string,
    published_year: number,
    status: AnthologyStatus,
    pub_level: AnthologyPubLevel,
    programs?: string[],
    photo_url?: string,
    isbn?: string,
    shopify_url?: string,
  ) {
    const anthologyId = (await this.repo.count()) + 1;
    const anthology = this.repo.create({
      id: anthologyId,
      title,
      description,
      published_year,
      status,
      pub_level,
      programs,
      photo_url,
      isbn,
      shopify_url,
    });

    return this.repo.save(anthology);
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

  findByStatus(status: AnthologyStatus) {
    return this.repo.find({ where: { status } });
  }

  findByPubLevel(pub_level: AnthologyPubLevel) {
    return this.repo.find({ where: { pub_level } });
  }

  findByYear(published_year: number) {
    return this.repo.find({ where: { published_year } });
  }

  async update(id: number, attrs: Partial<Anthology>) {
    const anthology = await this.findOne(id);

    if (!anthology) {
      throw new NotFoundException('Anthology not found');
    }

    Object.assign(anthology, attrs);

    return this.repo.save(anthology);
  }

  async remove(id: number) {
    const anthology = await this.findOne(id);

    if (!anthology) {
      throw new NotFoundException('Anthology not found');
    }

    return this.repo.remove(anthology);
  }

  async updateStatus(id: number, status: AnthologyStatus) {
    const anthology = await this.findOne(id);

    if (!anthology) {
      throw new NotFoundException('Anthology not found');
    }

    anthology.status = status;
    return this.repo.save(anthology);
  }
}
