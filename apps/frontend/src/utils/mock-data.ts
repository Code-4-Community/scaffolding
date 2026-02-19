import {
  Anthology,
  AnthologyStatus,
  AnthologyPubLevel,
  Author,
  Story,
} from '../types';

// Mock Authors
export const MOCK_AUTHORS: Author[] = [
  { id: 1, name: 'Maria Santos' },
  { id: 2, name: 'James Chen' },
  { id: 3, name: 'Aisha Johnson' },
  { id: 4, name: 'David Kim' },
  { id: 5, name: 'Sofia Rodriguez' },
  { id: 6, name: 'Zachary Abusheleih' },
  { id: 7, name: 'Pablo Arduini' },
  { id: 8, name: 'Marwa Bacare' },
  { id: 9, name: 'Emma-Rose Bernard' },
  { id: 10, name: 'Naveen Bhatt' },
  { id: 11, name: 'Rohan Bhatt' },
  { id: 12, name: 'Inari Braxton' },
  { id: 13, name: 'Kamila Burgos Cruz' },
  { id: 14, name: 'Edwin Chen' },
  { id: 15, name: 'Alice Chung' },
  { id: 16, name: 'A. Lee' },
  { id: 17, name: 'M. Torres' },
  { id: 18, name: 'Jamal Wright' },
  { id: 19, name: 'Student Contributors' },
  { id: 20, name: 'K. Chen' },
  { id: 21, name: 'R. Patel' },
  { id: 22, name: 'S. Johnson' },
  { id: 23, name: 'Community Writers' },
  { id: 24, name: 'M. Williams' },
  { id: 25, name: 'D. Brown' },
  { id: 26, name: '826 Boston Students' },
];

// Mock Stories
export const MOCK_STORIES: Story[] = [
  // Anthology 1: What if the World Needs You?
  { id: 1, title: 'Story 1', anthologyId: 1, authorId: 1 },
  { id: 2, title: 'Story 2', anthologyId: 1, authorId: 2 },
  { id: 3, title: 'Story 3', anthologyId: 1, authorId: 3 },
  { id: 4, title: 'Story 4', anthologyId: 1, authorId: 4 },
  { id: 5, title: 'Story 5', anthologyId: 1, authorId: 5 },

  // Anthology 2: I Was Meant For This
  { id: 6, title: 'Story 1', anthologyId: 2, authorId: 6 },
  { id: 7, title: 'Story 2', anthologyId: 2, authorId: 7 },
  { id: 8, title: 'Story 3', anthologyId: 2, authorId: 8 },
  { id: 9, title: 'Story 4', anthologyId: 2, authorId: 9 },
  { id: 10, title: 'Story 5', anthologyId: 2, authorId: 10 },
  { id: 11, title: 'Story 6', anthologyId: 2, authorId: 11 },
  { id: 12, title: 'Story 7', anthologyId: 2, authorId: 12 },
  { id: 13, title: 'Story 8', anthologyId: 2, authorId: 13 },
  { id: 14, title: 'Story 9', anthologyId: 2, authorId: 14 },
  { id: 15, title: 'Story 10', anthologyId: 2, authorId: 15 },

  // Anthology 3: Student Voices Vol. 1
  { id: 16, title: 'Story 1', anthologyId: 3, authorId: 16 },
  { id: 17, title: 'Story 2', anthologyId: 3, authorId: 17 },

  // Anthology 4: 826 Boston Anthology 2023
  { id: 18, title: 'Story 1', anthologyId: 4, authorId: 18 },

  // Anthology 5: Neighborhood Stories
  { id: 19, title: 'Story 1', anthologyId: 5, authorId: 16 },

  // Anthology 6: Poetry from the Classroom
  { id: 20, title: 'Story 1', anthologyId: 6, authorId: 19 },

  // Anthology 7: Young Writers Showcase
  { id: 21, title: 'Story 1', anthologyId: 7, authorId: 20 },
  { id: 22, title: 'Story 2', anthologyId: 7, authorId: 21 },
  { id: 23, title: 'Story 3', anthologyId: 7, authorId: 22 },

  // Anthology 8: Stories from Roxbury
  { id: 24, title: 'Story 1', anthologyId: 8, authorId: 23 },

  // Anthology 9: Creative Expressions 2022
  { id: 25, title: 'Story 1', anthologyId: 9, authorId: 24 },
  { id: 26, title: 'Story 2', anthologyId: 9, authorId: 25 },

  // Anthology 10: Voices of Tomorrow
  { id: 27, title: 'Story 1', anthologyId: 10, authorId: 26 },
];

export const STATIC_ARCHIVED: Anthology[] = [
  {
    id: 1,
    title: 'What if the World Needs You?',
    subtitle: 'Advice and Life Lessons',
    byline: 'from 826 Boston Students',
    description:
      "Discover a world where wisdom and whimsy collide in this captivating anthology from 826 Boston. Each story offers a unique piece of advice, from reimagined Greek myths to thought-provoking advice columns. Get ready to be challenged, moved, and inspired by these young voices' raw creativity and fearless storytelling!",
    published_year: 2024,
    status: AnthologyStatus.ARCHIVED,
    photo_url: '/src/assets/images/covers/Whatiftheworld_2024.jpg',
    foreword_author: 'Meredith Goldstein',
    praise_quotes:
      "\"I will cherish this collection by 826 Boston students who have crafted a range of work, from poetry to narratives to essays. Every piece is wisdom. Every short story, diary, comedy, and drama is embedded with advice, even if it's not obvious. Now, when I think, 'What should I do next?' I have a new place to turn.\" - Meredith Goldstein, author, longtime advice columnist, and associate editor at The Boston Globe",
    age_category:
      'Chapter Books (Ages 6–10), Early Reader Books (Ages 5–8), Middle Grade Books (Ages 8–13), Young Adult Books (Ages 13–18)',
    genre:
      'Advice, Science Fiction, Fantasy, Recipes, Humor, Poetry, Short Stories, Fiction, Non-Fiction, Essays',
    theme: 'Creative Writing, Short Stories',
    isbn: '979-8-88694-056-5',
    shopify_url: 'https://826boston.org',
    binding_type: 'Perfect Bound',
    dimensions: '11" x 8.5"',
    printing_cost: '$8,548.28',
    print_run: 600,
    weight: '28.11 oz / 827 g',
    page_count: 245,
    printed_by: 'PaperGraphics',
    pub_level: AnthologyPubLevel.SIGNATURE,
    programs: 'YABP',
    number_of_students: 91,
    inventory: 313,
    inventory_locations: {
      "BINcA Writers' Room": 3,
      "BTU Writers' Room": 1,
      'Dev/Comms Office (1865 Columbus)': 2,
      "Holland Writers' Room": 2,
      Library: 1,
      'The Hub (1989 Columbus)': 250,
      "O'Bryant Writers' Room": 3,
      "Muñiz Writers' Room": 5,
      "New Mission Writers' Room": 32,
      'Tutoring Center (3035 Office)': 313,
    },
  },
  {
    id: 2,
    title: 'I Was Meant For This',
    subtitle: "Mayoral Speeches By Boston's Young Leaders",
    byline: 'from 826 Boston Students',
    description:
      "Boston's 2021 mayoral election was a competitive race with more ethnically and racially diverse candidates than ever before. In I Was Meant for This students of all ages give their own inaugural addresses as Boston's mayor-elect. These speeches—simultaneously playful, imaginative, and keenly observed—speak to an evolving city, as told through the eyes of tomorrow's leaders.",
    published_year: 2022,
    status: AnthologyStatus.ARCHIVED,
    foreword_author: 'Adrian Walker',
    praise_quotes:
      '"These are the speeches—and the voices—of young people who know that they matter, and that their thoughts and dreams matter. We should want that for all young people in every neighborhood of our city. I hope you enjoy their writing, and their thinking, as much as I did. We need their voices more than ever. And to our young mayoral candidates and essayists I say: Please keep writing. And please keep dreaming." - Adrian Walker, Columnist/Associate Editor, The Boston Globe',
    age_category:
      'Chapter Books (Ages 6–10), Middle Grade Books (Ages 8–13), Young Adult Books (Ages 13–18)',
    genre: 'Civic Engagement, Politics, Speeches',
    theme: 'Leadership, Neighborhood, The Future',
    isbn: '978-1-948644-89-1',
    shopify_url: 'https://826boston.org/publications/i-was-meant-for-this/',
    binding_type: 'Perfect Bound',
    dimensions: '6" x 9.5"',
    printing_cost: '$4,315.58',
    print_run: 500,
    weight: '10.8 oz / 306 g',
    page_count: 146,
    printed_by: 'PaperGraphics',
    pub_level: AnthologyPubLevel.SIGNATURE,
    programs: 'YABP',
    number_of_students: 40,
    inventory: 62,
    inventory_locations: {
      "BINcA Writers' Room": 2,
      'Dev/Comms Office (1865 Columbus)': 0,
      "Holland Writers' Room": 0,
      "O'Bryant Writers' Room": 9,
      Library: 0,
      'The Hub (1989 Columbus)': 54,
      "Muñiz Writers' Room": 0,
      "New Mission Writers' Room": 0,
      'Tutoring Center (3035 Office)': 1,
    },
  },
  {
    id: 3,
    title: 'Student Voices Vol. 1',
    description: '',
    published_year: 2022,
    status: AnthologyStatus.ARCHIVED,
    pub_level: AnthologyPubLevel.CHAPBOOK,
    genre:
      'Advice, Science Fiction, Fantasy, Recipes, Humor, Poetry, Short Stories, Fiction, Non-Fiction, Essays',
  },
  {
    id: 4,
    title: '826 Boston Anthology 2023',
    description: '',
    published_year: 2023,
    status: AnthologyStatus.ARCHIVED,
    pub_level: AnthologyPubLevel.CHAPBOOK,
    genre:
      'Advice, Science Fiction, Fantasy, Recipes, Humor, Poetry, Short Stories, Fiction, Non-Fiction, Essays',
  },
  {
    id: 5,
    title: 'Neighborhood Stories',
    description: '',
    published_year: 2021,
    status: AnthologyStatus.ARCHIVED,
    pub_level: AnthologyPubLevel.ZINE,
    genre:
      'Advice, Science Fiction, Fantasy, Recipes, Humor, Poetry, Short Stories, Fiction, Non-Fiction, Essays',
  },
  {
    id: 6,
    title: 'Poetry from the Classroom',
    description: '',
    published_year: 2020,
    status: AnthologyStatus.ARCHIVED,
    pub_level: AnthologyPubLevel.ZINE,
    genre:
      'Advice, Science Fiction, Fantasy, Recipes, Humor, Poetry, Short Stories, Fiction, Non-Fiction, Essays',
  },
  {
    id: 7,
    title: 'Young Writers Showcase',
    description: '',
    published_year: 2019,
    status: AnthologyStatus.ARCHIVED,
    pub_level: AnthologyPubLevel.CHAPBOOK,
    genre:
      'Advice, Science Fiction, Fantasy, Recipes, Humor, Poetry, Short Stories, Fiction, Non-Fiction, Essays',
  },
  {
    id: 8,
    title: 'Stories from Roxbury',
    description: '',
    published_year: 2021,
    status: AnthologyStatus.ARCHIVED,
    pub_level: AnthologyPubLevel.ZINE,
    genre:
      'Advice, Science Fiction, Fantasy, Recipes, Humor, Poetry, Short Stories, Fiction, Non-Fiction, Essays',
  },
  {
    id: 9,
    title: 'Creative Expressions 2022',
    description: '',
    published_year: 2022,
    status: AnthologyStatus.ARCHIVED,
    pub_level: AnthologyPubLevel.CHAPBOOK,
    genre:
      'Advice, Science Fiction, Fantasy, Recipes, Humor, Poetry, Short Stories, Fiction, Non-Fiction, Essays',
  },
  {
    id: 10,
    title: 'Voices of Tomorrow',
    description: '',
    published_year: 2023,
    status: AnthologyStatus.ARCHIVED,
    pub_level: AnthologyPubLevel.CHAPBOOK,
    genre:
      'Advice, Science Fiction, Fantasy, Recipes, Humor, Poetry, Short Stories, Fiction, Non-Fiction, Essays',
  },
];

export const RECENTLY_EDITED: Anthology[] = [
  {
    id: 101,
    title: 'Untitled Publication',
    description: '',
    published_year: 2025,
    status: AnthologyStatus.ARCHIVED,
    pub_level: AnthologyPubLevel.ZINE,
  },
  {
    id: 102,
    title: 'Untitled Publication',
    description: '',
    published_year: 2025,
    status: AnthologyStatus.ARCHIVED,
    pub_level: AnthologyPubLevel.ZINE,
  },
  {
    id: 103,
    title: 'Untitled Publication',
    description: '',
    published_year: 2025,
    status: AnthologyStatus.ARCHIVED,
    pub_level: AnthologyPubLevel.ZINE,
  },
];

export const MOCK_LAST_MODIFIED = 'October 15, 2025';
