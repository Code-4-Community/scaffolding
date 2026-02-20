import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'class_period' })
  classPeriod: string;

  @Column({
    name: 'name_in_book',
    nullable: true,
  })
  nameInBook: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true, type: 'int' })
  grade: number;
}
