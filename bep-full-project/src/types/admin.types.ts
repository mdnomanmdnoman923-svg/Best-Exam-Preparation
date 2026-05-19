// bep-full-project/src/types/admin.types.ts

export type AdminRole =
  | 'moderator'
  | 'admin'
  | 'super_admin';

export type AdminPermission =
  | 'manage_users'
  | 'manage_profiles'
  | 'manage_questions'
  | 'manage_subjects'
  | 'manage_chapters'
  | 'manage_content'
  | 'manage_exams'
  | 'manage_payments'
  | 'manage_reports'
  | 'manage_settings'
  | 'view_analytics'
  | 'manage_roles'
  | 'full_access';

export type AdminActivityType =
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'ban'
  | 'unban'
  | 'login'
  | 'logout'
  | 'publish';

export type AdminContentStatus =
  | 'draft'
  | 'pending'
  | 'published'
  | 'archived'
  | 'rejected';

export interface AdminUser {
  id: string;
  uid?: string;

  fullName: string;
  email: string;

  avatarUrl?: string;
  phone?: string;

  role: AdminRole;
  permissions: AdminPermission[];

  active: boolean;
  verified?: boolean;
  banned?: boolean;

  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;

  totalQuestions: number;
  totalSubjects: number;
  totalChapters: number;

  totalExams: number;
  totalMockTests: number;

  premiumUsers: number;
  revenue?: number;

  reportsPending?: number;
  publishedContent?: number;
}

export interface AdminActivityLog {
  id: string;

  adminId: string;
  adminName?: string;

  type: AdminActivityType;

  targetType: string;
  targetId?: string;

  message: string;

  metadata?: Record<string, unknown>;

  createdAt: string;
}

export interface AdminQuestion {
  id: string;

  question: string;
  explanation?: string;

  subjectId?: string;
  chapterId?: string;

  difficulty?: 'easy' | 'medium' | 'hard';

  tags?: string[];

  approved?: boolean;
  published?: boolean;

  createdBy?: string;
  updatedBy?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface AdminSubject {
  id: string;

  name: string;
  slug?: string;

  icon?: string;
  color?: string;

  description?: string;

  chaptersCount?: number;
  questionsCount?: number;

  active?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface AdminChapter {
  id: string;

  subjectId: string;

  name: string;
  slug?: string;

  description?: string;

  order?: number;

  active?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface AdminContentItem {
  id: string;

  title: string;
  description?: string;

  type:
    | 'article'
    | 'video'
    | 'pdf'
    | 'note'
    | 'assignment'
    | 'resource';

  status: AdminContentStatus;

  thumbnailUrl?: string;
  contentUrl?: string;

  subjectId?: string;
  chapterId?: string;

  premium?: boolean;
  featured?: boolean;

  authorId?: string;
  authorName?: string;

  tags?: string[];

  createdAt?: string;
  updatedAt?: string;
}

export interface AdminReport {
  id: string;

  reporterId?: string;
  reporterName?: string;

  targetType:
    | 'question'
    | 'user'
    | 'post'
    | 'comment'
    | 'content';

  targetId: string;

  reason: string;
  details?: string;

  resolved?: boolean;
  resolvedBy?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface AdminSystemSettings {
  allowRegistration: boolean;

  maintenanceMode: boolean;

  aiAssistantEnabled: boolean;
  leaderboardEnabled: boolean;
  communityEnabled: boolean;

  maxUploadSizeMB: number;

  supportEmail?: string;
  platformName?: string;

  updatedAt?: string;
}

export interface AdminAnalyticsData {
  date: string;

  users: number;
  activeUsers: number;

  questionsAnswered: number;
  examsCompleted: number;

  revenue?: number;
}

export interface AdminNotification {
  id: string;

  title: string;
  message: string;

  type:
    | 'info'
    | 'success'
    | 'warning'
    | 'error';

  read?: boolean;

  createdAt?: string;
}

export interface AdminSearchFilters {
  query?: string;

  status?: string;
  role?: string;

  subjectId?: string;
  chapterId?: string;

  fromDate?: string;
  toDate?: string;
}

export interface AdminTableColumn<T = unknown> {
  key: keyof T | string;
  label: string;

  sortable?: boolean;
  searchable?: boolean;

  width?: number | string;

  align?: 'left' | 'center' | 'right';
}

export interface AdminPagination {
  page: number;
  limit: number;

  total: number;
  totalPages: number;
}

export interface AdminApiResponse<T = unknown> {
  success: boolean;

  data?: T;

  message?: string;
  error?: string;
}

export interface AdminActionPayload<T = unknown> {
  id: string;
  data?: T;
}

export interface AdminModalState<T = unknown> {
  open: boolean;

  mode?: 'create' | 'edit' | 'delete' | 'view';

  data?: T;
}
