import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';

import { Anthology } from './anthology.entity';
import { AgeCategory, AnthologyStatus, AnthologyPubLevel } from './types';

@Injectable()
export class AnthologyService {
  constructor(
    @InjectRepository(Anthology) private repo: Repository<Anthology>,
  ) {}

  async create(
    title: string,
    description: string,
    publishedDate: string,
    status: AnthologyStatus,
    pubLevel: AnthologyPubLevel,
    programs?: string[],
    photoUrl?: string,
    isbn?: string,
    shopifyUrl?: string,
  ) {
    const anthologyId = (await this.repo.count()) + 1;
    const anthology = this.repo.create({
      id: anthologyId,
      title,
      description,
      publishedDate,
      status,
      pubLevel,
      programs,
      photoUrl,
      isbn,
      shopifyUrl,
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

  findByPubLevel(pubLevel: AnthologyPubLevel) {
    return this.repo.find({ where: { pubLevel } });
  }

  findByYear(publishedDate: Date) {
    return this.repo.find({ where: { publishedDate } });
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

  findAllSortedByTitle(): Promise<Anthology[]> {
    return this.repo.find({ order: { title: 'ASC' } });
  }

  findAllSortedByDateRecent(): Promise<Anthology[]> {
    return this.repo.find({ order: { publishedDate: 'DESC' } });
  }

  findAllSortedByDateOldest(): Promise<Anthology[]> {
    return this.repo.find({ order: { publishedDate: 'ASC' } });
  }

  findByAgeCategory(ageCategory: AgeCategory): Promise<Anthology[]> {
    return this.repo.find({ where: { ageCategory } });
  }

  findByPubDateRange(start: string, end: string): Promise<Anthology[]> {
    return this.repo.find({
      where: { publishedDate: Between(new Date(start), new Date(end)) },
    });
  }

  findByGenre(genre: string): Promise<Anthology[]> {
    return this.repo.find({ where: { genres: ILike(`%${genre}%`) } });
  }

  findByProgram(program: string): Promise<Anthology[]> {
    return this.repo.find({ where: { programs: ILike(`%${program}%`) } });
  }
}
