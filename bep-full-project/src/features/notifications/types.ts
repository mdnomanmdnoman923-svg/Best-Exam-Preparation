// bep-full-project/src/features/notifications/types.ts

import type { ReactNode } from 'react';

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'achievement'
  | 'exam'
  | 'community'
  | 'premium';

export type NotificationPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export type NotificationChannel =
  | 'in-app'
  | 'push'
  | 'email'
  | 'sms';

export type NotificationStatus =
  | 'unread'
  | 'read'
  | 'archived';

export interface NotificationAction {
  id: string;
  label: string;
  href?: string;
  external?: boolean;
  variant?:
    | 'default'
    | 'secondary'
    | 'ghost'
    | 'danger';
}

export interface NotificationMetadata {
  examId?: string;
  questionId?: string;
  communityPostId?: string;
  leaderboardId?: string;
  userId?: string;
  subjectId?: string;
  chapterId?: string;
  premiumPlanId?: string;
  [key: string]: unknown;
}

export interface NotificationItem {
  id: string;

  title: string;

  message: string;

  type: NotificationType;

  priority?: NotificationPriority;

  status?: NotificationStatus;

  createdAt: string;

  updatedAt?: string;

  read?: boolean;

  archived?: boolean;

  href?: string;

  actionLabel?: string;

  premium?: boolean;

  icon?: ReactNode;

  image?: string;

  actions?: NotificationAction[];

  metadata?: NotificationMetadata;

  senderId?: string;

  senderName?: string;

  senderAvatar?: string;

  expiresAt?: string;

  channels?: NotificationChannel[];
}

export interface NotificationPreferences {
  pushEnabled: boolean;

  emailEnabled: boolean;

  smsEnabled: boolean;

  leaderboardAlerts: boolean;

  examReminders: boolean;

  communityReplies: boolean;

  aiStudyTips: boolean;

  premiumOffers: boolean;

  achievementAlerts: boolean;

  dailyDigest: boolean;
}

export interface NotificationStats {
  total: number;

  unread: number;

  archived: number;

  premium: number;

  today: number;

  thisWeek: number;
}

export interface NotificationFilterState {
  search: string;

  type: NotificationType | 'all';

  status:
    | NotificationStatus
    | 'all';

  priority:
    | NotificationPriority
    | 'all';

  premiumOnly: boolean;
}

export interface NotificationPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;
}

export interface NotificationResponse {
  notifications: NotificationItem[];

  stats?: NotificationStats;

  pagination?: NotificationPagination;
}

export interface NotificationListProps {
  notifications: NotificationItem[];

  loading?: boolean;

  title?: string;

  subtitle?: string;

  onRead?: (
    notificationId: string,
  ) => void;

  onDelete?: (
    notificationId: string,
  ) => void;

  onMarkAllRead?: () => void;

  onAction?: (
    notification: NotificationItem,
  ) => void;

  className?: string;
}

export interface NotificationState {
  loading: boolean;

  refreshing: boolean;

  error: string | null;

  notifications: NotificationItem[];

  stats: NotificationStats | null;

  filters: NotificationFilterState;

  pagination: NotificationPagination | null;

  selectedNotificationId?: string | null;

  preferences?: NotificationPreferences;

  lastUpdated?: string | null;
}

export interface NotificationStoreActions {
  setLoading: (
    value: boolean,
  ) => void;

  setRefreshing: (
    value: boolean,
  ) => void;

  setError: (
    value: string | null,
  ) => void;

  setNotifications: (
    notifications: NotificationItem[],
  ) => void;

  addNotification: (
    notification: NotificationItem,
  ) => void;

  removeNotification: (
    notificationId: string,
  ) => void;

  markAsRead: (
    notificationId: string,
  ) => void;

  markAllAsRead: () => void;

  archiveNotification: (
    notificationId: string,
  ) => void;

  setStats: (
    stats: NotificationStats | null,
  ) => void;

  setFilters: (
    filters: Partial<NotificationFilterState>,
  ) => void;

  setPagination: (
    pagination: NotificationPagination | null,
  ) => void;

  setPreferences: (
    preferences: NotificationPreferences,
  ) => void;

  reset: () => void;
}

export interface NotificationQueryOptions {
  page?: number;

  limit?: number;

  type?: NotificationType;

  status?: NotificationStatus;

  priority?: NotificationPriority;

  search?: string;

  premiumOnly?: boolean;
}

export interface NotificationRealtimeEvent {
  type:
    | 'created'
    | 'updated'
    | 'deleted';

  notification: NotificationItem;

  timestamp: string;
}
