// bep-full-project/src/features/notifications/components/NotificationList.tsx

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Bell,
  BookOpen,
  Check,
  CheckCheck,
  Clock3,
  Crown,
  Filter,
  Flame,
  Info,
  MessageCircle,
  Search,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';

import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'achievement'
  | 'exam'
  | 'community'
  | 'premium';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  read?: boolean;
  actionLabel?: string;
  href?: string;
  premium?: boolean;
  icon?: React.ReactNode;
}

export interface NotificationListProps {
  notifications: NotificationItem[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
  onRead?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
  onMarkAllRead?: () => void;
  onAction?: (notification: NotificationItem) => void;
  className?: string;
}

const typeStyles: Record<
  NotificationType,
  {
    icon: React.ReactNode;
    container: string;
    badge: string;
    label: string;
  }
> = {
  info: {
    icon: <Info className="h-4 w-4" />,
    container:
      'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
    badge:
      'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
    label: 'Info',
  },

  success: {
    icon: <CheckCheck className="h-4 w-4" />,
    container:
      'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
    badge:
      'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
    label: 'Success',
  },

  warning: {
    icon: <AlertCircle className="h-4 w-4" />,
    container:
      'border-amber-400/15 bg-amber-400/10 text-amber-100',
    badge:
      'border-amber-400/15 bg-amber-400/10 text-amber-100',
    label: 'Warning',
  },

  error: {
    icon: <X className="h-4 w-4" />,
    container:
      'border-red-400/15 bg-red-400/10 text-red-100',
    badge:
      'border-red-400/15 bg-red-400/10 text-red-100',
    label: 'Error',
  },

  achievement: {
    icon: <Trophy className="h-4 w-4" />,
    container:
      'border-yellow-400/15 bg-yellow-400/10 text-yellow-100',
    badge:
      'border-yellow-400/15 bg-yellow-400/10 text-yellow-100',
    label: 'Achievement',
  },

  exam: {
    icon: <BookOpen className="h-4 w-4" />,
    container:
      'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100',
    badge:
      'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100',
    label: 'Exam',
  },

  community: {
    icon: <MessageCircle className="h-4 w-4" />,
    container:
      'border-indigo-400/15 bg-indigo-400/10 text-indigo-100',
    badge:
      'border-indigo-400/15 bg-indigo-400/10 text-indigo-100',
    label: 'Community',
  },

  premium: {
    icon: <Crown className="h-4 w-4" />,
    container:
      'border-orange-400/15 bg-orange-400/10 text-orange-100',
    badge:
      'border-orange-400/15 bg-orange-400/10 text-orange-100',
    label: 'Premium',
  },
};

function formatRelativeTime(dateString: string) {
  const now = new Date().getTime();
  const target = new Date(dateString).getTime();

  const diff = Math.max(
    0,
    now - target,
  );

  const minutes = Math.floor(
    diff / (1000 * 60),
  );

  const hours = Math.floor(
    minutes / 60,
  );

  const days = Math.floor(
    hours / 24,
  );

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  if (hours < 24) {
    return `${hours} hour ago`;
  }

  return `${days} day ago`;
}

export default function NotificationList({
  notifications,
  loading = false,
  title = 'Notifications',
  subtitle = 'Latest BEP activity and alerts',
  onRead,
  onDelete,
  onMarkAllRead,
  onAction,
  className = '',
}: NotificationListProps) {
  const [search, setSearch] =
    useState('');

  const [filter, setFilter] =
    useState<
      NotificationType | 'all'
    >('all');

  const unreadCount =
    notifications.filter(
      (item) => !item.read,
    ).length;

  const filteredNotifications =
    useMemo(() => {
      const query =
        search.toLowerCase();

      return notifications.filter(
        (item) => {
          const matchesSearch =
            !query ||
            `${item.title} ${item.message}`
              .toLowerCase()
              .includes(query);

          const matchesFilter =
            filter === 'all'
              ? true
              : item.type === filter;

          return (
            matchesSearch &&
            matchesFilter
          );
        },
      );
    }, [
      filter,
      notifications,
      search,
    ]);

  return (
    <section className={className}>
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_20px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl">
        <div className="relative overflow-hidden border-b border-white/10 p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

          <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                <Sparkles className="h-3.5 w-3.5" />
                BEP Notification Center
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white">
                {title}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="premium">
                {notifications.length}{' '}
                Total
              </Badge>

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                <Bell className="h-4 w-4" />
                {unreadCount} Unread
              </div>

              {unreadCount > 0 ? (
                <Button
                  variant="secondary"
                  leftIcon={
                    <CheckCheck className="h-4 w-4" />
                  }
                  onClick={
                    onMarkAllRead
                  }
                >
                  Mark All Read
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="w-full xl:max-w-lg">
              <Input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value,
                  )
                }
                placeholder="Search notifications..."
                leftIcon={
                  <Search className="h-4 w-4" />
                }
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
                <Filter className="h-4 w-4 text-white/45" />

                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(
                      e.target
                        .value as NotificationType,
                    )
                  }
                  className="bg-transparent text-sm text-white outline-none"
                >
                  <option value="all">
                    All Types
                  </option>

                  {Object.keys(
                    typeStyles,
                  ).map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <Badge variant="success">
                Live Updates
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-h-[720px] overflow-y-auto p-5">
          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-32 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04]"
                  />
                ),
              )}
            </div>
          ) : filteredNotifications.length >
            0 ? (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredNotifications.map(
                  (
                    notification,
                    index,
                  ) => {
                    const style =
                      typeStyles[
                        notification
                          .type
                      ];

                    return (
                      <motion.div
                        key={
                          notification.id
                        }
                        initial={{
                          opacity: 0,
                          y: 12,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.98,
                        }}
                        transition={{
                          duration: 0.22,
                          delay:
                            index *
                            0.03,
                        }}
                        className={[
                          'group relative overflow-hidden rounded-[28px] border backdrop-blur-xl transition-all duration-300',
                          notification.read
                            ? 'border-white/10 bg-white/[0.03]'
                            : 'border-cyan-400/15 bg-cyan-400/10 shadow-[0_10px_35px_rgba(6,182,212,0.10)]',
                        ].join(
                          ' ',
                        )}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                        <div className="relative z-10 flex flex-col gap-5 p-5 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex min-w-0 flex-1 gap-4">
                            <div
                              className={[
                                'flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl border',
                                style.container,
                              ].join(
                                ' ',
                              )}
                            >
                              {notification.icon ||
                                style.icon}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-semibold text-white">
                                  {
                                    notification.title
                                  }
                                </h3>

                                <div
                                  className={[
                                    'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold',
                                    style.badge,
                                  ].join(
                                    ' ',
                                  )}
                                >
                                  {
                                    style.label
                                  }
                                </div>

                                {notification.premium ? (
                                  <Badge variant="premium">
                                    Premium
                                  </Badge>
                                ) : null}

                                {!notification.read ? (
                                  <div className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                                ) : null}
                              </div>

                              <p className="mt-3 text-sm leading-7 text-white/70">
                                {
                                  notification.message
                                }
                              </p>

                              <div className="mt-4 flex flex-wrap items-center gap-3">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/50">
                                  <Clock3 className="h-3.5 w-3.5" />
                                  {formatRelativeTime(
                                    notification.createdAt,
                                  )}
                                </div>

                                {!notification.read ? (
                                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-100">
                                    <Flame className="h-3.5 w-3.5" />
                                    New
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            {!notification.read ? (
                              <Button
                                variant="secondary"
                                leftIcon={
                                  <Check className="h-4 w-4" />
                                }
                                onClick={() =>
                                  onRead?.(
                                    notification.id,
                                  )
                                }
                              >
                                Read
                              </Button>
                            ) : null}

                            {notification.actionLabel ? (
                              <Button
                                onClick={() =>
                                  onAction?.(
                                    notification,
                                  )
                                }
                              >
                                {
                                  notification.actionLabel
                                }
                              </Button>
                            ) : null}

                            <button
                              type="button"
                              onClick={() =>
                                onDelete?.(
                                  notification.id,
                                )
                              }
                              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/50 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-100"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  },
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[32px] border border-white/10 bg-white/[0.04]">
                <Bell className="h-10 w-10 text-white/30" />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                No notifications found
              </h3>

              <p className="mt-3 max-w-md text-sm leading-7 text-white/55">
                আপনার filter অথবা search অনুযায়ী কোনো notification পাওয়া যায়নি।
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm leading-7 text-white/55">
              Notifications include exam alerts, leaderboard achievements, AI updates, and community activity.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="premium">
                Real-time Sync
              </Badge>

              <Badge variant="success">
                Firebase Ready
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
