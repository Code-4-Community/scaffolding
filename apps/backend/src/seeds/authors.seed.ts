import { Author } from 'src/author/author.entity';
import { DeepPartial } from 'typeorm';

export const AuthorsSeed: DeepPartial<Author>[] = [
  {
    id: 1,
    name: 'Abdullah Syed Abid',
    classPeriod: 'Edwards 1/6',
    nameInBook: 'Abdullah',
  },
  {
    id: 2,
    name: 'Sylvestre Ahday',
    classPeriod: 'Edwards 1/6',
  },
];
