import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Story } from '../story/story.entity';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true, type: 'int' })
  grade: number;

  @OneToMany(() => Story, (story) => story.author)
  stories: Story[];
}
