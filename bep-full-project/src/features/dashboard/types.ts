// bep-full-project/src/features/dashboard/types.ts

export type DashboardMetricKey =
  | 'students'
  | 'questions'
  | 'subjects'
  | 'chapters'
  | 'aiSessions'
  | 'mockExams'
  | 'premiumUsers'
  | 'communityPosts';

export type DashboardActivityType =
  | 'practice'
  | 'exam'
  | 'ai-chat'
  | 'community'
  | 'achievement'
  | 'lesson';

export type DashboardTrend =
  | 'up'
  | 'down'
  | 'flat';

export interface DashboardMetric {
  key: DashboardMetricKey;
  label: string;
  value: number;
  formattedValue?: string;
  change?: number;
  trend?: DashboardTrend;
  suffix?: string;
  prefix?: string;
  description?: string;
}

export interface DashboardActivity {
  id: string;
  type: DashboardActivityType;
  title: string;
  description: string;
  timestamp: string;
  score?: number;
  chapter?: string;
  points?: number;
  streak?: number;
  premium?: boolean;
  completed?: boolean;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface DashboardSubjectSummary {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
  banner?: string;
  totalQuestions: number;
  totalChapters: number;
  totalStudents?: number;
  averageScore?: number;
  progress?: number;
  premium?: boolean;
  featured?: boolean;
  locked?: boolean;
}

export interface DashboardQuickAction {
  id: string;
  title: string;
  description: string;
  icon?: string;
  href?: string;
  premium?: boolean;
  highlighted?: boolean;
}

export interface DashboardLeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  streak?: number;
  premium?: boolean;
}

export interface DashboardExamSummary {
  id: string;
  title: string;
  subject: string;
  score?: number;
  totalMarks?: number;
  duration?: number;
  attemptedAt?: string;
  completed?: boolean;
}

export interface DashboardCommunitySummary {
  totalPosts: number;
  totalReplies: number;
  trendingTopics?: string[];
  activeMembers?: number;
}

export interface DashboardAnalyticsOverview {
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  averageStudyTime: number;
  completionRate: number;
  growthRate?: number;
}

export interface DashboardNotification {
  id: string;
  title: string;
  description: string;
  type:
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
  read?: boolean;
  createdAt: string;
  href?: string;
}

export interface DashboardState {
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastUpdated: string | null;

  metrics: DashboardMetric[];
  activities: DashboardActivity[];
  subjects: DashboardSubjectSummary[];

  leaderboard?: DashboardLeaderboardUser[];
  recentExams?: DashboardExamSummary[];
  notifications?: DashboardNotification[];

  analytics?: DashboardAnalyticsOverview;
  community?: DashboardCommunitySummary;

  totalUsers: number;
  totalQuestions: number;
  totalSubjects: number;
  totalChapters: number;
  totalCommunityPosts: number;
  totalAIChats: number;
  totalMockExams: number;
  premiumUsers: number;
}

export interface DashboardStoreActions {
  setLoading: (
    value: boolean,
  ) => void;

  setRefreshing: (
    value: boolean,
  ) => void;

  setError: (
    value: string | null,
  ) => void;

  setLastUpdated: (
    value: string | null,
  ) => void;

  setMetrics: (
    metrics: DashboardMetric[],
  ) => void;

  setActivities: (
    activities: DashboardActivity[],
  ) => void;

  setSubjects: (
    subjects: DashboardSubjectSummary[],
  ) => void;

  reset: () => void;
}

export interface UseDashboardOptions {
  enabled?: boolean;
  recentLimit?: number;
  subjectsLimit?: number;
  refreshIntervalMs?: number;
}

export interface UseDashboardReturn
  extends DashboardState {
  refresh: () => Promise<void>;
}
