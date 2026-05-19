import type { UserRole } from './auth.types';

export interface UserProfile {
  uid: string;

  fullName?: string;
  username?: string;

  email?: string | null;
  phone?: string;

  avatarUrl?: string;
  coverUrl?: string;

  bio?: string;
  gender?: 'male' | 'female' | 'other';

  dateOfBirth?: string;

  location?: string;
  address?: string;

  institution?: string;
  className?: string;
  batch?: string;
  subject?: string;

  language?: 'bn' | 'en';

  role?: UserRole;

  premium?: boolean;
  verified?: boolean;

  streakDays?: number;
  xp?: number;
  level?: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface AcademicProfile {
  institution?: string;
  className?: string;
  batch?: string;
  subject?: string;
  group?: string;
  board?: string;
  passingYear?: number;
  currentGPA?: number;
  targetGPA?: number;
}

export interface StudyStats {
  totalStudyMinutes?: number;
  totalQuestionsSolved?: number;
  totalMockTests?: number;
  averageAccuracy?: number;
  strongestSubject?: string;
  weakestSubject?: string;
  streakDays?: number;
  rank?: number;
  updatedAt?: string;
}

export interface ProfilePreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: 'bn' | 'en';
  compactMode?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  publicProfile?: boolean;
  showProgress?: boolean;
  leaderboardVisible?: boolean;
  aiAssistantEnabled?: boolean;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  youtube?: string;
}

export interface UserAchievement {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  xpReward?: number;
  unlockedAt?: string;
}

export interface UserBadge {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  earnedAt?: string;
}

export interface UserActivity {
  id: string;
  type:
    | 'practice'
    | 'mock_test'
    | 'exam'
    | 'community_post'
    | 'achievement'
    | 'login';
  title: string;
  description?: string;
  createdAt?: string;
}

export interface ProfileCompletion {
  percentage: number;
  completedFields: string[];
  missingFields: string[];
}

export interface UpdateProfilePayload {
  fullName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  location?: string;
  address?: string;
  institution?: string;
  className?: string;
  batch?: string;
  subject?: string;
  language?: 'bn' | 'en';
}

export interface ProfilePrivacySettings {
  publicProfile?: boolean;
  showEmail?: boolean;
  showPhone?: boolean;
  showProgress?: boolean;
  showLeaderboardRank?: boolean;
  allowMessages?: boolean;
  allowMentions?: boolean;
}

export interface ProfileApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ProfileSearchFilters {
  query?: string;
  institution?: string;
  className?: string;
  verified?: boolean;
  premium?: boolean;
  role?: UserRole;
}

export interface PublicProfile {
  uid: string;
  fullName?: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  institution?: string;
  className?: string;
  verified?: boolean;
  premium?: boolean;
  level?: number;
  xp?: number;
  badges?: UserBadge[];
}
