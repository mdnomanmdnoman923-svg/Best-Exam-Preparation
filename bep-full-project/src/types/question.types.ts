// bep-full-project/src/types/question.types.ts

export type QuestionDifficulty =
  | 'easy'
  | 'medium'
  | 'hard';

export type QuestionType =
  | 'mcq'
  | 'written'
  | 'cq'
  | 'true_false'
  | 'fill_blank';

export type QuestionStatus =
  | 'draft'
  | 'pending'
  | 'published'
  | 'archived'
  | 'rejected';

export interface QuestionOption {
  id: string;

  label: string;
  value: string;

  imageUrl?: string;

  correct?: boolean;
}

export interface QuestionTag {
  id: string;

  name: string;
  slug?: string;

  color?: string;
}

export interface QuestionAttachment {
  id: string;

  type:
    | 'image'
    | 'video'
    | 'audio'
    | 'pdf'
    | 'document';

  url: string;

  name?: string;
  size?: number;
}

export interface Question {
  id: string;

  title?: string;

  question: string;

  type: QuestionType;
  difficulty: QuestionDifficulty;

  status?: QuestionStatus;

  subjectId?: string;
  chapterId?: string;

  options?: QuestionOption[];

  correctAnswer?: string | string[];
  explanation?: string;

  marks: number;
  negativeMarks?: number;

  tags?: QuestionTag[];

  attachments?: QuestionAttachment[];

  premium?: boolean;
  featured?: boolean;

  approved?: boolean;
  verified?: boolean;

  hints?: string[];

  estimatedTimeSeconds?: number;

  language?: 'bn' | 'en';

  createdBy?: string;
  updatedBy?: string;

  totalAttempts?: number;
  correctAttempts?: number;

  createdAt?: string;
  updatedAt?: string;
}

/* -------------------------------------------------------------------------- */
/*                            Question Attempt                                */
/* -------------------------------------------------------------------------- */

export interface QuestionAttempt {
  id: string;

  questionId: string;
  userId: string;

  selectedAnswer?: string | string[];

  correct?: boolean;

  obtainedMarks?: number;

  timeSpentSeconds?: number;

  skipped?: boolean;

  createdAt?: string;
}

/* -------------------------------------------------------------------------- */
/*                           Question Analytics                               */
/* -------------------------------------------------------------------------- */

export interface QuestionAnalytics {
  questionId: string;

  totalAttempts: number;

  correctAttempts: number;
  wrongAttempts: number;

  accuracyPercentage?: number;

  averageTimeSpent?: number;
}

/* -------------------------------------------------------------------------- */
/*                             Question Filter                                */
/* -------------------------------------------------------------------------- */

export interface QuestionFilterOptions {
  query?: string;

  type?: QuestionType;
  difficulty?: QuestionDifficulty;

  status?: QuestionStatus;

  subjectId?: string;
  chapterId?: string;

  tags?: string[];

  premium?: boolean;
  featured?: boolean;

  approved?: boolean;

  language?: 'bn' | 'en';
}

/* -------------------------------------------------------------------------- */
/*                            Create Question                                 */
/* -------------------------------------------------------------------------- */

export interface CreateQuestionPayload {
  title?: string;

  question: string;

  type: QuestionType;
  difficulty: QuestionDifficulty;

  subjectId?: string;
  chapterId?: string;

  options?: QuestionOption[];

  correctAnswer?: string | string[];

  explanation?: string;

  marks: number;
  negativeMarks?: number;

  tags?: string[];

  hints?: string[];

  premium?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                            Update Question                                 */
/* -------------------------------------------------------------------------- */

export interface UpdateQuestionPayload
  extends Partial<CreateQuestionPayload> {
  status?: QuestionStatus;

  approved?: boolean;
  verified?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              Question Result                               */
/* -------------------------------------------------------------------------- */

export interface QuestionResult {
  questionId: string;

  selectedAnswer?: string | string[];

  correctAnswer?: string | string[];

  correct?: boolean;

  explanation?: string;

  obtainedMarks?: number;

  timeSpentSeconds?: number;
}

/* -------------------------------------------------------------------------- */
/*                              Practice Session                              */
/* -------------------------------------------------------------------------- */

export interface PracticeSession {
  id: string;

  userId: string;

  subjectId?: string;
  chapterId?: string;

  totalQuestions: number;

  answeredQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;

  accuracyPercentage?: number;

  startedAt?: string;
  completedAt?: string;
}

/* -------------------------------------------------------------------------- */
/*                              Weak Topic                                    */
/* -------------------------------------------------------------------------- */

export interface WeakTopic {
  id: string;

  subjectId?: string;
  chapterId?: string;

  topic: string;

  accuracyPercentage: number;

  totalAttempts: number;

  recommendedQuestions?: string[];
}

/* -------------------------------------------------------------------------- */
/*                             Bookmark Question                              */
/* -------------------------------------------------------------------------- */

export interface BookmarkedQuestion {
  id: string;

  userId: string;
  questionId: string;

  createdAt?: string;
}

/* -------------------------------------------------------------------------- */
/*                              Question Report                               */
/* -------------------------------------------------------------------------- */

export interface QuestionReport {
  id: string;

  questionId: string;

  reporterId: string;

  reason:
    | 'wrong_answer'
    | 'duplicate'
    | 'spam'
    | 'offensive'
    | 'other';

  details?: string;

  resolved?: boolean;

  createdAt?: string;
}

/* -------------------------------------------------------------------------- */
/*                             API Response                                   */
/* -------------------------------------------------------------------------- */

export interface QuestionApiResponse<T = unknown> {
  success: boolean;

  data?: T;

  message?: string;
  error?: string;
}
