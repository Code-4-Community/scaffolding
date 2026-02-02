import { PrimaryGeneratedColumn, Entity, Column } from 'typeorm';

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

  @Column({ type: 'int', nullable: true })
  anthology_id: number;

  @Column({ type: 'int', nullable: true })
  author_id: number;
}
