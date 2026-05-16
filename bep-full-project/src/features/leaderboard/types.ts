// bep-full-project/src/features/leaderboard/types.ts

export type LeaderboardPeriod =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'all-time';

export type LeaderboardScope =
  | 'global'
  | 'subject'
  | 'chapter'
  | 'institution';

export type LeaderboardBadgeType =
  | 'gold'
  | 'silver'
  | 'bronze'
  | 'premium'
  | 'topper'
  | 'streak'
  | 'champion';

export interface LeaderboardBadge {
  id: string;
  type: LeaderboardBadgeType;
  label: string;
  description?: string;
  icon?: string;
}

export interface LeaderboardUser {
  id: string;

  name: string;

  avatar?: string;

  institution?: string;

  points: number;

  rank: number;

  streak?: number;

  premium?: boolean;

  score?: number;

  subject?: string;

  badge?: string;

  badges?: LeaderboardBadge[];

  completedExams?: number;

  correctAnswers?: number;

  incorrectAnswers?: number;

  totalQuestions?: number;

  accuracy?: number;

  totalStudyMinutes?: number;

  country?: string;

  city?: string;

  createdAt?: string;

  updatedAt?: string;
}

export interface LeaderboardStats {
  totalStudents: number;

  totalPoints: number;

  averageScore: number;

  highestScore: number;

  activeToday: number;

  premiumUsers: number;
}

export interface LeaderboardFilterState {
  period: LeaderboardPeriod;

  scope: LeaderboardScope;

  subject?: string;

  chapter?: string;

  institution?: string;

  search?: string;
}

export interface LeaderboardPodiumData {
  first?: LeaderboardUser;

  second?: LeaderboardUser;

  third?: LeaderboardUser;
}

export interface LeaderboardPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;
}

export interface LeaderboardResponse {
  users: LeaderboardUser[];

  podium: LeaderboardPodiumData;

  stats?: LeaderboardStats;

  pagination?: LeaderboardPagination;
}

export interface LeaderboardTableProps {
  users: LeaderboardUser[];

  title?: string;

  subtitle?: string;

  loading?: boolean;

  searchable?: boolean;

  showFilters?: boolean;

  onUserClick?: (
    userId: string,
  ) => void;

  onViewProfile?: (
    userId: string,
  ) => void;

  className?: string;
}

export interface LeaderboardPodiumProps {
  users: LeaderboardUser[];

  title?: string;

  subtitle?: string;

  onUserClick?: (
    userId: string,
  ) => void;

  onViewAll?: () => void;

  className?: string;
}

export interface LeaderboardState {
  loading: boolean;

  refreshing: boolean;

  error: string | null;

  users: LeaderboardUser[];

  podium: LeaderboardPodiumData;

  stats: LeaderboardStats | null;

  filters: LeaderboardFilterState;

  pagination: LeaderboardPagination | null;

  selectedUserId?: string | null;

  lastUpdated?: string | null;
}

export interface LeaderboardStoreActions {
  setLoading: (
    value: boolean,
  ) => void;

  setRefreshing: (
    value: boolean,
  ) => void;

  setError: (
    value: string | null,
  ) => void;

  setUsers: (
    users: LeaderboardUser[],
  ) => void;

  setPodium: (
    podium: LeaderboardPodiumData,
  ) => void;

  setStats: (
    stats: LeaderboardStats | null,
  ) => void;

  setFilters: (
    filters: Partial<LeaderboardFilterState>,
  ) => void;

  setPagination: (
    pagination: LeaderboardPagination | null,
  ) => void;

  setSelectedUserId: (
    userId: string | null,
  ) => void;

  reset: () => void;
}

export interface LeaderboardQueryOptions {
  period?: LeaderboardPeriod;

  scope?: LeaderboardScope;

  subject?: string;

  chapter?: string;

  institution?: string;

  limit?: number;

  page?: number;

  search?: string;
}

export interface LeaderboardAchievement {
  id: string;

  title: string;

  description?: string;

  pointsReward?: number;

  unlocked?: boolean;

  unlockedAt?: string;

  badge?: LeaderboardBadge;
}

export interface LeaderboardHistoryEntry {
  id: string;

  userId: string;

  rank: number;

  points: number;

  score?: number;

  createdAt: string;

  period: LeaderboardPeriod;
}

export interface LeaderboardTrend {
  userId: string;

  previousRank?: number;

  currentRank: number;

  change: number;

  direction: 'up' | 'down' | 'same';
}
