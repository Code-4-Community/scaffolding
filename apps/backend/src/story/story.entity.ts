import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
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

  @Column({ name: 'author_id' })
  authorId: number;
}
