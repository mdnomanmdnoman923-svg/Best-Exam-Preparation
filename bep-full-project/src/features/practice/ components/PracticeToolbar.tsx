// src/features/practice/components/PracticeToolbar.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Filter,
  Flame,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  TimerReset,
  Trophy,
  Wand2,
} from 'lucide-react';

import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';

export type PracticeToolbarDifficulty = 'all' | 'easy' | 'medium' | 'hard';

export interface PracticeToolbarProps {
  title?: string;
  subtitle?: string;
  search?: string;
  difficulty?: PracticeToolbarDifficulty;
  showOnlyBookmarked?: boolean;
  showOnlyFlagged?: boolean;
  premiumOnly?: boolean;
  totalQuestions?: number;
  answeredCount?: number;
  correctCount?: number;
  timeSpent?: string;
  remainingTime?: string;
  streak?: number;
  loading?: boolean;
  onSearchChange?: (value: string) => void;
  onDifficultyChange?: (value: PracticeToolbarDifficulty) => void;
  onToggleBookmarked?: (value: boolean) => void;
  onToggleFlagged?: (value: boolean) => void;
  onTogglePremiumOnly?: (value: boolean) => void;
  onReset?: () => void;
  onShuffle?: () => void;
  className?: string;
}

function ToolbarChip({
  active,
  children,
  onClick,
  disabled,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
        active
          ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
          : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.06] hover:text-white',
        disabled ? 'cursor-not-allowed opacity-50' : '',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

export default function PracticeToolbar({
  title = 'Practice Controls',
  subtitle = 'Search, filter, and track your progress in real time',
  search = '',
  difficulty = 'all',
  showOnlyBookmarked = false,
  showOnlyFlagged = false,
  premiumOnly = false,
  totalQuestions = 0,
  answeredCount = 0,
  correctCount = 0,
  timeSpent = '--',
  remainingTime = '--',
  streak = 0,
  loading = false,
  onSearchChange,
  onDifficultyChange,
  onToggleBookmarked,
  onToggleFlagged,
  onTogglePremiumOnly,
  onReset,
  onShuffle,
  className = '',
}: PracticeToolbarProps) {
  const progress =
    totalQuestions > 0
      ? Math.round((answeredCount / totalQuestions) * 100)
      : 0;

  const accuracy =
    answeredCount > 0
      ? Math.round((correctCount / answeredCount) * 100)
      : 0;

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

        <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
              <Sparkles className="h-3.5 w-3.5" />
              BEP Practice Toolbar
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white">
              {title}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="premium">{totalQuestions} Questions</Badge>

            {streak > 0 ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/15 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-100">
                <Flame className="h-4 w-4" />
                {streak} Day Streak
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/60">
                <TimerReset className="h-4 w-4 text-cyan-100" />
                Session Active
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/70 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-cyan-100">
              <Search className="h-4 w-4" />
              <span className="text-sm font-semibold">Search practice questions</span>
            </div>

            <Input
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Question, chapter, or subject search করুন..."
              leftIcon={<Search className="h-4 w-4" />}
              disabled={loading}
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/55">
                Quick filters
              </span>

              <ToolbarChip
                active={difficulty === 'all'}
                onClick={() => onDifficultyChange?.('all')}
                disabled={loading}
              >
                All
              </ToolbarChip>

              <ToolbarChip
                active={difficulty === 'easy'}
                onClick={() => onDifficultyChange?.('easy')}
                disabled={loading}
              >
                Easy
              </ToolbarChip>

              <ToolbarChip
                active={difficulty === 'medium'}
                onClick={() => onDifficultyChange?.('medium')}
                disabled={loading}
              >
                Medium
              </ToolbarChip>

              <ToolbarChip
                active={difficulty === 'hard'}
                onClick={() => onDifficultyChange?.('hard')}
                disabled={loading}
              >
                Hard
              </ToolbarChip>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <ToolbarChip
                active={showOnlyBookmarked}
                onClick={() => onToggleBookmarked?.(!showOnlyBookmarked)}
                disabled={loading}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5" />
                  Bookmarked
                </span>
              </ToolbarChip>

              <ToolbarChip
                active={showOnlyFlagged}
                onClick={() => onToggleFlagged?.(!showOnlyFlagged)}
                disabled={loading}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5" />
                  Flagged
                </span>
              </ToolbarChip>

              <ToolbarChip
                active={premiumOnly}
                onClick={() => onTogglePremiumOnly?.(!premiumOnly)}
                disabled={loading}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Wand2 className="h-3.5 w-3.5" />
                  Premium Only
                </span>
              </ToolbarChip>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/70 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-cyan-100">
                <BookOpen className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Answered
                </span>
              </div>

              <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                {answeredCount}
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/55">
                Out of {totalQuestions}
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/70 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-emerald-100">
                <Trophy className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Accuracy
                </span>
              </div>

              <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                {accuracy}%
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/55">
                Correct answers ratio
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/70 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-fuchsia-100">
                <Clock3 className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Time
                </span>
              </div>

              <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                {remainingTime}
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/55">
                Spent {timeSpent}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/70 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-amber-100">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-semibold">Session progress</span>
            </div>

            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-white/40">
                Completion
              </span>
              <span className="font-bold text-cyan-100">{progress}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
              />
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm leading-7 text-white/60">
                Practice engine is optimized for Bengali-first learning, real-time scoring, and premium question filtering.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/70 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-cyan-100">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Actions</span>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={onShuffle}
                leftIcon={<Wand2 className="h-4 w-4" />}
                disabled={loading}
              >
                Shuffle Questions
              </Button>

              <Button
                variant="secondary"
                onClick={onReset}
                leftIcon={<RotateCcw className="h-4 w-4" />}
                disabled={loading}
              >
                Reset Filters
              </Button>
            </div>

            <div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
              <p className="text-sm leading-7 text-white/75">
                Quick hint: use the bookmarked and flagged filters to jump into revision mode faster.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
