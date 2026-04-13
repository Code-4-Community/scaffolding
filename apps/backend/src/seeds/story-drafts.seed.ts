import { EditRound, SubmissionRound } from '../story-draft/types';

export interface StoryDraftSeedItem {
  storyTitle: string;
  authorId: number;
  docLink: string;
  submissionRound: SubmissionRound;
  studentConsent: boolean;
  inManuscript: boolean;
  editRound: EditRound;
  proofread: boolean;
  notes: string[];
  classPeriod: string;
}

export const StoryDraftsSeed: StoryDraftSeedItem[] = [
  {
    storyTitle: 'Standing at the Threshold',
    authorId: 1,
    docLink: 'https://docs.google.com/document/d/1aStandingAtTheThreshold',
    submissionRound: SubmissionRound.ONE,
    studentConsent: true,
    inManuscript: true,
    editRound: EditRound.TWO,
    proofread: true,
    notes: [],
    classPeriod: 'Edwards 1/6',
  },
  {
    storyTitle: 'Saturday Mornings',
    authorId: 2,
    docLink: 'https://docs.google.com/document/d/2aSaturdayMornings',
    submissionRound: SubmissionRound.TWO,
    studentConsent: true,
    inManuscript: true,
    editRound: EditRound.ONE,
    proofread: false,
    notes: ['Needs formatting review', 'Check dialogue punctuation'],
    classPeriod: 'Edwards 1/6',
  },
  {
    storyTitle: 'The River Remembers',
    authorId: 3,
    docLink: 'https://docs.google.com/document/d/3aTheRiverRemembers',
    submissionRound: SubmissionRound.ONE,
    studentConsent: true,
    inManuscript: true,
    editRound: EditRound.TWO,
    proofread: true,
    notes: [],
    classPeriod: 'Shin 3/5',
  },
  {
    storyTitle: 'Borrowed Words',
    authorId: 4,
    docLink: 'https://docs.google.com/document/d/4aBorrowedWords',
    submissionRound: SubmissionRound.THREE,
    studentConsent: false,
    inManuscript: false,
    editRound: EditRound.ONE,
    proofread: false,
    notes: ['Awaiting parental consent form'],
    classPeriod: 'Fuentes 2/4',
  },
  {
    storyTitle: '3:17 AM',
    authorId: 5,
    docLink: 'https://docs.google.com/document/d/5a317AM',
    submissionRound: SubmissionRound.TWO,
    studentConsent: true,
    inManuscript: true,
    editRound: EditRound.TWO,
    proofread: true,
    notes: ['Final version approved by author'],
    classPeriod: 'Nakamura 5/7',
  },
];
