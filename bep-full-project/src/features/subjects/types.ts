// bep-full-project/src/features/subjects/types.ts

import type { ReactNode } from 'react';

export type SubjectLevel =
  | 'school'
  | 'college'
  | 'university'
  | 'admission';

export type SubjectStatus =
  | 'active'
  | 'draft'
  | 'archived';

export interface SubjectGridItem {
  id: string;

  name: string;

  slug?: string;

  level?: SubjectLevel;

  description?: string;

  totalChapters?: number;

  totalQuestions?: number;

  totalStudents?: number;

  averageScore?: number;

  premium?: boolean;

  featured?: boolean;

  trending?: boolean;

  locked?: boolean;

  icon?: ReactNode;

  colorClass?: string;

  lastUpdatedAt?: string;
}

export interface SubjectDocument {
  id?: string;

  name: string;

  slug?: string;

  level?: SubjectLevel;

  description?: string;

  icon?: string;

  colorClass?: string;

  status?: SubjectStatus;

  order?: number;

  premium?: boolean;

  featured?: boolean;

  trending?: boolean;

  locked?: boolean;

  totalChapters?: number;

  totalQuestions?: number;

  totalStudents?: number;

  averageScore?: number;

  createdBy?: string;

  updatedBy?: string;

  createdAt?: unknown;

  updatedAt?: unknown;

  lastUpdatedAt?: unknown;
}

export interface SubjectProgress {
  subjectId: string;

  subjectName: string;

  completedChapters: number;

  totalChapters: number;

  completedQuestions: number;

  totalQuestions: number;

  accuracy: number;

  streak?: number;

  studyMinutes?: number;

  lastPracticedAt?: string;

  weakTopics?: string[];

  premium?: boolean;
}

export interface SubjectProgressCardProps {
  progress: SubjectProgress;

  loading?: boolean;

  compact?: boolean;

  onContinue?: (
    subjectId: string,
  ) => void;

  onViewAnalytics?: (
    subjectId: string,
  ) => void;

  className?: string;
}

export interface SubjectFilterValue {
  search: string;

  level:
    | 'all'
    | SubjectLevel;

  status:
    | 'all'
    | SubjectStatus;

  premiumOnly: boolean;

  featuredOnly: boolean;

  trendingOnly: boolean;
}

export interface SubjectFilterProps {
  value: SubjectFilterValue;

  totalSubjects?: number;

  visibleSubjects?: number;

  premiumSubjects?: number;

  loading?: boolean;

  title?: string;

  subtitle?: string;

  onChange: (
    value: SubjectFilterValue,
  ) => void;

  onReset?: () => void;

  onShuffle?: () => void;

  className?: string;
}

export interface SubjectGridProps {
  subjects: SubjectGridItem[];

  title?: string;

  subtitle?: string;

  loading?: boolean;

  searchable?: boolean;

  compact?: boolean;

  onSubjectClick?: (
    subjectId: string,
  ) => void;

  onViewAll?: () => void;

  className?: string;
}

export interface CreateSubjectInput {
  name: string;

  slug?: string;

  level?: SubjectLevel;

  description?: string;

  icon?: string;

  colorClass?: string;

  status?: SubjectStatus;

  order?: number;

  premium?: boolean;

  featured?: boolean;

  trending?: boolean;

  locked?: boolean;

  totalChapters?: number;

  totalQuestions?: number;

  totalStudents?: number;

  averageScore?: number;

  createdBy?: string;
}

export interface UpdateSubjectInput
  extends Partial<CreateSubjectInput> {
  status?: SubjectStatus;
}

export interface SubjectStats {
  totalSubjects: number;

  activeSubjects: number;

  draftSubjects: number;

  archivedSubjects: number;

  premiumSubjects: number;

  featuredSubjects: number;

  trendingSubjects: number;

  lockedSubjects: number;

  totalChapters: number;

  totalQuestions: number;

  totalStudents: number;

  averageScore: number;
}

export interface SubjectSummary {
  subjectId: string;

  name: string;

  slug?: string;

  level?: SubjectLevel;

  questionCount: number;

  chapterCount: number;

  studentCount: number;

  averageScore: number;
}

export interface SubjectListOptions {
  level?: SubjectLevel;

  status?: SubjectStatus;

  premiumOnly?: boolean;

  featuredOnly?: boolean;

  trendingOnly?: boolean;

  lockedOnly?: boolean;

  take?: number;
}

export interface SubjectInsight {
  id: string;

  title: string;

  description: string;

  type?:
    | 'success'
    | 'warning'
    | 'info';

  icon?: ReactNode;
}

export interface SubjectStoreState {
  loading: boolean;

  error: string | null;

  subjects: SubjectDocument[];

  featuredSubjects: SubjectDocument[];

  trendingSubjects: SubjectDocument[];

  selectedSubject:
    | SubjectDocument
    | null;

  progress: SubjectProgress[];

  stats:
    | SubjectStats
    | null;

  filters: SubjectFilterValue;

  lastUpdated?: string | null;
}

export interface SubjectStoreActions {
  setLoading: (
    value: boolean,
  ) => void;

  setError: (
    value: string | null,
  ) => void;

  setSubjects: (
    subjects: SubjectDocument[],
  ) => void;

  setFeaturedSubjects: (
    subjects: SubjectDocument[],
  ) => void;

  setTrendingSubjects: (
    subjects: SubjectDocument[],
  ) => void;

  setSelectedSubject: (
    subject: SubjectDocument | null,
  ) => void;

  setProgress: (
    progress: SubjectProgress[],
  ) => void;

  setStats: (
    stats: SubjectStats | null,
  ) => void;

  setFilters: (
    filters: SubjectFilterValue,
  ) => void;

  reset: () => void;
}
