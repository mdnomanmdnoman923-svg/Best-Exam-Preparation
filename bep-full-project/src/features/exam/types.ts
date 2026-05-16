// bep-full-project/src/features/exam/types.ts

export type ExamQuestionType =
  | 'mcq'
  | 'cq'
  | 'sq';

export type ExamDifficulty =
  | 'easy'
  | 'medium'
  | 'hard';

export type ExamStatus =
  | 'draft'
  | 'scheduled'
  | 'live'
  | 'completed'
  | 'archived';

export type ExamAttemptStatus =
  | 'started'
  | 'paused'
  | 'submitted'
  | 'expired';

export interface ExamQuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface ExamQuestion {
  id: string;
  type: ExamQuestionType;
  question: string;
  options?: ExamQuestionOption[];
  answer?: string;
  explanation?: string;
  hint?: string;
  subject?: string;
  chapter?: string;
  difficulty?: ExamDifficulty;
  premium?: boolean;
  locked?: boolean;
  points?: number;
  duration?: number;
  imageUrl?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamDocument {
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  subject?: string;
  chapter?: string;
  thumbnail?: string;
  durationSeconds?: number;
  totalMarks?: number;
  passingMarks?: number;
  premium?: boolean;
  timed?: boolean;
  status?: ExamStatus;
  questions: ExamQuestion[];
  createdBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ExamAnswerMap {
  [questionId: string]: string;
}

export interface ExamBookmarkMap {
  [questionId: string]: boolean;
}

export interface ExamFlagMap {
  [questionId: string]: boolean;
}

export interface ExamAttemptResult {
  examId?: string;
  userId?: string | null;

  attemptedAt: string;
  submittedAt?: string;

  totalQuestions: number;

  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;

  flaggedCount: number;
  bookmarkCount: number;

  scorePercentage: number;

  obtainedMarks: number;
  totalMarks: number;

  passed: boolean;

  timeSpentSeconds: number;
  timeLimitSeconds: number;

  selectedAnswers: Record<string, string>;
  subjectiveAnswers: Record<string, string>;
}

export interface ExamLeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  score: number;
  percentage: number;
  rank: number;
  timeSpentSeconds?: number;
  submittedAt?: string;
  premium?: boolean;
}

export interface ExamAnalytics {
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  completionRate: number;
  averageCompletionTime: number;
}

export interface ExamTimerState {
  running: boolean;
  paused: boolean;
  expired: boolean;
  remainingSeconds: number;
  totalDurationSeconds: number;
}

export interface ExamNavigatorQuestion {
  id: string;
  index: number;
  answered?: boolean;
  flagged?: boolean;
  visited?: boolean;
  locked?: boolean;
}

export interface ExamResultBreakdown {
  correct: number;
  incorrect: number;
  skipped: number;
  total: number;
}

export interface ExamResultSubjectStat {
  subject: string;
  score: number;
  totalQuestions?: number;
  correct?: number;
  incorrect?: number;
}

export interface ExamResultAchievement {
  id: string;
  title: string;
  description?: string;
  icon?: unknown;
}

export interface ExamSessionState {
  currentIndex: number;

  selectedAnswers: Record<string, string>;
  subjectiveAnswers: Record<string, string>;

  bookmarkedQuestionIds: string[];
  flaggedQuestionIds: string[];
  visitedQuestionIds: string[];

  submitted: boolean;
  expired: boolean;

  startedAt?: string;
  updatedAt?: string;
}

export interface UseExamOptions {
  examId?: string;
  userId?: string;

  initialExam?: ExamDocument | null;
  initialQuestions?: ExamQuestion[];

  initialCurrentIndex?: number;
  initialRemainingSeconds?: number;
  initialDurationSeconds?: number;
  initialMarksPerQuestion?: number;

  autoStart?: boolean;
  autoSubmitOnExpire?: boolean;

  persistProgress?: boolean;
  persistCollectionName?: string;

  loadFromFirestore?: boolean;

  onResult?: (
    result: ExamAttemptResult,
  ) => void;

  onExpire?: () => void;

  onLoadError?: (
    error: Error,
  ) => void;
}

export interface UseExamReturn {
  exam: ExamDocument | null;

  questions: ExamQuestion[];

  currentQuestion: ExamQuestion | null;

  currentIndex: number;

  totalQuestions: number;

  selectedAnswers: Record<string, string>;

  subjectiveAnswers: Record<string, string>;

  bookmarkedQuestionIds: string[];

  flaggedQuestionIds: string[];

  visitedQuestionIds: string[];

  answeredQuestionIds: string[];

  loading: boolean;

  saving: boolean;

  submitting: boolean;

  submitted: boolean;

  expired: boolean;

  error: string | null;

  examTitle: string;

  examSubtitle: string;

  remainingSeconds: number;

  totalDurationSeconds: number;

  marksPerQuestion: number;

  answeredCount: number;

  correctCount: number;

  incorrectCount: number;

  skippedCount: number;

  flaggedCount: number;

  bookmarkCount: number;

  scorePercentage: number;

  obtainedMarks: number;

  totalMarks: number;

  passed: boolean;

  timeSpentSeconds: number;

  timeSpentLabel: string;

  remainingLabel: string;

  currentAnswer: string;

  currentSubjectiveAnswer: string;

  canGoNext: boolean;

  canGoPrevious: boolean;

  progressPercent: number;

  attemptResult: ExamAttemptResult | null;

  loadExam: () => Promise<void>;

  setCurrentIndex: (
    index: number,
  ) => void;

  goToQuestion: (
    index: number,
  ) => void;

  goNext: () => void;

  goPrevious: () => void;

  selectAnswer: (
    questionId: string,
    answer: string,
  ) => void;

  changeSubjectiveAnswer: (
    questionId: string,
    value: string,
  ) => void;

  toggleBookmark: (
    questionId: string,
    nextState?: boolean,
  ) => Promise<void>;

  toggleFlag: (
    questionId: string,
  ) => void;

  requestHint: (
    questionId: string,
  ) => void;

  markVisited: (
    questionId: string,
  ) => void;

  startExam: () => void;

  pauseExam: () => void;

  resumeExam: () => void;

  resetExam: () => void;

  setRemainingSeconds: (
    seconds: number,
  ) => void;

  saveProgress: () => Promise<void>;

  submitExam: () => Promise<ExamAttemptResult>;
}
