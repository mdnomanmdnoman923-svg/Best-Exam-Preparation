// bep-full-project/src/features/chapters/types.ts

export type ChapterDifficulty =
  | 'easy'
  | 'medium'
  | 'hard';

export type ChapterStatus =
  | 'draft'
  | 'published'
  | 'archived';

export type ChapterVisibility =
  | 'public'
  | 'private'
  | 'premium';

export interface ChapterTag {
  id: string;
  label: string;
  color?: string;
}

export interface ChapterProgress {
  completedQuestions: number;
  totalQuestions: number;
  progress: number;
  lastPracticedAt?: string | Date;
}

export interface ChapterStats {
  totalStudents?: number;
  totalExams?: number;
  averageScore?: number;
  averageCompletionRate?: number;
  leaderboardEnabled?: boolean;
}

export interface ChapterSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface ChapterDocument {
  id?: string;
  subjectId: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  thumbnail?: string;
  banner?: string;
  icon?: string;
  order: number;
  estimatedMinutes?: number;
  difficulty?: ChapterDifficulty;
  status?: ChapterStatus;
  visibility?: ChapterVisibility;
  premium?: boolean;
  locked?: boolean;
  featured?: boolean;
  aiSupported?: boolean;
  tags?: string[];
  totalQuestions?: number;
  completedQuestions?: number;
  totalNotes?: number;
  totalVideos?: number;
  streak?: number;
  rating?: number;
  language?: 'bn' | 'en';
  seo?: ChapterSEO;
  stats?: ChapterStats;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface CreateChapterInput {
  subjectId: string;
  title: string;
  slug?: string;
  description?: string;
  content?: string;
  thumbnail?: string;
  banner?: string;
  icon?: string;
  order?: number;
  estimatedMinutes?: number;
  difficulty?: ChapterDifficulty;
  status?: ChapterStatus;
  visibility?: ChapterVisibility;
  premium?: boolean;
  locked?: boolean;
  featured?: boolean;
  aiSupported?: boolean;
  tags?: string[];
  totalQuestions?: number;
  completedQuestions?: number;
  totalNotes?: number;
  totalVideos?: number;
  language?: 'bn' | 'en';
}

export interface UpdateChapterInput
  extends Partial<CreateChapterInput> {
  slug?: string;
}

export interface ChapterCardData {
  id: string;
  title: string;
  subject: string;
  description?: string;
  thumbnail?: string;
  progress?: number;
  totalQuestions?: number;
  completedQuestions?: number;
  estimatedMinutes?: number;
  difficulty?: ChapterDifficulty;
  premium?: boolean;
  locked?: boolean;
  featured?: boolean;
  aiSupported?: boolean;
  streak?: number;
  rating?: number;
}

export interface ChapterListFilters {
  search?: string;
  subjectId?: string;
  difficulty?: ChapterDifficulty | 'all';
  status?: ChapterStatus | 'all';
  visibility?: ChapterVisibility | 'all';
  premium?: boolean;
  featured?: boolean;
  aiSupported?: boolean;
}

export interface ChapterSortOptions {
  field:
    | 'title'
    | 'order'
    | 'createdAt'
    | 'updatedAt'
    | 'rating';
  direction: 'asc' | 'desc';
}

export interface ChapterLearningInsight {
  weakTopics: string[];
  strongTopics: string[];
  recommendedPracticeCount: number;
  predictedScore?: number;
}

export interface ChapterExamConfig {
  enabled: boolean;
  duration?: number;
  totalMarks?: number;
  passingMarks?: number;
  negativeMarking?: boolean;
}

export interface ChapterLeaderboardEntry {
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  streak?: number;
}

export interface ChapterAnalytics {
  chapterId: string;
  totalViews: number;
  totalPractices: number;
  completionRate: number;
  averageTimeSpent: number;
  activeStudents: number;
}

export interface ChapterSubscriptionState {
  subscribed: boolean;
  premiumRequired: boolean;
  unlocked: boolean;
}

export interface ChapterStoreState {
  chapters: ChapterDocument[];
  activeChapter: ChapterDocument | null;
  loading: boolean;
  error: string | null;
}

export interface ChapterStoreActions {
  setChapters: (
    chapters: ChapterDocument[],
  ) => void;

  setActiveChapter: (
    chapter: ChapterDocument | null,
  ) => void;

  addChapter: (
    chapter: ChapterDocument,
  ) => void;

  updateChapter: (
    id: string,
    data: Partial<ChapterDocument>,
  ) => void;

  removeChapter: (
    id: string,
  ) => void;

  setLoading: (
    value: boolean,
  ) => void;

  setError: (
    value: string | null,
  ) => void;

  reset: () => void;
}
