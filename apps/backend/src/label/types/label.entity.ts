import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Task } from '../../task/types/task.entity';

@Entity()
export class Label {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  color: string;

  @ManyToMany(() => Task, (task) => task.labels)
  tasks: Task[];
}
