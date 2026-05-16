// bep-full-project/src/features/subjects/components/SubjectProgressCard.tsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Crown,
  Flame,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Wand2,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export interface SubjectProgressMilestone {
  id: string;
  title: string;
  value: number;
  description?: string;
  unlocked?: boolean;
  premium?: boolean;
}

export interface SubjectProgressCardProps {
  title?: string;
  subtitle?: string;
  subjectName?: string;
  level?: string;
  completion?: number;
  averageScore?: number;
  totalQuestions?: number;
  completedQuestions?: number;
  totalChapters?: number;
  completedChapters?: number;
  totalPracticeMinutes?: number;
  streakDays?: number;
  premium?: boolean;
  loading?: boolean;
  milestones?: SubjectProgressMilestone[];
  onViewDetails?: () => void;
  onStartPractice?: () => void;
  onContinue?: () => void;
  className?: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours}h`;
  return `${hours}h ${remaining}m`;
}

function formatPercent(value: number) {
  return `${clamp(Math.round(value), 0, 100)}%`;
}

function defaultMilestones(
  subjectName: string,
): SubjectProgressMilestone[] {
  return [
    {
      id: 'start',
      title: 'Getting Started',
      value: 20,
      description: `${subjectName} topic exploration শুরু করুন`,
      unlocked: true,
    },
    {
      id: 'practice',
      title: 'Practice Builder',
      value: 50,
      description: 'Regular practice session complete করুন',
      unlocked: false,
    },
    {
      id: 'mastery',
      title: 'Subject Mastery',
      value: 80,
      description: 'High score consistency অর্জন করুন',
      unlocked: false,
      premium: true,
    },
    {
      id: 'elite',
      title: 'Elite Rank',
      value: 100,
      description: 'Complete mastery and leaderboard impact',
      unlocked: false,
      premium: true,
    },
  ];
}

export default function SubjectProgressCard({
  title = 'Subject Progress',
  subtitle = 'আপনার subject-wise study progress, practice, এবং mastery এক নজরে দেখুন',
  subjectName = 'Subject',
  level,
  completion = 0,
  averageScore = 0,
  totalQuestions = 0,
  completedQuestions = 0,
  totalChapters = 0,
  completedChapters = 0,
  totalPracticeMinutes = 0,
  streakDays = 0,
  premium = false,
  loading = false,
  milestones,
  onViewDetails,
  onStartPractice,
  onContinue,
  className = '',
}: SubjectProgressCardProps) {
  const safeCompletion = clamp(completion, 0, 100);
  const safeAverageScore = clamp(averageScore, 0, 100);
  const safeCompletedQuestions = Math.max(0, completedQuestions);
  const safeTotalQuestions = Math.max(0, totalQuestions);
  const safeCompletedChapters = Math.max(0, completedChapters);
  const safeTotalChapters = Math.max(0, totalChapters);
  const safePracticeMinutes = Math.max(0, totalPracticeMinutes);
  const safeStreak = Math.max(0, streakDays);

  const completionRate = useMemo(() => {
    if (safeTotalQuestions === 0) return safeCompletion;
    return clamp(
      Math.round((safeCompletedQuestions / safeTotalQuestions) * 100),
      0,
      100,
    );
  }, [safeCompletedQuestions, safeCompletion, safeTotalQuestions]);

  const chapterRate = useMemo(() => {
    if (safeTotalChapters === 0) return 0;
    return clamp(
      Math.round((safeCompletedChapters / safeTotalChapters) * 100),
      0,
      100,
    );
  }, [safeCompletedChapters, safeTotalChapters]);

  const subjectMilestones = useMemo(
    () => milestones || defaultMilestones(subjectName),
    [milestones, subjectName],
  );

  const progressLabel = useMemo(() => {
    if (safeCompletion >= 90) return 'Excellent';
    if (safeCompletion >= 75) return 'Strong';
    if (safeCompletion >= 50) return 'Growing';
    if (safeCompletion >= 20) return 'Building';
    return 'Getting Started';
  }, [safeCompletion]);

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
              BEP Subject Progress
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
              <BookOpen className="mr-1 h-3.5 w-3.5" />
              {subjectName}
            </Badge>

            {level ? <Badge variant="secondary">{level}</Badge> : null}

            {premium ? (
              <Badge variant="premium">
                <Crown className="mr-1 h-3.5 w-3.5" />
                Premium
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-cyan-100">
              <Target className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Completion
              </span>
            </div>

            <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
              {formatPercent(safeCompletion)}
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Overall learning progress
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-emerald-100">
              <Trophy className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Average score
              </span>
            </div>

            <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
              {formatPercent(safeAverageScore)}
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Practice and exam performance
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-orange-100">
              <Flame className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Streak
              </span>
            </div>

            <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
              {safeStreak}
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Consecutive active days
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-fuchsia-100">
              <Clock3 className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Practice time
              </span>
            </div>

            <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
              {formatMinutes(safePracticeMinutes)}
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Total study minutes
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              <div className="h-28 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04]" />
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="h-32 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04]"
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-white/45">
                    Subject completion
                  </span>
                  <span className="font-bold text-cyan-100">
                    {completionRate}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                  />
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                    <div className="flex items-center gap-2 text-cyan-100">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        Questions
                      </span>
                    </div>
                    <h4 className="mt-2 text-2xl font-bold text-white">
                      {safeCompletedQuestions}/{safeTotalQuestions || 0}
                    </h4>
                    <p className="mt-1 text-xs text-white/45">
                      Completed vs total
                    </p>
                  </div>

                  <div className
