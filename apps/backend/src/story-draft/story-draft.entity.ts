import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EditRound, SubmissionRound } from './types';

@Entity()
export class StoryDraft {
  @PrimaryGeneratedColumn()
  id: number;

  authorId: number;

  @Column()
  docLink: string;

  @Column()
  submissionRound: SubmissionRound;

  @Column()
  studentConsent: boolean;

  @Column()
  inManuscript: boolean;

  @Column()
  editRound: EditRound;

  @Column()
  proofread: boolean;

  @Column('text', { array: true })
  notes: string[];
}
