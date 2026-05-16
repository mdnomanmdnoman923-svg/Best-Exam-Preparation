// bep-full-project/src/features/progress/types.ts

import type { ReactNode } from 'react';

export type ProgressChartMode =
  | 'overview'
  | 'accuracy'
  | 'study-time'
  | 'subjects'
  | 'streak';

export type WeakTopicSeverity =
  | 'low'
  | 'medium'
  | 'high';

export interface ProgressDataPoint {
  label: string;

  value: number;

  secondaryValue?: number;

  tertiaryValue?: number;

  date?: string;
}

export interface ProgressSubjectData {
  subject: string;

  score: number;

  totalQuestions?: number;

  correct?: number;

  incorrect?: number;

  completed?: number;
}

export interface ProgressOverview {
  averageScore: number;

  totalStudyMinutes: number;

  completedSessions: number;

  streakDays: number;

  weeklyGrowthPercentage?: number;

  totalPracticeCompleted?: number;

  totalMockExams?: number;

  totalQuestionsAnswered?: number;
}

export interface ProgressInsight {
  id: string;

  title: string;

  description: string;

  type?: 'success' | 'warning' | 'info';

  icon?: ReactNode;
}

export interface ProgressAnalytics {
  overview: ProgressOverview;

  weeklyData: ProgressDataPoint[];

  subjectData: ProgressSubjectData[];

  weakTopics: WeakTopicItem[];

  insights?: ProgressInsight[];
}

export interface ProgressChartProps {
  title?: string;

  subtitle?: string;

  mode?: ProgressChartMode;

  weeklyData?: ProgressDataPoint[];

  subjectData?: ProgressSubjectData[];

  loading?: boolean;

  premium?: boolean;

  totalStudyMinutes?: number;

  averageScore?: number;

  completedSessions?: number;

  streakDays?: number;

  onModeChange?: (
    mode: ProgressChartMode,
  ) => void;

  onViewDetails?: () => void;

  className?: string;
}

export interface StudyStreakMilestone {
  id: string;

  days: number;

  title: string;

  description?: string;

  reward?: string;

  unlocked?: boolean;
}

export interface StudyStreakCardProps {
  title?: string;

  subtitle?: string;

  streakDays?: number;

  longestStreakDays?: number;

  weeklyGoalDays?: number;

  currentWeekDays?: number;

  totalStudyDays?: number;

  studyMinutesToday?: number;

  consistencyScore?: number;

  premium?: boolean;

  loading?: boolean;

  milestones?: StudyStreakMilestone[];

  nextMilestoneDays?: number;

  nextMilestoneLabel?: string;

  onViewHistory?: () => void;

  onContinue?: () => void;

  onShare?: () => void;

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

export interface WeakTopicListProps {
  title?: string;

  subtitle?: string;

  topics: WeakTopicItem[];

  loading?: boolean;

  searchable?: boolean;

  showFilter?: boolean;

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

export interface ProgressLeaderboardEntry {
  uid: string;

  name: string;

  avatar?: string | null;

  score: number;

  streakDays?: number;

  rank: number;

  premium?: boolean;
}

export interface DailyProgressRecord {
  id: string;

  date: string;

  studyMinutes: number;

  questionsAnswered: number;

  accuracy: number;

  completedSessions: number;

  streakActive?: boolean;
}

export interface SubjectPerformanceRecord {
  subjectId?: string;

  subjectName: string;

  score: number;

  completedQuestions: number;

  correctAnswers: number;

  incorrectAnswers: number;

  weakAreas?: string[];

  strongAreas?: string[];
}

export interface ProgressGoal {
  id: string;

  title: string;

  target: number;

  current: number;

  completed?: boolean;

  deadline?: string;

  category?:
    | 'study-time'
    | 'practice'
    | 'accuracy'
    | 'streak';
}

export interface ProgressStoreState {
  loading: boolean;

  error: string | null;

  analytics: ProgressAnalytics | null;

  streak: StudyStreakCardProps | null;

  weakTopics: WeakTopicItem[];

  goals: ProgressGoal[];

  lastUpdated?: string | null;
}

export interface ProgressStoreActions {
  setLoading: (
    value: boolean,
  ) => void;

  setError: (
    value: string | null,
  ) => void;

  setAnalytics: (
    analytics: ProgressAnalytics | null,
  ) => void;

  setWeakTopics: (
    topics: WeakTopicItem[],
  ) => void;

  setGoals: (
    goals: ProgressGoal[],
  ) => void;

  reset: () => void;
}
