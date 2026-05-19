// bep-full-project/src/types/exam.types.ts

export type ExamType =
  | 'practice'
  | 'mock'
  | 'live'
  | 'daily'
  | 'weekly'
  | 'model-test';

export type ExamStatus =
  | 'draft'
  | 'scheduled'
  | 'running'
  | 'completed'
  | 'cancelled';

export type ExamDifficulty =
  | 'easy'
  | 'medium'
  | 'hard';

export type QuestionType =
  | 'mcq'
  | 'written'
  | 'cq'
  | 'true_false';

export interface ExamOption {
  id: string;
  label: string;
  value: string;
  imageUrl?: string;
}

export interface ExamQuestion {
  id: string;

  title?: string;
  question: string;

  type: QuestionType;

  subjectId?: string;
  chapterId?: string;

  difficulty?: ExamDifficulty;

  options?: ExamOption[];

  correctAnswer?: string | string[];
  explanation?: string;

  marks: number;
  negativeMarks?: number;

  timeLimitSeconds?: number;

  imageUrl?: string;
  attachments?: string[];

  tags?: string[];

  createdAt?: string;
  updatedAt?: string;
}

export interface Exam {
  id: string;

  title: string;
  description?: string;

  type: ExamType;
  status?: ExamStatus;

  subjectId?: string;
  chapterId?: string;

  durationMinutes: number;

  totalMarks: number;
  passMarks?: number;

  difficulty?: ExamDifficulty;

  premium?: boolean;
  featured?: boolean;

  instructions?: string[];

  questions: ExamQuestion[];

  startsAt?: string;
  endsAt?: string;

  createdBy?: string;

  participantsCount?: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface ExamAnswer {
  questionId: string;

  answer: string | string[];

  correct?: boolean;

  obtainedMarks?: number;

  skipped?: boolean;

  answeredAt?: string;
}

export interface ExamAttempt {
  id: string;

  examId: string;
  userId: string;

  startedAt?: string;
  submittedAt?: string;

  status?:
    | 'running'
    | 'paused'
    | 'completed'
    | 'timeout';

  answers: ExamAnswer[];

  score?: number;
  percentage?: number;

  totalCorrect?: number;
  totalWrong?: number;
  totalSkipped?: number;

  rank?: number;

  timeSpentSeconds?: number;

  bookmarkedQuestions?: string[];
  flaggedQuestions?: string[];

  createdAt?: string;
  updatedAt?: string;
}

export interface ExamResult {
  id: string;

  examId: string;
  attemptId: string;

  userId: string;

  score: number;
  percentage: number;

  rank?: number;

  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;

  totalMarks: number;
  obtainedMarks: number;

  passed?: boolean;

  submittedAt?: string;
}

export interface ExamLeaderboardEntry {
  userId: string;

  fullName: string;
  avatarUrl?: string;

  score: number;
  percentage: number;

  rank: number;

  timeSpentSeconds?: number;
}

export interface ExamAnalytics {
  examId: string;

  totalParticipants: number;

  averageScore?: number;
  highestScore?: number;
  lowestScore?: number;

  passRate?: number;

  averageCompletionTime?: number;
}

export interface ExamFilterOptions {
  query?: string;

  type?: ExamType;
  status?: ExamStatus;

  difficulty?: ExamDifficulty;

  subjectId?: string;
  chapterId?: string;

  premium?: boolean;
  featured?: boolean;
}

export interface ExamTimerState {
  totalSeconds: number;

  remainingSeconds: number;

  running: boolean;
  paused?: boolean;
}

export interface ExamReviewItem {
  question: ExamQuestion;

  selectedAnswer?: string | string[];

  correctAnswer?: string | string[];

  correct?: boolean;

  obtainedMarks?: number;
}

export interface ExamApiResponse<T = unknown> {
  success: boolean;

  data?: T;

  message?: string;
  error?: string;
}

export interface CreateExamPayload {
  title: string;

  description?: string;

  type: ExamType;

  subjectId?: string;
  chapterId?: string;

  durationMinutes: number;

  difficulty?: ExamDifficulty;

  questions: ExamQuestion[];

  instructions?: string[];

  premium?: boolean;
}

export interface SubmitExamPayload {
  examId: string;

  answers: ExamAnswer[];

  timeSpentSeconds?: number;
}
