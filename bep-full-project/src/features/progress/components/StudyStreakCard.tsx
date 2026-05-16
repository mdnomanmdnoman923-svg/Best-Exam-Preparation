// bep-full-project/src/features/progress/components/StudyStreakCard.tsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  CalendarDays,
  Flame,
  Sparkles,
  Star,
  Trophy,
  TrendingUp,
  Zap,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export interface StudyStreakMilestone {
  id: string;
  days: number;
  title: string;
  description?: string;
  reward?: string;
  unlocked?: boolean;
}

export interface StudyStreakCardProps {
  title?: string;
  subtitle?: string;
  streakDays?: number;
  longestStreakDays?: number;
  weeklyGoalDays?: number;
  currentWeekDays?: number;
  totalStudyDays?: number;
  studyMinutesToday?: number;
  consistencyScore?: number;
  premium?: boolean;
  loading?: boolean;
  milestones?: StudyStreakMilestone[];
  nextMilestoneDays?: number;
  nextMilestoneLabel?: string;
  onViewHistory?: () => void;
  onContinue?: () => void;
  onShare?: () => void;
  className?: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours}h`;
  return `${hours}h ${remaining}m`;
}

function getStreakLabel(days: number) {
  if (days >= 30) return 'Legendary';
  if (days >= 14) return 'Excellent';
  if (days >= 7) return 'Strong';
  if (days >= 3) return 'Building';
  if (days >= 1) return 'Started';
  return 'Not started';
}

export default function StudyStreakCard({
  title = 'Study Streak',
  subtitle = 'আপনার daily learning consistency track করুন',
  streakDays = 0,
  longestStreakDays = 0,
  weeklyGoalDays = 7,
  currentWeekDays = 0,
  totalStudyDays = 0,
  studyMinutesToday = 0,
  consistencyScore = 0,
  premium = false,
  loading = false,
  milestones = [
    {
      id: '3-days',
      days: 3,
      title: 'Starter',
      description: '৩ দিন ধারাবাহিক study',
      reward: 'Small boost',
      unlocked: false,
    },
    {
      id: '7-days',
      days: 7,
      title: 'Consistent',
      description: '১ সপ্তাহের streak',
      reward: 'Momentum badge',
      unlocked: false,
    },
    {
      id: '14-days',
      days: 14,
      title: 'Focused',
      description: '২ সপ্তাহের ধারাবাহিকতা',
      reward: 'Focus badge',
      unlocked: false,
    },
    {
      id: '30-days',
      days: 30,
      title: 'Master',
      description: '৩০ দিনের achievement',
      reward: 'Elite badge',
      unlocked: false,
    },
  ],
  nextMilestoneDays,
  nextMilestoneLabel,
  onViewHistory,
  onContinue,
  onShare,
  className = '',
}: StudyStreakCardProps) {
  const safeStreak = Math.max(0, streakDays);
  const safeLongest = Math.max(0, longestStreakDays);
  const safeGoal = Math.max(1, weeklyGoalDays);
  const safeCurrentWeek = clamp(currentWeekDays, 0, safeGoal);
  const safeConsistency = clamp(consistencyScore, 0, 100);

  const progress = useMemo(() => {
    return Math.round((safeCurrentWeek / safeGoal) * 100);
  }, [safeCurrentWeek, safeGoal]);

  const streakLabel = getStreakLabel(safeStreak);

  const upcomingMilestone = useMemo(() => {
    if (typeof nextMilestoneDays === 'number') {
      return {
        days: nextMilestoneDays,
        label: nextMilestoneLabel || `${nextMilestoneDays} day milestone`,
      };
    }

    const next = [...milestones]
      .filter((milestone) => !milestone.unlocked && milestone.days > safeStreak)
      .sort((a, b) => a.days - b.days)[0];

    if (!next) return null;

    return {
      days: next.days,
      label: nextMilestoneLabel || next.title,
    };
  }, [milestones, nextMilestoneDays, nextMilestoneLabel, safeStreak]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={[
        'overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04]',
        'shadow-[0_18px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl',
        className,
      ].join(' ')}
    >
      <div className="relative overflow-hidden border-b border-white/10 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
              <Sparkles className="h-3.5 w-3.5" />
              BEP Progress Center
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
              <Flame className="mr-1 h-3.5 w-3.5" />
              {safeStreak} Days
            </Badge>

            <Badge variant={safeStreak > 0 ? 'success' : 'secondary'}>
              {streakLabel}
            </Badge>

            {premium ? (
              <Badge variant="premium">
                <Star className="mr-1 h-3.5 w-3.5" />
                Premium Insights
              </Badge>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-orange-100">
                <Flame className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Current streak
                </span>
              </div>

              <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                {safeStreak}
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/55">
                ধারাবাহিক active study days
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-cyan-100">
                <Trophy className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Longest streak
                </span>
              </div>

              <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                {safeLongest}
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/55">
                আপনার best consistency record
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-emerald-100">
                <CalendarDays className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Weekly goal
                </span>
              </div>

              <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                {safeCurrentWeek}/{safeGoal}
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/55">
                এই সপ্তাহে completed days
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-fuchsia-100">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Consistency
                </span>
              </div>

              <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                {safeConsistency}%
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/55">
                ধারাবাহিকতার health score
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-white/45">
                Weekly goal progress
              </span>
              <span className="font-bold text-cyan-100">{progress}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
              />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                <div className="flex items-center gap-2 text-cyan-100">
                  <Award className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Today
                  </span>
                </div>
                <h4 className="mt-2 text-2xl font-bold text-white">
                  {formatMinutes(studyMinutesToday)}
                </h4>
                <p className="mt-1 text-xs text-white/45">Study time today</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                <div className="flex items-center gap-2 text-emerald-100">
                  <Zap className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Total days
                  </span>
                </div>
                <h4 className="mt-2 text-2xl font-bold text-white">
                  {totalStudyDays}
                </h4>
                <p className="mt-1 text-xs text-white/45">Lifetime activity</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                <div className="flex items-center gap-2 text-orange-100">
                  <Flame className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Level
                  </span>
                </div>
                <h4 className="mt-2 text-2xl font-bold text-white">
                  {streakLabel}
                </h4>
                <p className="mt-1 text-xs text-white/45">Streak strength</p>
              </div>
            </div>
          </div>

          {upcomingMilestone ? (
            <div className="rounded-[28px] border border-cyan-400/15 bg-cyan-400/10 p-5">
              <div className="mb-2 flex items-center gap-2 text-cyan-100">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Next milestone</span>
              </div>

              <p className="text-sm leading-7 text-white/75">
                {upcomingMilestone.days} days এ পৌঁছালে <span className="font-semibold text-white">{upcomingMilestone.label}</span> unlock হবে।
              </p>
            </div>
          ) : (
            <div className="rounded-[28px] border border-emerald-400/15 bg-emerald-400/10 p-5">
              <div className="mb-2 flex items-center gap-2 text-emerald-100">
                <Star className="h-4 w-4" />
                <span className="text-sm font-semibold">All milestones cleared</span>
              </div>

              <p className="text-sm leading-7 text-white/75">
                আপনি সব current milestones clear করে ফেলেছেন। নতুন goal সেট করে streak আরও বাড়ান।
              </p>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-yellow-100">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-semibold">Milestones</span>
            </div>

            <div className="space-y-3">
              {milestones.map((milestone) => {
                const unlocked = milestone.unlocked || safeStreak >= milestone.days;

                return (
                  <div
                    key={milestone.id}
                    className={[
                      'rounded-2xl border p-4',
                      unlocked
                        ? 'border-emerald-400/15 bg-emerald-400/10'
                        : 'border-white/10 bg-white/[0.04]',
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-semibold text-white">
                            {milestone.title}
                          </h4>

                          <Badge variant={unlocked ? 'success' : 'secondary'}>
                            {milestone.days} days
                          </Badge>
                        </div>

                        {milestone.description ? (
                          <p className="mt-1 text-xs leading-5 text-white/55">
                            {milestone.description}
                          </p>
                        ) : null}

                        {milestone.reward ? (
                          <p className="mt-2 text-xs font-medium text-cyan-100">
                            Reward: {milestone.reward}
                          </p>
                        ) : null}
                      </div>

                      <div
                        className={[
                          'flex h-10 w-10 items-center justify-center rounded-2xl border',
                          unlocked
                            ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                            : 'border-white/10 bg-white/[0.04] text-white/50',
                        ].join(' ')}
                      >
                        <Flame className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-cyan-100">
              <CalendarDays className="h-4 w-4" />
              <span className="text-sm font-semibold">Streak tips</span>
            </div>

            <ul className="space-y-3 text-sm leading-7 text-white/65">
              <li>Daily practice নিশ্চিত করতে ছোট session রাখুন।</li>
              <li>একই সময়ে পড়লে habit build হতে সহজ হয়।</li>
              <li>Miss না করার জন্য reminder চালু রাখুন।</li>
              <li>Low-energy দিনে শুধু ৫-১০ মিনিটও streak ধরে রাখতে সাহায্য করে।</li>
            </ul>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex items-center gap-2 text-fuchsia-100">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Quick actions</span>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={onContinue}>
                Continue learning
              </Button>

              <Button variant="secondary" onClick={onViewHistory}>
                View streak history
              </Button>

              {onShare ? (
                <Button variant="ghost" onClick={onShare}>
                  Share streak
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
