// bep-full-project/src/types/subject.types.ts

export type SubjectStatus =
  | 'active'
  | 'inactive'
  | 'archived';

export type SubjectLevel =
  | 'school'
  | 'college'
  | 'university'
  | 'admission'
  | 'job';

export interface Subject {
  id: string;

  name: string;
  slug?: string;

  description?: string;

  icon?: string;
  bannerUrl?: string;

  color?: string;
  gradient?: string;

  level?: SubjectLevel;

  status?: SubjectStatus;

  premium?: boolean;
  featured?: boolean;

  chaptersCount?: number;
  questionsCount?: number;
  examsCount?: number;

  progressPercentage?: number;

  createdBy?: string;

  createdAt?: string;
  updatedAt?: string;
}

/* -------------------------------------------------------------------------- */
/*                                  Chapter                                   */
/* -------------------------------------------------------------------------- */

export interface Chapter {
  id: string;

  subjectId: string;

  name: string;
  slug?: string;

  description?: string;

  order?: number;

  thumbnailUrl?: string;

  questionsCount?: number;
  examsCount?: number;

  completed?: boolean;

  status?: SubjectStatus;

  createdAt?: string;
  updatedAt?: string;
}

/* -------------------------------------------------------------------------- */
/*                                 Topic                                      */
/* -------------------------------------------------------------------------- */

export interface Topic {
  id: string;

  chapterId: string;
  subjectId?: string;

  name: string;

  description?: string;

  order?: number;

  completed?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

/* -------------------------------------------------------------------------- */
/*                             Subject Progress                               */
/* -------------------------------------------------------------------------- */

export interface SubjectProgress {
  id: string;

  userId: string;
  subjectId: string;

  completedChapters?: number;
  totalChapters?: number;

  solvedQuestions?: number;
  totalQuestions?: number;

  progressPercentage?: number;

  totalStudyMinutes?: number;

  lastStudiedAt?: string;

  updatedAt?: string;
}

/* -------------------------------------------------------------------------- */
/*                             Chapter Progress                               */
/* -------------------------------------------------------------------------- */

export interface ChapterProgress {
  id: string;

  userId: string;

  subjectId: string;
  chapterId: string;

  solvedQuestions?: number;
  totalQuestions?: number;

  accuracyPercentage?: number;

  completed?: boolean;

  updatedAt?: string;
}

/* -------------------------------------------------------------------------- */
/*                               Subject Filter                               */
/* -------------------------------------------------------------------------- */

export interface SubjectFilterOptions {
  query?: string;

  level?: SubjectLevel;

  premium?: boolean;
  featured?: boolean;

  status?: SubjectStatus;
}

/* -------------------------------------------------------------------------- */
/*                             Create Subject                                 */
/* -------------------------------------------------------------------------- */

export interface CreateSubjectPayload {
  name: string;

  description?: string;

  icon?: string;
  bannerUrl?: string;

  color?: string;
  gradient?: string;

  level?: SubjectLevel;

  premium?: boolean;
  featured?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                             Update Subject                                 */
/* -------------------------------------------------------------------------- */

export interface UpdateSubjectPayload
  extends Partial<CreateSubjectPayload> {
  status?: SubjectStatus;
}

/* -------------------------------------------------------------------------- */
/*                             Create Chapter                                 */
/* -------------------------------------------------------------------------- */

export interface CreateChapterPayload {
  subjectId: string;

  name: string;

  description?: string;

  order?: number;

  thumbnailUrl?: string;
}

/* -------------------------------------------------------------------------- */
/*                             Update Chapter                                 */
/* -------------------------------------------------------------------------- */

export interface UpdateChapterPayload
  extends Partial<CreateChapterPayload> {
  status?: SubjectStatus;
}

/* -------------------------------------------------------------------------- */
/*                             Subject Analytics                              */
/* -------------------------------------------------------------------------- */

export interface SubjectAnalytics {
  subjectId: string;

  totalStudents?: number;

  totalQuestions?: number;
  totalExams?: number;

  averageAccuracy?: number;

  completionRate?: number;

  averageStudyMinutes?: number;
}

/* -------------------------------------------------------------------------- */
/*                           Recommended Subject                              */
/* -------------------------------------------------------------------------- */

export interface RecommendedSubject {
  subject: Subject;

  reason?: string;

  matchScore?: number;
}

/* -------------------------------------------------------------------------- */
/*                                Weak Area                                   */
/* -------------------------------------------------------------------------- */

export interface WeakArea {
  subjectId: string;

  chapterId?: string;

  topic: string;

  accuracyPercentage: number;

  recommendedActions?: string[];
}

/* -------------------------------------------------------------------------- */
/*                               Subject Badge                                */
/* -------------------------------------------------------------------------- */

export interface SubjectBadge {
  id: string;

  title: string;

  description?: string;

  icon?: string;

  earned?: boolean;

  earnedAt?: string;
}

/* -------------------------------------------------------------------------- */
/*                               API Response                                 */
/* -------------------------------------------------------------------------- */

export interface SubjectApiResponse<T = unknown> {
  success: boolean;

  data?: T;

  message?: string;
  error?: string;
}
