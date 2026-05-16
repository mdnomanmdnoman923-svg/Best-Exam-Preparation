// bep-full-project/src/features/profile/types.ts

import type { ReactNode } from 'react';

export type ProfileRole =
  | 'student'
  | 'moderator'
  | 'admin';

export type ProfileLanguage =
  | 'bn'
  | 'en';

export type ProfileGender =
  | 'male'
  | 'female'
  | 'other';

export type ProfileCompletionStatus =
  | 'completed'
  | 'partial'
  | 'missing';

export interface UserProfile {
  id?: string;

  uid: string;

  name: string;

  email: string;

  username?: string;

  photoURL?: string | null;

  avatar?: string | null;

  role?: ProfileRole;

  premium?: boolean;

  premiumExpiresAt?: string | null;

  verified?: boolean;

  institution?: string;

  phone?: string;

  bio?: string;

  batchId?: string;

  batchName?: string;

  classId?: string;

  className?: string;

  educationLevelId?: string;

  educationLevelName?: string;

  location?: string;

  gender?: ProfileGender;

  dateOfBirth?: string;

  language?: ProfileLanguage;

  totalPoints?: number;

  totalExams?: number;

  totalPracticeCompleted?: number;

  leaderboardRank?: number;

  streak?: number;

  bookmarksCount?: number;

  joinedAt?: string;

  lastActiveAt?: string;

  createdAt?: unknown;

  updatedAt?: unknown;
}

export interface BatchOption {
  id: string;

  label: string;

  year?: string;

  institution?: string;

  description?: string;

  totalStudents?: number;

  premium?: boolean;

  featured?: boolean;

  icon?: ReactNode;
}

export interface ClassOption {
  id: string;

  label: string;

  level?: string;

  institutionType?: string;

  description?: string;

  totalStudents?: number;

  premium?: boolean;

  featured?: boolean;

  icon?: ReactNode;
}

export interface EducationLevelOption {
  id: string;

  label: string;

  slug?: string;

  description?: string;

  curriculum?: string;

  gradeRange?: string;

  totalPrograms?: number;

  premium?: boolean;

  featured?: boolean;

  icon?: ReactNode;
}

export interface ProfileCompletionItem {
  id: string;

  label: string;

  value?: string | null;

  required?: boolean;

  completed?: boolean;

  icon?: ReactNode;

  helperText?: string;
}

export interface ProfileCompletionSummary {
  completion: number;

  completionCount: number;

  totalFields: number;

  fields: ProfileCompletionItem[];
}

export interface ProfileAnalytics {
  totalStudyHours: number;

  completedCourses: number;

  completedExams: number;

  completedPractice: number;

  averageScore: number;

  weakSubjects: string[];

  strongSubjects: string[];

  streak: number;

  leaderboardRank?: number;
}

export interface ProfilePreferences {
  darkMode?: boolean;

  notificationsEnabled?: boolean;

  emailNotifications?: boolean;

  aiRecommendations?: boolean;

  preferredLanguage?: ProfileLanguage;

  examReminder?: boolean;
}

export interface ProfileState {
  profile: UserProfile | null;

  loading: boolean;

  saving: boolean;

  error: string | null;

  completion: ProfileCompletionSummary | null;

  analytics: ProfileAnalytics | null;

  preferences: ProfilePreferences | null;
}

export interface UpdateProfilePayload {
  name?: string;

  username?: string;

  photoURL?: string | null;

  avatar?: string | null;

  institution?: string;

  phone?: string;

  bio?: string;

  batchId?: string;

  batchName?: string;

  classId?: string;

  className?: string;

  educationLevelId?: string;

  educationLevelName?: string;

  location?: string;

  gender?: ProfileGender;

  dateOfBirth?: string;

  language?: ProfileLanguage;
}

export interface BatchSelectProps {
  batches: BatchOption[];

  value?: string;

  title?: string;

  subtitle?: string;

  placeholder?: string;

  searchable?: boolean;

  loading?: boolean;

  disabled?: boolean;

  allowClear?: boolean;

  showStats?: boolean;

  onChange: (
    batchId: string,
  ) => void;

  onClear?: () => void;

  className?: string;
}

export interface ClassSelectProps {
  classes: ClassOption[];

  value?: string;

  title?: string;

  subtitle?: string;

  placeholder?: string;

  searchable?: boolean;

  loading?: boolean;

  disabled?: boolean;

  allowClear?: boolean;

  showStats?: boolean;

  onChange: (
    classId: string,
  ) => void;

  onClear?: () => void;

  className?: string;
}

export interface EducationLevelSelectProps {
  levels: EducationLevelOption[];

  value?: string;

  title?: string;

  subtitle?: string;

  placeholder?: string;

  searchable?: boolean;

  loading?: boolean;

  disabled?: boolean;

  allowClear?: boolean;

  showStats?: boolean;

  onChange: (
    levelId: string,
  ) => void;

  onClear?: () => void;

  className?: string;
}

export interface ProfileCompletionStepProps {
  title?: string;

  subtitle?: string;

  progress?: number;

  status?: ProfileCompletionStatus;

  items: ProfileCompletionItem[];

  loading?: boolean;

  premium?: boolean;

  onContinue?: () => void;

  onEdit?: (
    itemId: string,
  ) => void;

  onSkip?: () => void;

  className?: string;
}

export interface UseProfileOptions {
  userId?: string;

  autoLoad?: boolean;

  includeAuthUser?: boolean;

  onError?: (
    error: Error,
  ) => void;
}

export interface UseProfileReturn {
  profile: UserProfile | null;

  loading: boolean;

  saving: boolean;

  error: string | null;

  completion: number;

  completionCount: number;

  totalFields: number;

  fields: ProfileCompletionItem[];

  refreshProfile: () => Promise<UserProfile | null>;

  updateProfile: (
    data: Partial<UserProfile>,
  ) => Promise<UserProfile>;

  patchProfile: (
    data: Partial<UserProfile>,
  ) => Promise<UserProfile>;

  clearError: () => void;

  resetProfileCache: () => void;
}

export interface SaveProfileOptions {
  merge?: boolean;

  syncAuthProfile?: boolean;
}

export interface ProfileLeaderboardEntry {
  uid: string;

  name: string;

  avatar?: string | null;

  points: number;

  streak?: number;

  rank: number;

  premium?: boolean;
}

export interface ProfileNotificationPreference {
  push: boolean;

  email: boolean;

  sms: boolean;

  leaderboard: boolean;

  reminders: boolean;
}
