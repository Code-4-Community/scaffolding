import { Anthology } from '../anthology/anthology.entity';
import { AnthologyPubLevel, AnthologyStatus } from '../anthology/types';
import { DeepPartial } from 'typeorm';

export const AnthologiesSeed: DeepPartial<Anthology>[] = [
  {
    id: 1,
    title: 'Walk A Mile in Our Shoes',

    description:
      '“Writing this book was fun and helpful for us, as we are happy to read about other students at BINcA. Getting to know their experiences and walk a mile in their shoes makes us feel important, like we are part of something great.',

    publishedDate: new Date('2025-12-17'),

    programs: ['BINcA'],

    status: AnthologyStatus.CAN_BE_SHARED,

    pubLevel: AnthologyPubLevel.CHAPBOOK,

    photoUrl: '',

    isbn: '',

    shopifyUrl: '',
  },
];
