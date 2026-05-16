// bep-full-project/src/features/questions/types.ts

import type { ReactNode } from 'react';

export type QuestionType =
  | 'mcq'
  | 'sq'
  | 'cq';

export type QuestionDifficulty =
  | 'easy'
  | 'medium'
  | 'hard';

export type QuestionStatus =
  | 'draft'
  | 'published'
  | 'archived';

export type WeakTopicSeverity =
  | 'low'
  | 'medium'
  | 'high';

export interface QuestionOption {
  id: string;

  label: string;

  value: string;

  isCorrect?: boolean;
}

export interface QuestionTag {
  id: string;

  label: string;
}

export interface QuestionDocument {
  id: string;

  subjectId: string;

  chapterId?: string;

  chapterName?: string;

  subject?: string;

  title?: string;

  question: string;

  explanation?: string;

  hint?: string;

  type: QuestionType;

  difficulty?: QuestionDifficulty;

  status?: QuestionStatus;

  order?: number;

  points?: number;

  premium?: boolean;

  locked?: boolean;

  featured?: boolean;

  bookmarked?: boolean;

  flagged?: boolean;

  imageUrl?: string;

  tags?: string[];

  options?: QuestionOption[];

  correctAnswer?: string;

  answerKey?: string;

  attemptCount?: number;

  correctRate?: number;

  estimatedMinutes?: number;

  createdBy?: string;

  updatedBy?: string;

  createdAt?: unknown;

  updatedAt?: unknown;
}

export interface CreateQuestionInput {
  subjectId: string;

  chapterId?: string;

  chapterName?: string;

  title?: string;

  question: string;

  explanation?: string;

  hint?: string;

  type?: QuestionType;

  difficulty?: QuestionDifficulty;

  status?: QuestionStatus;

  order?: number;

  points?: number;

  premium?: boolean;

  locked?: boolean;

  featured?: boolean;

  imageUrl?: string;

  tags?: string[];

  options?: QuestionOption[];

  correctAnswer?: string;

  answerKey?: string;

  createdBy?: string;
}

export interface UpdateQuestionInput
  extends Partial<CreateQuestionInput> {
  type?: QuestionType;
}

export interface QuestionCardProps {
  id: string;

  subject?: string;

  chapter?: string;

  chapterName?: string;

  title?: string;

  question: string;

  type: QuestionType;

  difficulty?: QuestionDifficulty;

  status?: QuestionStatus;

  points?: number;

  premium?: boolean;

  locked?: boolean;

  featured?: boolean;

  bookmarked?: boolean;

  flagged?: boolean;

  imageUrl?: string;

  hint?: string;

  explanation?: string;

  options?: QuestionOption[];

  correctAnswer?: string;

  answerKey?: string;

  tags?: string[];

  order?: number;

  attemptCount?: number;

  correctRate?: number;

  estimatedMinutes?: number;

  createdAt?: string;

  updatedAt?: string;

  onOpen?: (
    id: string,
  ) => void;

  onPractice?: (
    id: string,
  ) => void;

  onBookmark?: (
    id: string,
    nextState: boolean,
  ) => void;

  onFlag?: (
    id: string,
    nextState: boolean,
  ) => void;

  onPreviewHint?: (
    id: string,
  ) => void;

  className?: string;
}

export interface QuestionFilterValue {
  search: string;

  type: 'all' | QuestionType;

  difficulty:
    | 'all'
    | QuestionDifficulty;

  status:
    | 'all'
    | QuestionStatus;

  premiumOnly: boolean;

  featuredOnly: boolean;

  lockedOnly: boolean;

  bookmarkedOnly: boolean;

  flaggedOnly: boolean;
}

export interface QuestionFilterProps {
  title?: string;

  subtitle?: string;

  value: QuestionFilterValue;

  totalQuestions?: number;

  visibleQuestions?: number;

  answeredQuestions?: number;

  premiumQuestions?: number;

  loading?: boolean;

  showAdvanced?: boolean;

  onChange: (
    value: QuestionFilterValue,
  ) => void;

  onReset?: () => void;

  onShuffle?: () => void;

  className?: string;
}

export interface QuestionOptionsProps {
  options: QuestionOption[];

  type?: QuestionType;

  loading?: boolean;

  disabled?: boolean;

  readOnly?: boolean;

  showCorrectToggle?: boolean;

  allowReorder?: boolean;

  allowAdd?: boolean;

  allowRemove?: boolean;

  onChange: (
    options: QuestionOption[],
  ) => void;

  onAdd?: () => void;

  onRemove?: (
    optionId: string,
  ) => void;

  onSetCorrect?: (
    optionId: string,
    isCorrect: boolean,
  ) => void;

  className?: string;
}

export interface QuestionStatsProps {
  title?: string;

  subtitle?: string;

  totalQuestions?: number;

  publishedQuestions?: number;

  draftQuestions?: number;

  archivedQuestions?: number;

  premiumQuestions?: number;

  featuredQuestions?: number;

  lockedQuestions?: number;

  bookmarkedQuestions?: number;

  flaggedQuestions?: number;

  averageCorrectRate?: number;

  totalAttempts?: number;

  totalStudyMinutes?: number;

  loading?: boolean;

  premium?: boolean;

  className?: string;
}

export interface WeakTopicItem {
  id: string;

  topic: string;

  subject?: string;

  chapter?: string;

  score?: number;

  accuracy?: number;

  attempts?: number;

  mistakes?: number;

  severity?: WeakTopicSeverity;

  recommendation?: string;

  lastPracticedAt?: string;

  premium?: boolean;
}

export interface WeakTopicsPanelProps {
  title?: string;

  subtitle?: string;

  topics: WeakTopicItem[];

  loading?: boolean;

  searchable?: boolean;

  compact?: boolean;

  collapsible?: boolean;

  defaultExpandedCount?: number;

  onTopicClick?: (
    topicId: string,
  ) => void;

  onPracticeTopic?: (
    topicId: string,
  ) => void;

  onViewAll?: () => void;

  className?: string;
}

export interface QuestionAnalytics {
  totalQuestions: number;

  publishedQuestions: number;

  draftQuestions: number;

  archivedQuestions: number;

  premiumQuestions: number;

  featuredQuestions: number;

  lockedQuestions: number;

  averageCorrectRate: number;

  totalAttempts: number;

  totalStudyMinutes: number;

  weakTopics: WeakTopicItem[];
}

export interface QuestionInsight {
  id: string;

  title: string;

  description: string;

  type?:
    | 'success'
    | 'warning'
    | 'info';

  icon?: ReactNode;
}

export interface QuestionStoreState {
  loading: boolean;

  error: string | null;

  questions: QuestionDocument[];

  selectedQuestion:
    | QuestionDocument
    | null;

  analytics:
    | QuestionAnalytics
    | null;

  filters: QuestionFilterValue;

  weakTopics: WeakTopicItem[];

  lastUpdated?: string | null;
}

export interface QuestionStoreActions {
  setLoading: (
    value: boolean,
  ) => void;

  setError: (
    value: string | null,
  ) => void;

  setQuestions: (
    questions: QuestionDocument[],
  ) => void;

  setSelectedQuestion: (
    question: QuestionDocument | null,
  ) => void;

  setAnalytics: (
    analytics: QuestionAnalytics | null,
  ) => void;

  setFilters: (
    filters: QuestionFilterValue,
  ) => void;

  setWeakTopics: (
    topics: WeakTopicItem[],
  ) => void;

  reset: () => void;
}
