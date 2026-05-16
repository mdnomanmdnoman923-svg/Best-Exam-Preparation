// src/features/practice/components/PracticeResult.tsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  Crown,
  Flame,
  RefreshCcw,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export interface PracticeResultItem {
  questionId: string;
  answer: string;
  correct: boolean | null;
  skipped: boolean;
  submittedAt: string;
}

export interface PracticeResultSubjectStat {
  subject: string;
  score: number;
  totalQuestions?: number;
  correct?: number;
  incorrect?: number;
}

export interface PracticeResultAchievement {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface PracticeResultProps {
  title?: string;
  subtitle?: string;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  incorrectCount?: number;
  skippedCount?: number;
  scorePercentage: number;
  timeSpent?: string;
  timeLimit?: string;
  pointsEarned?: number;
  streak?: number;
  premium?: boolean;
  passed?: boolean;
  remarks?: string;
  results?: PracticeResultItem[];
  subjectStats?: PracticeResultSubjectStat[];
  achievements?: PracticeResultAchievement[];
  loading?: boolean;
  onRetry?: () => void;
  onReviewAnswers?: () => void;
  onBackToPractice?: () => void;
  onShare?: () => void;
  onNextPractice?: () => void;
  className?: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getPerformanceMeta(scorePercentage: number, passed: boolean) {
  if (!passed) {
    return {
      label: 'Need More Practice',
      className: 'border-red-400/15 bg-red-400/10 text-red-100',
      bar: 'from-red-500 to-orange-500',
      icon: <XCircle className="h-5 w-5" />,
    };
  }

  if (scorePercentage >= 90) {
    return {
      label: 'Excellent',
      className: 'border-yellow-400/15 bg-yellow-400/10 text-yellow-100',
      bar: 'from-yellow-500 to-amber-400',
      icon: <Trophy className="h-5 w-5" />,
    };
  }

  if (scorePercentage >= 75) {
    return {
      label: 'Strong',
      className: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
      bar: 'from-emerald-500 to-cyan-400',
      icon: <Award className="h-5 w-5" />,
    };
  }

  if (scorePercentage >= 60) {
    return {
      label: 'Good Progress',
      className: 'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
      bar: 'from-cyan-500 to-fuchsia-500',
      icon: <Target className="h-5 w-5" />,
    };
  }

  return {
    label: 'Keep Going',
    className: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
    bar: 'from-amber-500 to-orange-500',
    icon: <Award className="h-5 w-5" />,
  };
}

export default function PracticeResult({
  title = 'Practice Result',
  subtitle = 'আপনার practice session summary নিচে দেখানো হলো',
  totalQuestions,
  answeredCount,
  correctCount,
  incorrectCount,
  skippedCount,
  scorePercentage,
  timeSpent,
  timeLimit,
  pointsEarned = 0,
  streak = 0,
  premium = false,
  passed = true,
  remarks,
  results = [],
  subjectStats = [],
  achievements = [],
  loading = false,
  onRetry,
  onReviewAnswers,
  onBackToPractice,
  onShare,
  onNextPractice,
  className = '',
}: PracticeResultProps) {
  const safeScore = clamp(scorePercentage, 0, 100);
  const safeIncorrect =
    typeof incorrectCount === 'number'
      ? incorrectCount
      : Math.max(0, totalQuestions - correctCount - (skippedCount ?? 0));
  const safeSkipped =
    typeof skippedCount === 'number'
      ? skippedCount
      : Math.max(0, totalQuestions - answeredCount);

  const meta = getPerformanceMeta(safeScore, passed);

  const accuracy = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return Math.round((correctCount / totalQuestions) * 100);
  }, [correctCount, totalQuestions]);

  const topResults = useMemo(() => results.slice(0, 6), [results]);

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
              BEP Practice Summary
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
              {passed ? 'Passed' : 'Needs Improvement'}
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
            <div className="flex items-center gap-2 text-cyan-100">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Score
              </span>
            </div>

            <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
              {safeScore}%
            </h3>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-white/40">
                  Progress
                </span>
                <span className="font-bold text-cyan-100">{safeScore}%</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${safeScore}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`h-full rounded-full bg-gradient-to-r ${meta.bar}`}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-emerald-100">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Correct
              </span>
            </div>

            <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
              {correctCount}
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Answered correctly
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-red-100">
              <XCircle className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Incorrect
              </span>
            </div>

            <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
              {safeIncorrect}
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Need revision
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-amber-100">
              <Clock3 className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Skipped
              </span>
            </div>

            <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
              {safeSkipped}
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Not attempted
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-2 text-cyan-100">
                <BookOpen className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Answered
                </span>
              </div>
              <h4 className="mt-3 text-2xl font-bold text-white">
                {answeredCount}
              </h4>
              <p className="mt-1 text-xs text-white/45">Questions attempted</p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-2 text-emerald-100">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Accuracy
                </span>
              </div>
              <h4 className="mt-3 text-2xl font-bold text-white">
                {accuracy}%
              </h4>
              <p className="mt-1 text-xs text-white/45">Correct ratio</p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-2 text-fuchsia-100">
                <Trophy className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Status
                </span>
              </div>
              <h4 className="mt-3 text-2xl font-bold text-white">
                {meta.label}
              </h4>
              <p className="mt-1 text-xs text-white/45">Performance state</p>
            </div>
          </div>

          {subjectStats.length > 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-5 flex items-center gap-2 text-cyan-100">
                <Target className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Subject-wise performance
                </span>
              </div>

              <div className="space-y-4">
                {subjectStats.map((item) => {
                  const value = clamp(item.score, 0, 100);

                  return (
                    <div
                      key={item.subject}
                      className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4"
                    >
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
                          {value}%
                        </span>
                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
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
                <Award className="h-4 w-4" />
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
                <span className="text-sm font-semibold">Remarks</span>
              </div>
              <p className="text-sm leading-7 text-white/75">{remarks}</p>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex items-center gap-2 text-fuchsia-100">
              <Award className="h-4 w-4" />
              <span className="text-sm font-semibold">Summary</span>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Time spent</span>
                  <span className="text-sm font-semibold text-white">
                    {timeSpent || '--'}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Time limit</span>
                  <span className="text-sm font-semibold text-white">
                    {timeLimit || '--'}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Points earned</span>
                  <span className="text-sm font-semibold text-white">
                    {pointsEarned > 0 ? `+${pointsEarned}` : '--'}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Final verdict</span>
                  <span className="text-sm font-semibold text-white">
                    {passed ? 'Great job' : 'Needs revision'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex items-center gap-2 text-orange-100">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-semibold">Next steps</span>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={onReviewAnswers}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Review answers
              </Button>

              <Button variant="secondary" onClick={onNextPractice}>
                Try next practice
              </Button>

              <Button variant="ghost" onClick={onBackToPractice}>
                Back to practice
              </Button>

              {onRetry ? (
                <Button
                  variant="secondary"
                  leftIcon={<RefreshCcw className="h-4 w-4" />}
                  onClick={onRetry}
                >
                  Retry
                </Button>
              ) : null}

              {onShare ? (
                <Button variant="ghost" onClick={onShare}>
                  Share result
                </Button>
              ) : null}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/20 p-4 text-sm text-white/50">
            Practice session completed. Review your mistakes and repeat weak chapters for stronger mastery.
          </div>
        </div>
      </div>

      {topResults.length > 0 ? (
        <div className="border-t border-white/10 p-6">
          <div className="mb-4 flex items-center gap-2 text-emerald-100">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-semibold">Answer snapshot</span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {topResults.map((item) => (
              <div
                key={item.questionId}
                className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-white">
                    {item.questionId}
                  </span>
                  <span
                    className={[
                      'rounded-full border px-2.5 py-1 text-[11px] font-semibold',
                      item.skipped
                        ? 'border-white/10 bg-white/[0.04] text-white/55'
                        : item.correct
                          ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                          : 'border-red-400/20 bg-red-400/10 text-red-100',
                    ].join(' ')}
                  >
                    {item.skipped ? 'Skipped' : item.correct ? 'Correct' : 'Wrong'}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-white/50">
                  {item.answer || 'No answer'}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="border-t border-white/10 p-5">
          <div className="h-16 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
        </div>
      ) : null}
    </motion.div>
  );
}
