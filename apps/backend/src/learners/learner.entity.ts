import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Learner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'app_id' })
  appId: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;
}
