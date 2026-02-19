import { Anthology } from '../anthology/anthology.entity';
import {
  AgeCategory,
  AnthologyPubLevel,
  AnthologyStatus,
} from '../anthology/types';
import { DeepPartial } from 'typeorm';

export const AnthologiesSeed: DeepPartial<Anthology>[] = [
  {
    id: 1,
    title: 'Walk A Mile in Our Shoes',
    byline:
      'Personal Narrative by 9th Grade Students at Boston International Newcomers Academy',
    genres: ['Personal Narratives', 'Prose', 'Nonfiction'],
    themes: [
      'Culture',
      'Identity',
      'Immigration',
      'Tradition',
      'Family',
      'The Future',
      'Goals',
    ],
    description:
      '“Writing this book was fun and helpful for us, as we are happy to read about other students at BINcA. Getting to know their experiences and walk a mile in their shoes makes us feel important, like we are part of something great.',
    triggers: ['Profanity', 'Physical or Verbal Abuse'],
    publishedDate: new Date('2025-12-17'),

    programs: ['BINcA'],

    status: AnthologyStatus.CAN_BE_SHARED,
    // partners ?
    ageCategory: AgeCategory.YA,

    pubLevel: AnthologyPubLevel.CHAPBOOK,

    photoUrl: '',

    isbn: '979-8-88694-119-7',

    shopifyUrl: '',
  },
];
