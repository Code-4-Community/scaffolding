import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { TaskCategory } from './category'; // Adjust path as needed
import { Label } from '../../label/types/label.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  dateCreated: Date;

  @Column({ nullable: true })
  dueDate?: Date;

  @ManyToMany(() => Label, (label) => label.tasks, { cascade: true })
  @JoinTable()
  labels: Label[];

  @Column({
    type: 'enum',
    enum: TaskCategory,
    default: TaskCategory.DRAFT,
  })
  category: TaskCategory;
}
