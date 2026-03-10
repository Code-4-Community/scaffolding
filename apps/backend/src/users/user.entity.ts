import { Entity, Column, OneToMany, Relation } from 'typeorm';

import { Status } from './types';
import { Omchai } from 'src/omchai/omchai.entity';

@Entity()
export class User {
  @Column({ primary: true })
  id: number;

  @Column({ type: 'enum', enum: Status })
  status: Status;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name', default: '' })
  lastName: string;

  @Column({ default: '' })
  email: string;

  @Column({ name: 'publishing_name', nullable: true })
  publishingName?: string;

  @Column({ nullable: true })
  name?: string;

  @OneToMany(() => Omchai, (omchai) => omchai.user)
  omchaiAssignments: Relation<Omchai[]>;
}
