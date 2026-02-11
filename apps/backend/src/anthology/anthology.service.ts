import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Anthology } from './anthology.entity';
import { AnthologyStatus, AnthologyPubLevel } from './types';
import { Story } from '../story/story.entity';

@Injectable()
export class AnthologyService {
  constructor(
    @InjectRepository(Anthology) private repo: Repository<Anthology>,
    @InjectRepository(Story) private storyRepo: Repository<Story>,
  ) {}

  async create(
    title: string,
    description: string,
    published_year: number,
    status: AnthologyStatus,
    pub_level: AnthologyPubLevel,
    photo_url: string,
    isbn: string,
    shopify_url: string,
    programs?: string[],
  ) {
    const anthology = this.repo.create({
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

    return await this.repo.save(anthology);
  }

  async getStories(anthologyId: number) {
    const anthology = await this.repo.findOne({
      where: { id: anthologyId },
    });
    if (!anthology)
      throw new NotFoundException(`Anthology id ${anthologyId} not found`);
    return this.storyRepo.find({ where: { anthologyId } });
  }

  async edit(
    anthologyId: number,
    title?: string,
    description?: string,
    published_year?: number,
    status?: AnthologyStatus,
    pub_level?: AnthologyPubLevel,
    photo_url?: string,
    isbn?: string,
    shopify_url?: string,
    programs?: string[],
  ) {
    // verify anthology exists
    const anthology = await this.repo.findOne({ where: { id: anthologyId } });
    if (!anthology)
      throw new NotFoundException(`Story id ${anthologyId} not found`);
    if (title) anthology.title = title;
    if (description) anthology.description = description;
    if (published_year) anthology.published_year = published_year;
    if (status) anthology.status = status;
    if (pub_level) anthology.pub_level = pub_level;
    if (photo_url) anthology.photo_url = photo_url;
    if (isbn) anthology.isbn = isbn;
    if (shopify_url) anthology.shopify_url = shopify_url;
    if (programs) anthology.programs = programs;

    return await this.repo.save(anthology);
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
