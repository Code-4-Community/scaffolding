import { DeepPartial } from "typeorm";
import { Story } from "../story/story.entity";

export const StoriesSeed: DeepPartial<Story>[] = [
  {
    id: 1,
    title: 'Seed Story',
    description: 'Description',
    studentBio: 'Bio',
    genre: 'Genre',
    theme: 'Theme',
    anthology: null,
    author: null,
  },
];