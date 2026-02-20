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
  },

  {
    id: 2,
    title: 'Utopia vs. Dystopia',
    byline:
      'Personal Narrative by 9th Grade Students at Boston International Newcomers Academy',
    genres: ['Fiction', 'Flash Fiction'],
    themes: ['Dystopia/Utopia'],
    description:
      "Through our stories, we want to explore what it feels to be human and how society sometimes forgets what humanity actually is. Utopia vs. Dystopia: The Future We're Heading Toward is a collection of dystopian flash fiction stories written by 10th-grade students in Ms. Shin's English class at the John D. O'Bryant School of Mathematics and Science.",
    publishedDate: new Date('2025-06-30'),

    programs: ['OB'],

    status: AnthologyStatus.CAN_BE_SHARED,
    // partners ?
    ageCategory: AgeCategory.YA,

    pubLevel: AnthologyPubLevel.CHAPBOOK,

    isbn: '979-8-88694-093-0',
  },
];
