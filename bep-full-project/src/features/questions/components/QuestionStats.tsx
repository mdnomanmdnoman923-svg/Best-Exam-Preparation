// bep-full-project/src/features/questions/components/QuestionStats.tsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Crown,
  Eye,
  Flame,
  Layers3,
  Sparkles,
  Star,
  Target,
  Trophy,
  Wand2,
  XCircle,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';

export interface QuestionStatsProps {
  title?: string;
  subtitle?: string;
  totalQuestions?: number;
  publishedQuestions?: number;
  draftQuestions?: number;
  archivedQuestions?: number;
  premiumQuestions?: number;
  featuredQuestions?: number;
  lockedQuestions?: number;
  bookmarkedQuestions?: number;
  flaggedQuestions?: number;
  averageCorrectRate?: number;
  totalAttempts?: number;
  totalStudyMinutes?: number;
  loading?: boolean;
  premium?: boolean;
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

function MetricCard({
  title,
  value,
  description,
  icon,
  accent = 'cyan',
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  accent?: 'cyan' | 'emerald' | 'amber' | 'fuchsia' | 'red' | 'violet';
}) {
  const accentClasses = {
    cyan: 'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
    emerald: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
    amber: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
    fuchsia: 'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100',
    red: 'border-red-400/15 bg-red-400/10 text-red-100',
    violet: 'border-violet-400/15 bg-violet-400/10 text-violet-100',
  } as const;

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-white/75">
        <div className={['flex h-11 w-11 items-center justify-center rounded-2xl border', accentClasses[accent]].join(' ')}>
          {icon}
        </div>
        <div className="min-w-0">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
            {title}
          </span>
          {description ? (
            <p className="mt-1 text-xs leading-5 text-white/50">{description}</p>
          ) : null}
        </div>
      </div>

      <h3 className="mt-4 text-4xl font-bold tracking-tight text-white">
        {value}
      </h3>
    </div>
  );
}

export default function QuestionStats({
  title = 'Question Analytics',
  subtitle = 'Question bank status, content health, and engagement metrics এক নজরে দেখুন',
  totalQuestions = 0,
  publishedQuestions = 0,
  draftQuestions = 0,
  archivedQuestions = 0,
  premiumQuestions = 0,
  featuredQuestions = 0,
  lockedQuestions = 0,
  bookmarkedQuestions = 0,
  flaggedQuestions = 0,
  averageCorrectRate = 0,
  totalAttempts = 0,
  totalStudyMinutes = 0,
  loading = false,
  premium = false,
  className = '',
}: QuestionStatsProps) {
  const safeTotal = Math.max(0, totalQuestions);
  const safePublished = clamp(publishedQuestions, 0, safeTotal);
  const safeDraft = clamp(draftQuestions, 0, safeTotal);
  const safeArchived = clamp(archivedQuestions, 0, safeTotal);
  const safePremium = clamp(premiumQuestions, 0, safeTotal);
  const safeFeatured = clamp(featuredQuestions, 0, safeTotal);
  const safeLocked = clamp(lockedQuestions, 0, safeTotal);
  const safeBookmarked = Math.max(0, bookmarkedQuestions);
  const safeFlagged = Math.max(0, flaggedQuestions);
  const safeAccuracy = clamp(averageCorrectRate, 0, 100);
  const safeAttempts = Math.max(0, totalAttempts);
  const safeStudyMinutes = Math.max(0, totalStudyMinutes);

  const publishedRate = useMemo(() => {
    if (safeTotal === 0) return 0;
    return Math.round((safePublished / safeTotal) * 100);
  }, [safePublished, safeTotal]);

  const draftRate = useMemo(() => {
    if (safeTotal === 0) return 0;
    return Math.round((safeDraft / safeTotal) * 100);
  }, [safeDraft, safeTotal]);

  const healthScore = useMemo(() => {
    if (safeTotal === 0) return 0;

    const weighted =
      safePublished * 1 +
      safeFeatured * 0.75 +
      safePremium * 0.5 -
      safeLocked * 0.35 -
      safeDraft * 0.25 -
      safeFlagged * 0.15;

    const normalized = (weighted / safeTotal) * 100;
    return clamp(Math.round(normalized), 0, 100);
  }, [
    safeDraft,
    safeFeatured,
    safeLocked,
    safePremium,
    safePublished,
    safeTotal,
    safeFlagged,
  ]);

  return (
    <section className={className}>
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_20px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl">
        <div className="relative overflow-hidden border-b border-white/10 p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
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
              <Badge variant="premium">{safeTotal} Questions</Badge>
              {premium ? <Badge variant="success">Premium Insights</Badge> : null}
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                <ArrowUpRight className="h-4 w-4" />
                Live Analytics
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="h-36 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04]"
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <MetricCard
                    title="Total"
                    value={safeTotal}
                    description="All questions"
                    icon={<BookOpen className="h-5 w-5" />}
                    accent="cyan"
                  />
                  <MetricCard
                    title="Published"
                    value={`${safePublished} (${publishedRate}%)`}
                    description="Available to learners"
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    accent="emerald"
                  />
                  <MetricCard
                    title="Draft"
                    value={`${safeDraft} (${draftRate}%)`}
                    description="Awaiting publication"
                    icon={<Clock3 className="h-5 w-5" />}
                    accent="amber"
                  />
                  <MetricCard
                    title="Archived"
                    value={safeArchived}
                    description="Hidden from practice"
                    icon={<Layers3 className="h-5 w-5" />}
                    accent="violet"
                  />
                  <MetricCard
                    title="Premium"
                    value={safePremium}
                    description="Premium content only"
                    icon={<Crown className="h-5 w-5" />}
                    accent="fuchsia"
                  />
                  <MetricCard
                    title="Featured"
                    value={safeFeatured}
                    description="Highlighted questions"
                    icon={<Star className="h-5 w-5" />}
                    accent="cyan"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
                    <div className="flex items-center gap-2 text-cyan-100">
                      <Target className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        Accuracy
                      </span>
                    </div>
                    <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                      {safeAccuracy}%
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/55">
                      Average correctness rate
                    </p>
                  </div>

                  <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
                    <div className="flex items-center gap-2 text-emerald-100">
                      <Eye className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        Attempts
                      </span>
                    </div>
                    <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                      {safeAttempts}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/55">
                      Total learner interactions
                    </p>
                  </div>

                  <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
                    <div className="flex items-center gap-2 text-orange-100">
                      <Clock3 className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        Study time
                      </span>
                    </div>
                    <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                      {formatMinutes(safeStudyMinutes)}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/55">
                      Learner focus time
                    </p>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold uppercase tracking-wider text-white/45">
                      Content health
                    </span>
                    <span className="font-bold text-cyan-100">{healthScore}%</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${healthScore}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                    />
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                      <div className="flex items-center gap-2 text-emerald-100">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">
                          Published ratio
                        </span>
                      </div>
                      <h4 className="mt-2 text-2xl font-bold text-white">
                        {publishedRate}%
                      </h4>
                      <p className="mt-1 text-xs text-white/45">
                        Content ready
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                      <div className="flex items-center gap-2 text-amber-100">
                        <Clock3 className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">
                          Draft ratio
                        </span>
                      </div>
                      <h4 className="mt-2 text-2xl font-bold text-white">
                        {draftRate}%
                      </h4>
                      <p className="mt-1 text-xs text-white/45">
                        Pending review
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                      <div className="flex items-center gap-2 text-red-100">
                        <XCircle className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">
                          Locked/flagged
                        </span>
                      </div>
                      <h4 className="mt-2 text-2xl font-bold text-white">
                        {safeLocked + safeFlagged}
                      </h4>
                      <p className="mt-1 text-xs text-white/45">
                        Needs attention
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="space-y-5">
            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-yellow-100">
                <Trophy className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Quick breakdown
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-white/60">Published</span>
                  <span className="text-sm font-semibold text-white">
                    {safePublished}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-white/60">Draft</span>
                  <span className="text-sm font-semibold text-white">
                    {safeDraft}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-white/60">Archived</span>
                  <span className="text-sm font-semibold text-white">
                    {safeArchived}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-white/60">Premium</span>
                  <span className="text-sm font-semibold text-white">
                    {safePremium}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-white/60">Featured</span>
                  <span className="text-sm font-semibold text-white">
                    {safeFeatured}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-white/60">Bookmarked</span>
                  <span className="text-sm font-semibold text-white">
                    {safeBookmarked}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-cyan-100">
                <Wand2 className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Insights
                </span>
              </div>

              <div className="space-y-3 text-sm leading-7 text-white/65">
                <p>
                  Published content এখন question bank এর বড় অংশ দখল করছে। এটা learner experience এর জন্য ভালো signal.
                </p>
                <p>
                  Draft content বেশি হলে review queue বাড়ানো দরকার হতে পারে।
                </p>
                <p>
                  Premium এবং featured content balance ভালো থাকলে monetization এবং engagement দুটোই improve হয়।
                </p>
              </div>

              {premium ? (
                <div className="mt-4 rounded-2xl border border-fuchsia-400/15 bg-fuchsia-400/10 p-4 text-sm leading-7 text-white/75">
                  Premium analytics mode enabled. আপনি আরও granular content breakdown এবং progress correlation দেখতে পারবেন।
                </div>
              ) : null}
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex items-center gap-2 text-fuchsia-100">
                <Flame className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Risk signals
                </span>
              </div>

              <div className="grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Locked</span>
                    <span className="text-sm font-semibold text-white">
                      {safeLocked}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Flagged</span>
                    <span className="text-sm font-semibold text-white">
                      {safeFlagged}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Bookmarks</span>
                    <span className="text-sm font-semibold text-white">
                      {safeBookmarked}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/20 p-4 text-sm text-white/50">
              Content health is a combined signal from published, featured, premium, draft, and locked question distribution.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
