import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { Story } from './story.entity';
import { AnthologyService } from '../anthology/anthology.service';
import { Anthology } from '../anthology/anthology.entity';
import { Author } from '../author/author.entity';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story) private storyRepo: Repository<Story>,
    // note anthology/author are only used for existence checks
    @InjectRepository(Anthology) private anthologyRepo: Repository<Anthology>,
    @InjectRepository(Author) private authorRepo: Repository<Author>,
  ) {}

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.storyRepo.findOneBy({ id });
  }

  findAll() {
    return this.storyRepo.find();
  }

  findByTitle(title: string) {
    return this.storyRepo.find({ where: { title } });
  }

  findByGenre(genre: string) {
    return this.storyRepo.find({ where: { genre } });
  }

  findByTheme(theme: string) {
    return this.storyRepo.find({ where: { theme } });
  }

  async update(id: number, attrs: Partial<Story>) {
    const story = await this.findOne(id);

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    Object.assign(story, attrs);

    return this.storyRepo.save(story);
  }

  async remove(id: number) {
    const story = await this.findOne(id);

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    return this.storyRepo.remove(story);
  }

  async createStory(
    title: string,
    anthologyId: number,
    authorId: number,
    studentBio?: string,
    description?: string,
    genre?: string,
    theme?: string,
  ): Promise<Story> {
    const anthology = await this.anthologyRepo.findOne({
      where: { id: anthologyId },
    });
    const author = await this.authorRepo.findOne({ where: { id: authorId } });
    if (!anthology || !author) {
      throw new NotFoundException('Anthology or author not found');
    }
    const storyId = (await this.storyRepo.count()) + 1;
    const story = this.storyRepo.create({
      id: storyId,
      title,
      studentBio,
      description,
      genre,
      theme,
      author: { id: authorId },
      anthology: { id: anthologyId },
    });

    await this.storyRepo.save(story);

    return story;
  }

  async editStory(
    storyId: number,
    title?: string,
    anthologyId?: number,
    authorId?: number,
    studentBio?: string,
    description?: string,
    genre?: string,
    theme?: string,
  ): Promise<Story> {
    // verify story exists
    const story = await this.storyRepo.findOne({ where: { id: storyId } });
    if (!story) throw new NotFoundException(`Story id ${storyId} not found`);
    // verify anthologyId / authorIds exist
    if (authorId) {
      const newAuthor = await this.authorRepo.findOne({
        where: { id: authorId },
      });
      if (!newAuthor)
        throw new NotFoundException(
          `Incoming author id ${authorId} does not exist`,
        );
      story.author = newAuthor;
    }
    if (anthologyId) {
      const newAnthology = await this.anthologyRepo.findOne({
        where: { id: anthologyId },
      });
      if (!newAnthology)
        throw new NotFoundException(
          `Incoming anthology id ${anthologyId} does not exist`,
        );
      story.anthology = newAnthology;
    }
    if (title) story.title = title;
    if (studentBio) story.studentBio = studentBio;
    if (description) story.description = description;
    if (genre) story.genre = genre;
    if (theme) story.theme = theme;
    return await this.storyRepo.save(story);
  }
}
