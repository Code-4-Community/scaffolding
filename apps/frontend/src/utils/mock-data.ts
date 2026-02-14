export interface Anthology {
  id: number;
  title: string;
  subtitle?: string;
  byline?: string;
  description?: string;
  published_year: number;
  status: string;
  updated_at?: string;
  authors?: string[];
  photo_url?: string;

  // Additional fields from metadata
  foreword_author?: string;
  praise_quotes?: string;
  age_category?: string;
  genre?: string;
  theme?: string;
  isbn?: string;
  shopify_url?: string;
  binding_type?: string;
  dimensions?: string;
  printing_cost?: string;
  print_run?: number;
  weight?: string;
  page_count?: number;
  printed_by?: string;
  pub_level?: string;
  publishing_permission?: string;
  program?: string;
  sponsors?: string[];
  number_of_students?: number;
  inventory?: number;
  inventory_locations?: {
    [location: string]: number;
  };
}

export const STATIC_ARCHIVED: Anthology[] = [
  {
    id: 1,
    title: 'What if the World Needs You?',
    subtitle: 'Advice and Life Lessons',
    byline: 'from 826 Boston Students',
    description:
      "Discover a world where wisdom and whimsy collide in this captivating anthology from 826 Boston. Each story offers a unique piece of advice, from reimagined Greek myths to thought-provoking advice columns. Get ready to be challenged, moved, and inspired by these young voices' raw creativity and fearless storytelling!",
    published_year: 2024,
    status: 'archived',
    authors: [
      'Maria Santos',
      'James Chen',
      'Aisha Johnson',
      'David Kim',
      'Sofia Rodriguez',
    ],
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
    pub_level: 'Signature Publication (Level 3)',
    publishing_permission: 'All',
    program: 'YABP',
    sponsors: [
      'Boston Globe',
      'Grub Street',
      'Nosy Crow Inc.',
      'Tiny Tiger Foundation',
    ],
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
    status: 'archived',
    authors: [
      'Zachary Abusheleih',
      'Pablo Arduini',
      'Marwa Bacare',
      'Emma-Rose Bernard',
      'Naveen Bhatt',
      'Rohan Bhatt',
      'Inari Braxton',
      'Kamila Burgos Cruz',
      'Edwin Chen',
      'Alice Chung',
    ],
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
    pub_level: 'Signature Publication (Level 3)',
    publishing_permission: 'All',
    program: 'YABP',
    sponsors: ['Richard K. Lubin Family Foundation'],
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
    published_year: 2022,
    status: 'archived',
    authors: ['A. Lee', 'M. Torres'],
    genre:
      'Advice, Science Fiction, Fantasy, Recipes, Humor, Poetry, Short Stories, Fiction, Non-Fiction, Essays',
  },
  {
    id: 4,
    title: '826 Boston Anthology 2023',
    published_year: 2023,
    status: 'archived',
    authors: ['Jamal Wright'],
    genre:
      'Advice, Science Fiction, Fantasy, Recipes, Humor, Poetry, Short Stories, Fiction, Non-Fiction, Essays',
  },
  {
    id: 5,
    title: 'Neighborhood Stories',
    published_year: 2021,
    status: 'archived',
    authors: ['A. Lee'],
    genre:
      'Advice, Science Fiction, Fantasy, Recipes, Humor, Poetry, Short Stories, Fiction, Non-Fiction, Essays',
  },
  {
    id: 6,
    title: 'Poetry from the Classroom',
    published_year: 2020,
    status: 'archived',
    authors: ['Student Contributors'],
    genre:
      'Advice, Science Fiction, Fantasy, Recipes, Humor, Poetry, Short Stories, Fiction, Non-Fiction, Essays',
  },
  {
    id: 7,
    title: 'Young Writers Showcase',
    published_year: 2019,
    status: 'archived',
    authors: ['K. Chen', 'R. Patel', 'S. Johnson'],
    genre:
      'Advice, Science Fiction, Fantasy, Recipes, Humor, Poetry, Short Stories, Fiction, Non-Fiction, Essays',
  },
  {
    id: 8,
    title: 'Stories from Roxbury',
    published_year: 2021,
    status: 'archived',
    authors: ['Community Writers'],
    genre:
      'Advice, Science Fiction, Fantasy, Recipes, Humor, Poetry, Short Stories, Fiction, Non-Fiction, Essays',
  },
  {
    id: 9,
    title: 'Creative Expressions 2022',
    published_year: 2022,
    status: 'archived',
    authors: ['M. Williams', 'D. Brown'],
    genre:
      'Advice, Science Fiction, Fantasy, Recipes, Humor, Poetry, Short Stories, Fiction, Non-Fiction, Essays',
  },
  {
    id: 10,
    title: 'Voices of Tomorrow',
    published_year: 2023,
    status: 'archived',
    authors: ['826 Boston Students'],
    genre:
      'Advice, Science Fiction, Fantasy, Recipes, Humor, Poetry, Short Stories, Fiction, Non-Fiction, Essays',
  },
];

export const RECENTLY_EDITED: Anthology[] = [
  {
    id: 101,
    title: 'Untitled Publication',
    published_year: 2025,
    status: 'archived',
  },
  {
    id: 102,
    title: 'Untitled Publication',
    published_year: 2025,
    status: 'archived',
  },
  {
    id: 103,
    title: 'Untitled Publication',
    published_year: 2025,
    status: 'archived',
    authors: ['Student Contributors'],
  },
];

export const MOCK_LAST_MODIFIED = 'October 15, 2025';

export interface Story {
  id: number;
  title: string;
  author: string;
  anthology_id: number;
}

export const MOCK_STORIES: Story[] = [
  { id: 1, title: 'Story 1', author: 'Maria Santos', anthology_id: 1 },
  { id: 2, title: 'Story 2', author: 'James Chen', anthology_id: 1 },
  { id: 3, title: 'Story 3', author: 'Aisha Johnson', anthology_id: 1 },
  { id: 4, title: 'Story 4', author: 'David Kim', anthology_id: 1 },
  { id: 5, title: 'Story 5', author: 'Sofia Rodriguez', anthology_id: 1 },

  { id: 6, title: 'Story 1', author: 'Zachary Abusheleih', anthology_id: 2 },
  { id: 7, title: 'Story 2', author: 'Pablo Arduini', anthology_id: 2 },
  { id: 8, title: 'Story 3', author: 'Marwa Bacare', anthology_id: 2 },
  { id: 9, title: 'Story 4', author: 'Emma-Rose Bernard', anthology_id: 2 },
  { id: 10, title: 'Story 5', author: 'Naveen Bhatt', anthology_id: 2 },
  { id: 11, title: 'Story 6', author: 'Rohan Bhatt', anthology_id: 2 },
  { id: 12, title: 'Story 7', author: 'Inari Braxton', anthology_id: 2 },
  { id: 13, title: 'Story 8', author: 'Kamila Burgos Cruz', anthology_id: 2 },
  { id: 14, title: 'Story 9', author: 'Edwin Chen', anthology_id: 2 },
  { id: 15, title: 'Story 10', author: 'Alice Chung', anthology_id: 2 },

  { id: 16, title: 'Story 1', author: 'A. Lee', anthology_id: 3 },
  { id: 17, title: 'Story 2', author: 'M. Torres', anthology_id: 3 },

  { id: 18, title: 'Story 1', author: 'Jamal Wright', anthology_id: 4 },

  { id: 19, title: 'Story 1', author: 'A. Lee', anthology_id: 5 },

  { id: 20, title: 'Story 1', author: 'Student Contributors', anthology_id: 6 },

  { id: 21, title: 'Story 1', author: 'K. Chen', anthology_id: 7 },
  { id: 22, title: 'Story 2', author: 'R. Patel', anthology_id: 7 },
  { id: 23, title: 'Story 3', author: 'S. Johnson', anthology_id: 7 },

  { id: 24, title: 'Story 1', author: 'Community Writers', anthology_id: 8 },

  { id: 25, title: 'Story 1', author: 'M. Williams', anthology_id: 9 },
  { id: 26, title: 'Story 2', author: 'D. Brown', anthology_id: 9 },

  { id: 27, title: 'Story 1', author: '826 Boston Students', anthology_id: 10 },
];
