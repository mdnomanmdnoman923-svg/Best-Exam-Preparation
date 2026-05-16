// bep-full-project/src/features/questions/components/QuestionFilter.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Filter,
  Flame,
  Search,
  Sparkles,
  Star,
  Target,
  Trophy,
  Wand2,
  X,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export type QuestionType = 'all' | 'mcq' | 'sq' | 'cq';
export type QuestionDifficulty = 'all' | 'easy' | 'medium' | 'hard';
export type QuestionStatus = 'all' | 'draft' | 'published' | 'archived';

export interface QuestionFilterValue {
  search: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  status: QuestionStatus;
  premiumOnly: boolean;
  featuredOnly: boolean;
  lockedOnly: boolean;
  bookmarkedOnly: boolean;
  flaggedOnly: boolean;
}

export interface QuestionFilterProps {
  title?: string;
  subtitle?: string;
  value: QuestionFilterValue;
  totalQuestions?: number;
  visibleQuestions?: number;
  answeredQuestions?: number;
  premiumQuestions?: number;
  loading?: boolean;
  showAdvanced?: boolean;
  onChange: (value: QuestionFilterValue) => void;
  onReset?: () => void;
  onShuffle?: () => void;
  className?: string;
}

const defaultValue: QuestionFilterValue = {
  search: '',
  type: 'all',
  difficulty: 'all',
  status: 'all',
  premiumOnly: false,
  featuredOnly: false,
  lockedOnly: false,
  bookmarkedOnly: false,
  flaggedOnly: false,
};

function FilterChip({
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

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-2 text-cyan-100">
        <Target className="h-4 w-4" />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      {children}
    </div>
  );
}

export default function QuestionFilter({
  title = 'Question Filters',
  subtitle = 'Search, filter, and fine-tune the question bank in real time',
  value,
  totalQuestions = 0,
  visibleQuestions = 0,
  answeredQuestions = 0,
  premiumQuestions = 0,
  loading = false,
  showAdvanced = true,
  onChange,
  onReset,
  onShuffle,
  className = '',
}: QuestionFilterProps) {
  const [advancedOpen, setAdvancedOpen] = useState(true);

  const safeValue = useMemo<QuestionFilterValue>(() => {
    return {
      ...defaultValue,
      ...value,
    };
  }, [value]);

  const progress = totalQuestions > 0
    ? Math.round((visibleQuestions / totalQuestions) * 100)
    : 0;

  const applyChange = (patch: Partial<QuestionFilterValue>) => {
    onChange({
      ...safeValue,
      ...patch,
    });
  };

  const clearAll = () => {
    onChange(defaultValue);
    onReset?.();
  };

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
              BEP Question Bank
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white">
              {title}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="premium">{totalQuestions} Total</Badge>
            <Badge variant="success">{visibleQuestions} Visible</Badge>
            <Badge variant="secondary">{answeredQuestions} Answered</Badge>
            {premiumQuestions > 0 ? <Badge variant="premium">{premiumQuestions} Premium</Badge> : null}
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <SectionCard title="Search questions">
            <Input
              value={safeValue.search}
              onChange={(e) => applyChange({ search: e.target.value })}
              placeholder="Question, chapter, subject search করুন..."
              leftIcon={<Search className="h-4 w-4" />}
              disabled={loading}
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <FilterChip
                active={safeValue.type === 'all'}
                onClick={() => applyChange({ type: 'all' })}
                disabled={loading}
              >
                All
              </FilterChip>

              <FilterChip
                active={safeValue.type === 'mcq'}
                onClick={() => applyChange({ type: 'mcq' })}
                disabled={loading}
              >
                MCQ
              </FilterChip>

              <FilterChip
                active={safeValue.type === 'sq'}
                onClick={() => applyChange({ type: 'sq' })}
                disabled={loading}
              >
                SQ
              </FilterChip>

              <FilterChip
                active={safeValue.type === 'cq'}
                onClick={() => applyChange({ type: 'cq' })}
                disabled={loading}
              >
                CQ
              </FilterChip>
            </div>
          </SectionCard>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5">
              <div className="flex items-center gap-2 text-cyan-100">
                <Target className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Visible
                </span>
              </div>
              <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                {visibleQuestions}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Current result set
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5">
              <div className="flex items-center gap-2 text-emerald-100">
                <Trophy className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Answered
                </span>
              </div>
              <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                {answeredQuestions}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Practice-ready items
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5">
              <div className="flex items-center gap-2 text-fuchsia-100">
                <Star className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Premium
                </span>
              </div>
              <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                {premiumQuestions}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Premium questions
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-white/45">
                Visibility progress
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
          </div>
        </div>

        <div className="space-y-5">
          <SectionCard title="Difficulty & status">
            <div className="mb-4 flex flex-wrap gap-2">
              <FilterChip
                active={safeValue.difficulty === 'all'}
                onClick={() => applyChange({ difficulty: 'all' })}
                disabled={loading}
              >
                All levels
              </FilterChip>

              <FilterChip
                active={safeValue.difficulty === 'easy'}
                onClick={() => applyChange({ difficulty: 'easy' })}
                disabled={loading}
              >
                Easy
              </FilterChip>

              <FilterChip
                active={safeValue.difficulty === 'medium'}
                onClick={() => applyChange({ difficulty: 'medium' })}
                disabled={loading}
              >
                Medium
              </FilterChip>

              <FilterChip
                active={safeValue.difficulty === 'hard'}
                onClick={() => applyChange({ difficulty: 'hard' })}
                disabled={loading}
              >
                Hard
              </FilterChip>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <FilterChip
                active={safeValue.status === 'all'}
                onClick={() => applyChange({ status: 'all' })}
                disabled={loading}
              >
                All status
              </FilterChip>

              <FilterChip
                active={safeValue.status === 'draft'}
                onClick={() => applyChange({ status: 'draft' })}
                disabled={loading}
              >
                Draft
              </FilterChip>

              <FilterChip
                active={safeValue.status === 'published'}
                onClick={() => applyChange({ status: 'published' })}
                disabled={loading}
              >
                Published
              </FilterChip>

              <FilterChip
                active={safeValue.status === 'archived'}
                onClick={() => applyChange({ status: 'archived' })}
                disabled={loading}
              >
                Archived
              </FilterChip>
            </div>

            {showAdvanced ? (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setAdvancedOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-100 transition hover:text-white"
                >
                  <Filter className="h-4 w-4" />
                  {advancedOpen ? 'Hide advanced filters' : 'Show advanced filters'}
                </button>
              </div>
            ) : null}
          </SectionCard>

          {showAdvanced && advancedOpen ? (
            <SectionCard title="Quick toggles">
              <div className="space-y-3">
                <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-white/70">Premium only</span>
                  <input
                    type="checkbox"
                    checked={safeValue.premiumOnly}
                    onChange={(e) => applyChange({ premiumOnly: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400/30"
                  />
                </label>

                <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-white/70">Featured only</span>
                  <input
                    type="checkbox"
                    checked={safeValue.featuredOnly}
                    onChange={(e) => applyChange({ featuredOnly: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400/30"
                  />
                </label>

                <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-white/70">Locked only</span>
                  <input
                    type="checkbox"
                    checked={safeValue.lockedOnly}
                    onChange={(e) => applyChange({ lockedOnly: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400/30"
                  />
                </label>

                <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-white/70">Bookmarked only</span>
                  <input
                    type="checkbox"
                    checked={safeValue.bookmarkedOnly}
                    onChange={(e) => applyChange({ bookmarkedOnly: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400/30"
                  />
                </label>

                <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-white/70">Flagged only</span>
                  <input
                    type="checkbox"
                    checked={safeValue.flaggedOnly}
                    onChange={(e) => applyChange({ flaggedOnly: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400/30"
                  />
                </label>
              </div>
            </SectionCard>
          ) : null}

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-orange-100">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-semibold">Actions</span>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={onShuffle}
                leftIcon={<Wand2 className="h-4 w-4" />}
                disabled={loading}
              >
                Shuffle
              </Button>

              <Button
                variant="secondary"
                onClick={clearAll}
                leftIcon={<X className="h-4 w-4" />}
                disabled={loading}
              >
                Reset filters
              </Button>
            </div>

            <div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
              <p className="text-sm leading-7 text-white/75">
                Smart tip: combine difficulty and status filters to quickly isolate weak or premium content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
