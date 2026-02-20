import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { Anthology } from '../anthology/anthology.entity';
import { Author } from '../author/author.entity';

@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description?: string;

  @Column()
  studentBio?: string;

  @Column()
  theme?: string;

  @Column({ name: 'anthology_id' })
  anthologyId: number;

  @ManyToOne(() => Anthology, (anthology) => anthology.stories)
  anthology: Relation<Anthology>;

  @Column({ name: 'author_id' })
  authorId: number;
}
