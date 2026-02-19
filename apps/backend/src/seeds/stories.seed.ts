import { DeepPartial } from 'typeorm';
import { Story } from '../story/story.entity';

export const StoriesSeed: DeepPartial<Story>[] = [
  {
    id: 1,
    title: 'Seed Story', // not obvious from omchai
    description: 'Description', // not obvious from omchai
    studentBio: 'Bio', // not obvious from bio
    theme: 'Looking ahead',
    anthologyId: 1,
    authorId: 1,
  },
  {
    id: 2,
    title: 'Another Story',
    description: 'Another description',
    studentBio: 'Another bio',
    theme: 'Most days I feel',
    anthologyId: 1,
    authorId: 2,
  },
];
