import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from 'typeorm';
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
  genre?: string;

  @Column()
  theme?: string;

  @Column({ type: 'int' })
  anthologyId: number;

  @Column({ type: 'int' })
  authorId: number;
}
