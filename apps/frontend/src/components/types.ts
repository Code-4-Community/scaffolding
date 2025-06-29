enum ApplicationStage {
  RESUME = 'RESUME',
  INTERVIEW = 'INTERVIEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  TECHNICAL_CHALLENGE = 'TECHNICAL_CHALLENGE',
  PM_CHALLENGE = 'PM_CHALLENGE',
}

enum ApplicationStep {
  SUBMITTED = 'SUBMITTED',
  REVIEWED = 'REVIEWED',
}

enum Position {
  DEVELOPER = 'DEVELOPER',
  PM = 'PRODUCT_MANAGER',
  DESIGNER = 'DESIGNER',
}

type ApplicationRow = {
  id: number;
  userId: number;
  name: string;
  position: Position;
  reviewed: string;
  assignedTo: string[];
  stage: ApplicationStage;
  rating: number | null;
  createdAt: Date;
  meanRatingAllReviews: number | null;
  meanRatingResume: number | null;
  meanRatingChallenge: number | null;
  meanRatingTechnicalChallenge: number | null;
  meanRatingInterview: number | null;
};

type BackendApplicationDTO = {
  userId: number;
  firstName: string;
  lastName: string;
  stage: ApplicationStage;
  step: ApplicationStep;
  position: Position;
  createdAt: Date;
  meanRatingAllReviews: number | null;
  meanRatingResume: number | null;
  meanRatingChallenge: number | null;
  meanRatingTechnicalChallenge: number | null;
  meanRatingInterview: number | null;
};

type Response = {
  question: string;
  answer: string;
};

type Review = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  reviewerId: number;
  rating: number;
  stage: ApplicationStage;
  content: string;
};

enum Semester {
  FALL = 'FALL',
  SPRING = 'SPRING',
}

type Application = {
  id: number;
  createdAt: Date;
  year: number;
  semester: Semester;
  position: Position;
  stage: ApplicationStage;
  step: ApplicationStep;
  response: Response[];
  numApps: number;
  reviews: Review[];
};

// TODO: should match backend type
type User = {
  id: number;
  status: string;
};

export {
  User,
  ApplicationRow,
  Application,
  ApplicationStage,
  ApplicationStep,
  Position,
  Response,
  Review,
  Semester,
  BackendApplicationDTO,
};
