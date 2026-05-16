// bep-full-project/src/features/admin/types.ts

export type UserRole =
  | 'student'
  | 'moderator'
  | 'admin';

export type UserStatus =
  | 'active'
  | 'inactive'
  | 'banned';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  premium: boolean;
  institution: string;
  examsCompleted: number;
  joinedAt: string;
  status: UserStatus;
}

export interface AdminStat {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
}

export interface SubjectItem {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  description?: string;
  totalQuestions?: number;
}

export interface ChapterItem {
  id: string;
  subjectId: string;
  title: string;
  slug: string;
  order: number;
  totalQuestions?: number;
}

export interface QuestionItem {
  id: string;
  subjectId: string;
  chapterId: string;
  type: 'mcq' | 'cq' | 'sq';
  difficulty:
    | 'easy'
    | 'medium'
    | 'hard';
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
  tags?: string[];
}

export interface CMSContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  published: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface DashboardAnalytics {
  totalStudents: number;
  activeUsers: number;
  premiumUsers: number;
  totalQuestions: number;
  totalSubjects: number;
  aiSessions: number;
  revenue: number;
}
