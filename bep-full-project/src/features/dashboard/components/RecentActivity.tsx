// bep-full-project/src/features/dashboard/components/RecentActivity.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Flame,
  MessageSquareText,
  Sparkles,
  Trophy,
} from 'lucide-react';

import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export type ActivityType =
  | 'practice'
  | 'exam'
  | 'ai-chat'
  | 'community'
  | 'achievement'
  | 'lesson';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  score?: number;
  chapter?: string;
  points?: number;
  streak?: number;
  premium?: boolean;
  completed?: boolean;
}

export interface RecentActivityProps {
  activities?: ActivityItem[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
  onViewAll?: () => void;
  onActivityClick?: (activityId: string) => void;
  className?: string;
}

const defaultActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'practice',
    title: 'Physics MCQ Practice Completed',
    description: 'Electrostatics chapter practice শেষ করেছেন',
    timestamp: '2 min ago',
    score: 92,
    chapter: 'Electrostatics',
    completed: true,
  },

  {
    id: '2',
    type: 'ai-chat',
    title: 'AI Tutor Session',
    description: 'বাংলায় Math explanation নিয়েছেন',
    timestamp: '18 min ago',
    premium: true,
  },

  {
    id: '3',
    type: 'exam',
    title: 'Mock Exam Attempted',
    description: 'SSC Biology Full Mock Test',
    timestamp: '1 hour ago',
    score: 81,
    points: 240,
  },

  {
    id: '4',
    type: 'community',
    title: 'Community Discussion',
    description: 'Admission preparation thread এ reply দিয়েছেন',
    timestamp: '3 hours ago',
  },

  {
    id: '5',
    type: 'achievement',
    title: '7 Day Streak Achieved',
    description: 'Continuous learning streak active',
    timestamp: 'Today',
    streak: 7,
  },
];

function getActivityMeta(type: ActivityType) {
  switch (type) {
    case 'practice':
      return {
        icon: <FileQuestion className="h-5 w-5" />,
        badge: 'Practice',
        className:
          'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
      };

    case 'exam':
      return {
        icon: <BookOpen className="h-5 w-5" />,
        badge: 'Exam',
        className:
          'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100',
      };

    case 'ai-chat':
      return {
        icon: <Brain className="h-5 w-5" />,
        badge: 'AI Tutor',
        className:
          'border-violet-400/15 bg-violet-400/10 text-violet-100',
      };

    case 'community':
      return {
        icon: <MessageSquareText className="h-5 w-5" />,
        badge: 'Community',
        className:
          'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
      };

    case 'achievement':
      return {
        icon: <Trophy className="h-5 w-5" />,
        badge: 'Achievement',
        className:
          'border-amber-400/15 bg-amber-400/10 text-amber-100',
      };

    default:
      return {
        icon: <Clock3 className="h-5 w-5" />,
        badge: 'Activity',
        className:
          'border-white/10 bg-white/[0.06] text-white',
      };
  }
}

export default function RecentActivity({
  activities = defaultActivities,
  loading = false,
  title = 'Recent Activity',
  subtitle = 'আপনার recent learning journey এখানে দেখুন',
  onViewAll,
  onActivityClick,
  className = '',
}: RecentActivityProps) {
  return (
    <section className={className}>
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_18px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl">
        <div className="relative overflow-hidden border-b border-white/10 p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                <Sparkles className="h-3.5 w-3.5" />
                Learning Timeline
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white">
                {title}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/15 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-100">
                <Flame className="h-4 w-4" />
                Active Learning
              </div>

              <Button
                variant="secondary"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={onViewAll}
              >
                View All
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]"
                />
              ))}
            </div>
          ) : activities.length > 0 ? (
            <div className="relative">
              <div className="absolute bottom-0 left-[26px] top-0 hidden w-px bg-gradient-to-b from-cyan-400/20 via-fuchsia-400/20 to-transparent sm:block" />

              <div className="space-y-5">
                {activities.map((activity, index) => {
                  const meta = getActivityMeta(activity.type);

                  return (
                    <motion.button
                      key={activity.id}
                      type="button"
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.25,
                        delay: index * 0.04,
                      }}
                      whileHover={{
                        y: -2,
                      }}
                      onClick={() =>
                        onActivityClick?.(
                          activity.id,
                        )
                      }
                      className={[
                        'group relative flex w-full gap-4 rounded-[28px] border border-white/10',
                        'bg-[#08111F]/70 p-5 text-left backdrop-blur-xl',
                        'transition-all duration-300 hover:border-cyan-400/20',
                        'hover:bg-white/[0.05] hover:shadow-[0_16px_50px_rgba(0,0,0,0.24)]',
                      ].join(' ')}
                    >
                      <div className="relative z-10 hidden sm:flex">
                        <div
                          className={[
                            'relative flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl border',
                            meta.className,
                          ].join(' ')}
                        >
                          {meta.icon}

                          <div className="absolute inset-0 rounded-3xl bg-white/5 opacity-0 transition duration-300 group-hover:opacity-100" />
                        </div>
                      </div>

                      <div className="relative z-10 min-w-0 flex-1">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                              <div
                                className={[
                                  'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold',
                                  meta.className,
                                ].join(' ')}
                              >
                                {meta.badge}
                              </div>

                              {activity.premium ? (
                                <Badge variant="premium">
                                  Premium
                                </Badge>
                              ) : null}

                              {activity.completed ? (
                                <div className="inline-flex items-center gap-1 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold text-emerald-100">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Completed
                                </div>
                              ) : null}
                            </div>

                            <h3 className="text-xl font-bold tracking-tight text-white transition group-hover:text-cyan-100">
                              {activity.title}
                            </h3>

                            <p className="mt-2 text-sm leading-7 text-white/60">
                              {activity.description}
                            </p>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                              {typeof activity.score ===
                              'number' ? (
                                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-100">
                                  Score {activity.score}%
                                </div>
                              ) : null}

                              {activity.chapter ? (
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-white/65">
                                  {activity.chapter}
                                </div>
                              ) : null}

                              {typeof activity.points ===
                              'number' ? (
                                <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1.5 text-xs font-semibold text-fuchsia-100">
                                  +{activity.points} pts
                                </div>
                              ) : null}

                              {typeof activity.streak ===
                              'number' ? (
                                <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/15 bg-orange-400/10 px-3 py-1.5 text-xs font-semibold text-orange-100">
                                  <Flame className="h-3.5 w-3.5" />
                                  {activity.streak} Day Streak
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <div className="shrink-0">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/55">
                              <Clock3 className="h-4 w-4" />
                              {activity.timestamp}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.04] px-6 py-20 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.05] text-cyan-100">
                <Clock3 className="h-10 w-10" />
              </div>

              <h3 className="mt-6 text-3xl font-bold tracking-tight text-white">
                No recent activity
              </h3>

              <p className="mt-3 max-w-lg text-sm leading-7 text-white/60">
                Practice শুরু করলে আপনার learning activity এখানে দেখাবে।
              </p>

              <div className="mt-6">
                <Button>
                  Start Learning
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
