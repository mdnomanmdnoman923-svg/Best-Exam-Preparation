// bep-full-project/src/features/exam/components/ExamResult.tsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Crown,
  Flame,
  Gift,
  Medal,
  RefreshCcw,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export interface ExamResultBreakdown {
  correct: number;
  incorrect: number;
  skipped: number;
  total: number;
}

export interface ExamResultSubjectStat {
  subject: string;
  score: number;
  totalQuestions?: number;
  correct?: number;
  incorrect?: number;
}

export interface ExamResultAchievement {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface ExamResultProps {
  title?: string;
  subtitle?: string;
  score: number;
  totalMarks?: number;
  obtainedMarks?: number;
  percentage?: number;
  rank?: number;
  timeTaken?: string;
  timeSpent?: string;
  breakdown?: ExamResultBreakdown;
  subjectStats?: ExamResultSubjectStat[];
  achievements?: ExamResultAchievement[];
  remarks?: string;
  passed?: boolean;
  premium?: boolean;
  streak?: number;
  pointsEarned?: number;
  leaderboardPosition?: number;
  loading?: boolean;
  onRetry?: () => void;
  onReviewAnswers?: () => void;
  onBackToDashboard?: () => void;
  onShare?: () => void;
  onNextExam?: () => void;
  className?: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getPerformanceMeta(percentage: number, passed: boolean) {
  if (!passed) {
    return {
      label: 'Need Improvement',
      className: 'border-red-400/15 bg-red-400/10 text-red-100',
      icon: <XCircle className="h-5 w-5" />,
      gradient: 'from-red-500/20 to-red-400/10',
    };
  }

  if (percentage >= 90) {
    return {
      label: 'Outstanding',
      className: 'border-yellow-400/15 bg-yellow-400/10 text-yellow-100',
      icon: <Trophy className="h-5 w-5" />,
      gradient: 'from-yellow-500/20 to-amber-400/10',
    };
  }

  if (percentage >= 75) {
    return {
      label: 'Excellent',
      className: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
      icon: <Medal className="h-5 w-5" />,
      gradient: 'from-emerald-500/20 to-cyan-400/10',
    };
  }

  if (percentage >= 60) {
    return {
      label: 'Good Progress',
      className: 'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
      icon: <Award className="h-5 w-5" />,
      gradient: 'from-cyan-500/20 to-fuchsia-400/10',
    };
  }

  return {
    label: 'Keep Going',
    className: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
    icon: <Target className="h-5 w-5" />,
    gradient: 'from-amber-500/20 to-orange-400/10',
  };
}

export default function ExamResult({
  title = 'Exam Result',
  subtitle = 'আপনার performance summary নিচে দেখানো হলো',
  score,
  totalMarks = 100,
  obtainedMarks,
  percentage,
  rank,
  timeTaken,
  timeSpent,
  breakdown,
  subjectStats = [],
  achievements = [],
  remarks,
  passed = true,
  premium = false,
  streak = 0,
  pointsEarned = 0,
  leaderboardPosition,
  loading = false,
  onRetry,
  onReviewAnswers,
  onBackToDashboard,
  onShare,
  onNextExam,
  className = '',
}: ExamResultProps) {
  const safePercentage = clamp(
    percentage ?? score,
    0,
    100,
  );

  const safeObtainedMarks =
    obtainedMarks ?? Math.round((safePercentage / 100) * totalMarks);

  const meta = getPerformanceMeta(
    safePercentage,
    passed,
  );

  const totalAnswered = useMemo(() => {
    if (!breakdown) return 0;
    return breakdown.correct + breakdown.incorrect + breakdown.skipped;
  }, [breakdown]);

  const accuracy = useMemo(() => {
    if (!breakdown || breakdown.total === 0) return 0;
    return Math.round((breakdown.correct / breakdown.total) * 100);
  }, [breakdown]);

  const passLabel = passed ? 'Passed' : 'Failed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={[
        'overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04]',
        'shadow-[0_20px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl',
        className,
      ].join(' ')}
    >
      <div className="relative overflow-hidden border-b border-white/10 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

        <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
              <Sparkles className="h-3.5 w-3.5" />
              BEP Exam Summary
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white">
              {title}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={passed ? 'success' : 'danger'}>
              {passLabel}
            </Badge>

            {premium ? (
              <Badge variant="premium">
                <Crown className="mr-1 h-3.5 w-3.5" />
                Premium
              </Badge>
            ) : null}

            {streak > 0 ? (
              <div className="inline-flex items-center gap-1 rounded-full border border-orange-400/15 bg-orange-400/10 px-3 py-1 text-[11px] font-semibold text-orange-100">
                <Flame className="h-3.5 w-3.5" />
                {streak} Day Streak
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/55">
                  Score
                </p>
                <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                  {safePercentage}%
                </h3>
              </div>

              <div
                className={[
                  'flex h-14 w-14 items-center justify-center rounded-3xl border',
                  meta.className,
                ].join(' ')}
              >
                {meta.icon}
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-white/40">
                  Progress
                </span>
                <span className="font-bold text-cyan-100">
                  {safePercentage}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${safePercentage}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={[
                    'h-full rounded-full bg-gradient-to-r',
                    meta.gradient,
                  ].join(' ')}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-cyan-100">
              <Target className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Marks
              </span>
            </div>

            <h3 className="mt-3 text-3xl font-bold text-white">
              {safeObtainedMarks}/{totalMarks}
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Obtained vs total marks
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-emerald-100">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Accuracy
              </span>
            </div>

            <h3 className="mt-3 text-3xl font-bold text-white">
              {breakdown ? `${accuracy}%` : `${safePercentage}%`}
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Correct answer ratio
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-fuchsia-100">
              <TrendingUp className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Rank
              </span>
            </div>

            <h3 className="mt-3 text-3xl font-bold text-white">
              #{rank ?? leaderboardPosition ?? '--'}
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Leaderboard position
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-2 text-emerald-100">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Correct
                </span>
              </div>
              <h4 className="mt-3 text-2xl font-bold text-white">
                {breakdown?.correct ?? 0}
              </h4>
              <p className="mt-1 text-xs text-white/45">
                Right answers
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-2 text-red-100">
                <XCircle className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Incorrect
                </span>
              </div>
              <h4 className="mt-3 text-2xl font-bold text-white">
                {breakdown?.incorrect ?? 0}
              </h4>
              <p className="mt-1 text-xs text-white/45">
                Wrong answers
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-2 text-amber-100">
                <Clock3 className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Skipped
                </span>
              </div>
              <h4 className="mt-3 text-2xl font-bold text-white">
                {breakdown?.skipped ?? 0}
              </h4>
              <p className="mt-1 text-xs text-white/45">
                Unanswered
              </p>
            </div>
          </div>

          {subjectStats.length > 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-5 flex items-center gap-2 text-cyan-100">
                <BrainCircuit className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Subject-wise performance
                </span>
              </div>

              <div className="space-y-4">
                {subjectStats.map((item) => {
                  const safe = clamp(item.score, 0, 100);

                  return (
                    <div key={item.subject} className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-semibold text-white">
                            {item.subject}
                          </h4>
                          <p className="mt-1 text-xs text-white/45">
                            {item.correct ?? 0} correct / {item.incorrect ?? 0} incorrect
                          </p>
                        </div>

                        <span className="text-sm font-bold text-cyan-100">
                          {safe}%
                        </span>
                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${safe}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {achievements.length > 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-5 flex items-center gap-2 text-yellow-100">
                <Gift className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Achievements unlocked
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-yellow-400/15 bg-yellow-400/10 text-yellow-100">
                        {achievement.icon ?? <Award className="h-5 w-5" />}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white">
                          {achievement.title}
                        </h4>
                        {achievement.description ? (
                          <p className="mt-1 text-xs leading-5 text-white/50">
                            {achievement.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {remarks ? (
            <div className="rounded-[28px] border border-cyan-400/15 bg-cyan-400/10 p-5">
              <div className="mb-2 flex items-center gap-2 text-cyan-100">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Remarks
                </span>
              </div>

              <p className="text-sm leading-7 text-white/75">
                {remarks}
              </p>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex items-center gap-2 text-fuchsia-100">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Result overview
              </span>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">
                    Time spent
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {timeSpent || timeTaken || '--'}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">
                    Questions answered
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {totalAnswered ||
                      breakdown?.total ||
                      '--'}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">
                    Points earned
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {pointsEarned > 0
                      ? `+${pointsEarned}`
                      : '--'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex items-center gap-2 text-cyan-100">
              <Award className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Performance insights
              </span>
            </div>

            <div className="space-y-3 text-sm leading-7 text-white/65">
              <p>
                {passed
                  ? 'You passed this exam. Keep up the momentum and review your weak topics for even better results.'
                  : 'You did not pass this attempt. Review the incorrect answers carefully and try another mock exam soon.'}
              </p>

              <p>
                Accuracy: <span className="font-semibold text-white">{breakdown ? `${accuracy}%` : `${safePercentage}%`}</span>.
              </p>

              {premium ? (
                <p className="inline-flex items-center gap-2 rounded-2xl border border-amber-400/15 bg-amber-400/10 px-3 py-2 text-amber-100">
                  <Crown className="h-4 w-4" />
                  Premium analysis and extra practice suggestions available.
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex items-center gap-2 text-orange-100">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Next steps
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={onReviewAnswers}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Review answers
              </Button>

              <Button
                variant="secondary"
                onClick={onNextExam}
              >
                Try next exam
              </Button>

              <Button
                variant="ghost"
                onClick={onBackToDashboard}
              >
                Back to dashboard
              </Button>

              {onRetry ? (
                <Button
                  variant="secondary"
                  leftIcon={<RefreshCcw className="h-4 w-4" />}
                  onClick={onRetry}
                >
                  Retry exam
                </Button>
              ) : null}

              {onShare ? (
                <Button
                  variant="ghost"
                  onClick={onShare}
                >
                  Share result
                </Button>
              ) : null}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/20 p-4 text-sm text-white/50">
            Result generated successfully. Keep practicing to improve your score and rank.
          </div>
        </div>
      </div>

      {loading ? (
        <div className="border-t border-white/10 p-5">
          <div className="h-16 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
        </div>
      ) : null}
    </motion.div>
  );
}
