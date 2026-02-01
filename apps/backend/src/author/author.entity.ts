import { Entity, Column } from 'typeorm';

@Entity()
export class Author {
  @Column({ primary: true })
  id: number;

  @Column()
  name: string;

  @Column()
  bio: string;

  @Column({ type: 'int' })
  grade: number;
}
