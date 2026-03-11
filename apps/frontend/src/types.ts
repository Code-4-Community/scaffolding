import { PUB_LEVEL_OPTIONS } from '@containers/archived-publications/filter-modal/constants';

export enum AnthologyStatus {
  ARCHIVED = 'Archived',
  NOT_STARTED = 'NotStarted',
  DRAFTING = 'Drafting',
  CAN_BE_SHARED = 'CanBeShared',
}

export enum AnthologyPubLevel {
  ZINE = 'Zine',
  CHAPBOOK = 'Chapbook',
  PERFECT_BOUND = 'PerfectBound',
  SIGNATURE = 'Signature',
}

export interface Author {
  id: number;
  name: string;
  bio?: string;
  grade?: number;
}

export interface Story {
  id: number;
  title: string;
  description?: string;
  studentBio?: string;
  genre?: string;
  theme?: string;
  anthologyId: number;
  anthology?: Anthology;
  authorId: number;
  author?: Author;
}

export enum AnthologyProgram {
  TUTORING = 'Tutoring',
  WRITERS_ROOM = "Writer's Room",
  STEM_LITERACY = 'STEM Literacy',
  SCHOOL_PARTNERSHIP = 'School Partnership',
  YOUNG_AUTHORS = 'Young Authors',
}

export enum AnthologyGenre {
  MYSTERY = 'Mystery',
  FANTASY = 'Fantasy',
  HISTORICAL_FICTION = 'Historical Fiction',
  ROMANCE = 'Romance',
  COMEDY = 'Comedy',
  POETRY = 'Poetry',
}

export enum SortOption {
  TITLE_ASC = 'title-asc',
  AUTHOR_ASC = 'author-asc',
  DATE_NEWEST = 'date-newest',
  DATE_OLDEST = 'date-oldest',
}

export interface FilterState {
  sortBy: SortOption;
  pubDateStart: string;
  pubDateEnd: string;
  pubLevels: AnthologyPubLevel[];
  programs: AnthologyProgram[];
  genres: AnthologyGenre[];
  inventoryMin: string;
  inventoryMax: string;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  sortBy: SortOption.TITLE_ASC,
  pubDateStart: '',
  pubDateEnd: '',
  pubLevels: [
    AnthologyPubLevel.CHAPBOOK,
    AnthologyPubLevel.ZINE,
    AnthologyPubLevel.PERFECT_BOUND,
    AnthologyPubLevel.SIGNATURE,
  ],
  programs: [
    AnthologyProgram.SCHOOL_PARTNERSHIP,
    AnthologyProgram.STEM_LITERACY,
    AnthologyProgram.TUTORING,
    AnthologyProgram.WRITERS_ROOM,
    AnthologyProgram.YOUNG_AUTHORS,
  ],
  genres: [],
  inventoryMin: '',
  inventoryMax: '',
};

export interface Anthology {
  id: number;
  title: string;
  description: string;
  published_year: number;
  programs?: string[] | string;
  inventory?: number;
  status: AnthologyStatus;
  pub_level: AnthologyPubLevel;
  photo_url?: string;
  genres?: string[];
  themes?: string[];
  isbn?: string;
  shopify_url?: string;

  // Missing from backend
  subtitle?: string;
  byline?: string;
  praise_quotes?: string;
  foreword_author?: string;
  age_category?: string;
  dimensions?: string;
  binding_type?: string;
  page_count?: number;
  print_run?: number;
  printed_by?: string;
  number_of_students?: number;
  printing_cost?: string;
  weight?: string;
  // Inventory breakdown locations
  inventory_locations?: Record<string, number>;
}
