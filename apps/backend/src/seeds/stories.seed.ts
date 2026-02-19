import { DeepPartial } from 'typeorm';
import { Story } from '../story/story.entity';

export const StoriesSeed: DeepPartial<Story>[] = [
  {
    id: 1,
    title: 'Seed Story',
    description: 'Description',
    studentBio: 'Bio',
    genre: 'Genre',
    theme: 'Theme',
    anthologyId: 1,
    authorId: 1,
  },
  {
    id: 2,
    title: 'Another Story',
    description: 'Another description',
    studentBio: 'Another bio',
    genre: 'Fiction',
    theme: 'Adventure',
    anthologyId: 1,
    authorId: 2,
  },
];
