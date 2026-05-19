// bep-full-project/src/features/subjects/components/SubjectFilter.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Filter,
  Flame,
  GraduationCap,
  Layers3,
  Search,
  Sparkles,
  Star,
  Target,
  Wand2,
  X,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export type SubjectLevel =
  | 'all'
  | 'school'
  | 'college'
  | 'university'
  | 'admission';

export type SubjectStatus =
  | 'all'
  | 'active'
  | 'draft'
  | 'archived';

export interface SubjectFilterValue {
  search: string;
  level: SubjectLevel;
  status: SubjectStatus;
  premiumOnly: boolean;
  featuredOnly: boolean;
  trendingOnly: boolean;
}

export interface SubjectFilterProps {
  value: SubjectFilterValue;
  totalSubjects?: number;
  visibleSubjects?: number;
  premiumSubjects?: number;
  loading?: boolean;
  title?: string;
  subtitle?: string;
  onChange: (
    value: SubjectFilterValue,
  ) => void;
  onReset?: () => void;
  onShuffle?: () => void;
  className?: string;
}

const defaultFilter: SubjectFilterValue =
  {
    search: '',
    level: 'all',
    status: 'all',
    premiumOnly: false,
    featuredOnly: false,
    trendingOnly: false,
  };

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full border px-4 py-2 text-sm font-semibold transition',
        active
          ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
          : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.06] hover:text-white',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

export default function SubjectFilter({
  value,
  totalSubjects = 0,
  visibleSubjects = 0,
  premiumSubjects = 0,
  loading = false,
  title = 'Subject Explorer',
  subtitle = 'Search, filter, and discover subjects based on your study goals',
  onChange,
  onReset,
  onShuffle,
  className = '',
}: SubjectFilterProps) {
  const [advancedOpen, setAdvancedOpen] =
    useState(true);

  const safeValue = useMemo(
    () => ({
      ...defaultFilter,
      ...value,
    }),
    [value],
  );

  const visibilityRate =
    totalSubjects > 0
      ? Math.round(
          (visibleSubjects /
            totalSubjects) *
            100,
        )
      : 0;

  const updateFilter = (
    patch: Partial<SubjectFilterValue>,
  ) => {
    onChange({
      ...safeValue,
      ...patch,
    });
  };

  const resetFilters = () => {
    onChange(defaultFilter);
    onReset?.();
  };

  return (
    <section
      className={[
        'overflow-hidden rounded-[32px] border border-white/10',
        'bg-white/[0.04] shadow-[0_18px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl',
        className,
      ].join(' ')}
    >
      <div className="relative overflow-hidden border-b border-white/10 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

        <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
              <Sparkles className="h-3.5 w-3.5" />
              BEP Subject Hub
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
              {totalSubjects} Subjects
            </Badge>

            <Badge variant="success">
              {visibleSubjects} Visible
            </Badge>

            {premiumSubjects > 0 ? (
              <Badge variant="premium">
                {premiumSubjects} Premium
              </Badge>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-cyan-100">
              <Search className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Search subjects
              </span>
            </div>

            <Input
              value={safeValue.search}
              onChange={(e) =>
                updateFilter({
                  search:
                    e.target.value,
                })
              }
              placeholder="Search subject, chapter, stream..."
              leftIcon={
                <Search className="h-4 w-4" />
              }
              disabled={loading}
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <FilterChip
                active={
                  safeValue.level ===
                  'all'
                }
                onClick={() =>
                  updateFilter({
                    level: 'all',
                  })
                }
              >
                All
              </FilterChip>

              <FilterChip
                active={
                  safeValue.level ===
                  'school'
                }
                onClick={() =>
                  updateFilter({
                    level:
                      'school',
                  })
                }
              >
                School
              </FilterChip>

              <FilterChip
                active={
                  safeValue.level ===
                  'college'
                }
                onClick={() =>
                  updateFilter({
                    level:
                      'college',
                  })
                }
              >
                College
              </FilterChip>

              <FilterChip
                active={
                  safeValue.level ===
                  'university'
                }
                onClick={() =>
                  updateFilter({
                    level:
                      'university',
                  })
                }
              >
                University
              </FilterChip>

              <FilterChip
                active={
                  safeValue.level ===
                  'admission'
                }
                onClick={() =>
                  updateFilter({
                    level:
                      'admission',
                  })
                }
              >
                Admission
              </FilterChip>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5">
              <div className="flex items-center gap-2 text-cyan-100">
                <BookOpen className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Total
                </span>
              </div>

              <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                {totalSubjects}
              </h3>

              <p className="mt-2 text-sm text-white/55">
                All available subjects
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5">
              <div className="flex items-center gap-2 text-emerald-100">
                <Layers3 className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Visible
                </span>
              </div>

              <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                {visibleSubjects}
              </h3>

              <p className="mt-2 text-sm text-white/55">
                Filtered results
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
                {premiumSubjects}
              </h3>

              <p className="mt-2 text-sm text-white/55">
                Premium-only content
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-white/45">
                Visibility ratio
              </span>

              <span className="font-bold text-cyan-100">
                {visibilityRate}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${visibilityRate}%`,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-100">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Advanced filters
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAdvancedOpen(
                    (prev) => !prev,
                  )
                }
                className="text-sm font-medium text-cyan-100 transition hover:text-white"
              >
                {advancedOpen
                  ? 'Hide'
                  : 'Show'}
              </button>
            </div>

            {advancedOpen ? (
              <div className="space-y-4">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">
                    Status
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        'all',
                        'active',
                        'draft',
                        'archived',
                      ] as const
                    ).map((status) => (
                      <FilterChip
                        key={status}
                        active={
                          safeValue.status ===
                          status
                        }
                        onClick={() =>
                          updateFilter({
                            status,
                          })
                        }
                      >
                        {status}
                      </FilterChip>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="text-sm text-white/70">
                      Premium only
                    </span>

                    <input
                      type="checkbox"
                      checked={
                        safeValue.premiumOnly
                      }
                      onChange={(e) =>
                        updateFilter({
                          premiumOnly:
                            e.target
                              .checked,
                        })
                      }
                      className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="text-sm text-white/70">
                      Featured only
                    </span>

                    <input
                      type="checkbox"
                      checked={
                        safeValue.featuredOnly
                      }
                      onChange={(e) =>
                        updateFilter({
                          featuredOnly:
                            e.target
                              .checked,
                        })
                      }
                      className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="text-sm text-white/70">
                      Trending only
                    </span>

                    <input
                      type="checkbox"
                      checked={
                        safeValue.trendingOnly
                      }
                      onChange={(e) =>
                        updateFilter({
                          trendingOnly:
                            e.target
                              .checked,
                        })
                      }
                      className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400"
                    />
                  </label>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5">
            <div className="mb-4 flex items-center gap-2 text-orange-100">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Quick actions
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={onShuffle}
                leftIcon={
                  <Wand2 className="h-4 w-4" />
                }
                disabled={loading}
              >
                Shuffle Subjects
              </Button>

              <Button
                variant="secondary"
                onClick={
                  resetFilters
                }
                leftIcon={
                  <X className="h-4 w-4" />
                }
                disabled={loading}
              >
                Reset Filters
              </Button>
            </div>

            <div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
              <p className="text-sm leading-7 text-white/75">
                Combine level and premium filters to quickly discover the right study content.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex items-center gap-2 text-fuchsia-100">
              <GraduationCap className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Discovery insights
              </span>
            </div>

            <div className="space-y-3 text-sm leading-7 text-white/65">
              <p>
                Trending subjects এ
                নতুন practice এবং mock
                exam দ্রুত যোগ হয়।
              </p>

              <p>
                Premium subjects এ AI
                assistant এবং advanced
                analytics available
                থাকতে পারে।
              </p>

              <p>
                Filter ব্যবহার করলে
                specific learning path
                দ্রুত খুঁজে পাওয়া যায়।
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge variant="success">
                Smart Search
              </Badge>

              <Badge variant="premium">
                AI Ready
              </Badge>

              <Badge variant="secondary">
                Personalized
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
