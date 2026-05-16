// bep-full-project/src/features/practice/types.ts

import type { ReactNode } from 'react';

export type PracticeQuestionType =
  | 'mcq'
  | 'cq'
  | 'sq';

export type PracticeDifficulty =
  | 'easy'
  | 'medium'
  | 'hard';

export type PracticeSessionStatus =
  | 'idle'
  | 'running'
  | 'paused'
  | 'completed';

export interface PracticeOption {
  id: string;

  label: string;

  value: string;
}

export interface PracticeQuestion {
  id: string;

  type: PracticeQuestionType;

  question: string;

  options?: PracticeOption[];

  answer?: string;

  explanation?: string;

  hint?: string;

  subject?: string;

  chapter?: string;

  difficulty?: PracticeDifficulty;

  premium?: boolean;

  locked?: boolean;

  bookmarked?: boolean;

  flagged?: boolean;

  points?: number;

  imageUrl?: string;

  tags?: string[];

  createdAt?: string;

  updatedAt?: string;
}

export interface PracticeEngineResult {
  questionId: string;

  answer: string;

  correct: boolean | null;

  skipped: boolean;

  submittedAt: string;
}

export interface PracticeSession {
  id: string;

  userId?: string;

  title?: string;

  subject?: string;

  chapter?: string;

  questions: PracticeQuestion[];

  answers: Record<string, string>;

  bookmarkedQuestionIds: string[];

  flaggedQuestionIds: string[];

  currentIndex: number;

  status: PracticeSessionStatus;

  startedAt?: string;

  completedAt?: string;

  durationSeconds?: number;

  scorePercentage?: number;
}

export interface PracticeStats {
  totalQuestions: number;

  answeredQuestions: number;

  correctAnswers: number;

  incorrectAnswers: number;

  skippedQuestions: number;

  scorePercentage: number;

  accuracyPercentage: number;

  totalPoints?: number;

  earnedPoints?: number;

  streak?: number;

  timeSpentSeconds?: number;
}

export interface PracticeResultSubjectStat {
  subject: string;

  score: number;

  totalQuestions?: number;

  correct?: number;

  incorrect?: number;
}

export interface PracticeResultAchievement {
  id: string;

  title: string;

  description?: string;

  icon?: ReactNode;
}

export interface PracticeToolbarFilters {
  search: string;

  difficulty: PracticeToolbarDifficulty;

  bookmarkedOnly: boolean;

  flaggedOnly: boolean;

  premiumOnly: boolean;
}

export type PracticeToolbarDifficulty =
  | 'all'
  | 'easy'
  | 'medium'
  | 'hard';

export interface PracticeEngineProps {
  questions: PracticeQuestion[];

  title?: string;

  subtitle?: string;

  loading?: boolean;

  submitting?: boolean;

  autoStartTimer?: boolean;

  initialSeconds?: number;

  showTimer?: boolean;

  showProgress?: boolean;

  allowBookmark?: boolean;

  allowFlag?: boolean;

  allowHints?: boolean;

  showExplanationAfterSubmit?: boolean;

  onFinish?: (
    results: PracticeEngineResult[],
  ) => Promise<void> | void;

  onAnswerChange?: (
    questionId: string,
    answer: string,
  ) => void;

  onBookmarkChange?: (
    questionId: string,
    bookmarked: boolean,
  ) => void;

  onFlagChange?: (
    questionId: string,
    flagged: boolean,
  ) => void;

  onRequestHint?: (
    questionId: string,
  ) => void;

  onQuestionChange?: (
    question: PracticeQuestion,
    index: number,
  ) => void;

  onExit?: () => void;

  className?: string;
}

export interface PracticeResultProps {
  title?: string;

  subtitle?: string;

  totalQuestions: number;

  answeredCount: number;

  correctCount: number;

  incorrectCount?: number;

  skippedCount?: number;

  scorePercentage: number;

  timeSpent?: string;

  timeLimit?: string;

  pointsEarned?: number;

  streak?: number;

  premium?: boolean;

  passed?: boolean;

  remarks?: string;

  results?: PracticeEngineResult[];

  subjectStats?: PracticeResultSubjectStat[];

  achievements?: PracticeResultAchievement[];

  loading?: boolean;

  onRetry?: () => void;

  onReviewAnswers?: () => void;

  onBackToPractice?: () => void;

  onShare?: () => void;

  onNextPractice?: () => void;

  className?: string;
}

export interface PracticeToolbarProps {
  title?: string;

  subtitle?: string;

  search?: string;

  difficulty?: PracticeToolbarDifficulty;

  showOnlyBookmarked?: boolean;

  showOnlyFlagged?: boolean;

  premiumOnly?: boolean;

  totalQuestions?: number;

  answeredCount?: number;

  correctCount?: number;

  timeSpent?: string;

  remainingTime?: string;

  streak?: number;

  loading?: boolean;

  onSearchChange?: (
    value: string,
  ) => void;

  onDifficultyChange?: (
    value: PracticeToolbarDifficulty,
  ) => void;

  onToggleBookmarked?: (
    value: boolean,
  ) => void;

  onToggleFlagged?: (
    value: boolean,
  ) => void;

  onTogglePremiumOnly?: (
    value: boolean,
  ) => void;

  onReset?: () => void;

  onShuffle?: () => void;

  className?: string;
}

export interface PracticeLeaderboardEntry {
  id: string;

  userId: string;

  name: string;

  avatar?: string;

  points: number;

  scorePercentage: number;

  rank: number;

  streak?: number;

  premium?: boolean;
}

export interface PracticeRecommendation {
  id: string;

  title: string;

  subject?: string;

  chapter?: string;

  difficulty?: PracticeDifficulty;

  estimatedMinutes?: number;

  premium?: boolean;
}

export interface PracticeState {
  loading: boolean;

  submitting: boolean;

  error: string | null;

  currentSession: PracticeSession | null;

  questions: PracticeQuestion[];

  filters: PracticeToolbarFilters;

  stats: PracticeStats | null;

  recommendations: PracticeRecommendation[];

  leaderboard: PracticeLeaderboardEntry[];

  lastUpdated?: string | null;
}

export interface PracticeStoreActions {
  setLoading: (
    value: boolean,
  ) => void;

  setSubmitting: (
    value: boolean,
  ) => void;

  setError: (
    value: string | null,
  ) => void;

  setQuestions: (
    questions: PracticeQuestion[],
  ) => void;

  setFilters: (
    filters: Partial<PracticeToolbarFilters>,
  ) => void;

  setStats: (
    stats: PracticeStats | null,
  ) => void;

  setSession: (
    session: PracticeSession | null,
  ) => void;

  reset: () => void;
}
