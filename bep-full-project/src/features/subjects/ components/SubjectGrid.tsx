// bep-full-project/src/features/subjects/components/SubjectGrid.tsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Crown,
  Flame,
  Layers3,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Wand2,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export type SubjectLevel =
  | 'school'
  | 'college'
  | 'university'
  | 'admission';

export type SubjectStatus =
  | 'active'
  | 'draft'
  | 'archived';

export interface SubjectGridItem {
  id: string;
  name: string;
  slug?: string;
  level?: SubjectLevel;
  description?: string;
  totalChapters?: number;
  totalQuestions?: number;
  totalStudents?: number;
  averageScore?: number;
  premium?: boolean;
  featured?: boolean;
  trending?: boolean;
  locked?: boolean;
  icon?: React.ReactNode;
  colorClass?: string;
  lastUpdatedAt?: string;
}

export interface SubjectGridProps {
  subjects: SubjectGridItem[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  searchable?: boolean;
  compact?: boolean;
  onSubjectClick?: (subjectId: string) => void;
  onViewAll?: () => void;
  className?: string;
}

function levelLabel(level?: SubjectLevel) {
  switch (level) {
    case 'school':
      return 'School';
    case 'college':
      return 'College';
    case 'university':
      return 'University';
    case 'admission':
      return 'Admission';
    default:
      return 'General';
  }
}

function formatRelativeTime(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (days <= 0 && hours < 1) return 'Just now';
  if (days <= 0) return `${hours}h ago`;
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

function MetricPill({
  icon,
  label,
  value,
  accent = 'cyan',
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: 'cyan' | 'emerald' | 'amber' | 'fuchsia' | 'violet';
}) {
  const accentClassMap = {
    cyan: 'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
    emerald: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
    amber: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
    fuchsia: 'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100',
    violet: 'border-violet-400/15 bg-violet-400/10 text-violet-100',
  } as const;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-2 text-white/60">
        <div className={['flex h-9 w-9 items-center justify-center rounded-xl border', accentClassMap[accent]].join(' ')}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
            {label}
          </div>
          <div className="mt-1 text-xl font-bold text-white">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default function SubjectGrid({
  subjects,
  title = 'Subject Explorer',
  subtitle = 'আপনার study path অনুযায়ী subject browse করুন এবং দ্রুত jump করুন',
  loading = false,
  searchable = true,
  compact = false,
  onSubjectClick,
  onViewAll,
  className = '',
}: SubjectGridProps) {
  const visibleSubjects = useMemo(() => subjects, [subjects]);

  return (
    <section className={className}>
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_20px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl">
        <div className="relative overflow-hidden border-b border-white/10 p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
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
              <Badge variant="premium">{subjects.length} Subjects</Badge>
              <Badge variant="success">Live Content</Badge>
              {onViewAll ? (
                <Button variant="secondary" onClick={onViewAll}>
                  View All
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6">
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
            <MetricPill
              icon={<BookOpen className="h-4 w-4" />}
              label="Subjects"
              value={subjects.length}
              accent="cyan"
            />
            <MetricPill
              icon={<Layers3 className="h-4 w-4" />}
              label="Chapters"
              value={subjects.reduce((sum, item) => sum + (item.totalChapters || 0), 0)}
              accent="emerald"
            />
            <MetricPill
              icon={<Users className="h-4 w-4" />}
              label="Students"
              value={subjects.reduce((sum, item) => sum + (item.totalStudents || 0), 0)}
              accent="fuchsia"
            />
            <MetricPill
              icon={<TrendingUp className="h-4 w-4" />}
              label="Avg score"
              value={`${Math.round(
                subjects.length
                  ? subjects.reduce((sum, item) => sum + (item.averageScore || 0), 0) / subjects.length
                  : 0,
              )}%`}
              accent="amber"
            />
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04]"
                />
              ))}
            </div>
          ) : visibleSubjects.length > 0 ? (
            <div className={['grid gap-4', compact ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'].join(' ')}>
              {visibleSubjects.map((subject, index) => {
                const relativeTime = formatRelativeTime(subject.lastUpdatedAt);

                return (
                  <motion.button
                    key={subject.id}
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: index * 0.03 }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => onSubjectClick?.(subject.id)}
                    className={[
                      'group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] text-left',
                      'shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-2xl transition-all duration-300',
                      'hover:border-cyan-400/20 hover:bg-white/[0.06]',
                    ].join(' ')}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_30%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                    <div className="relative z-10 flex h-full flex-col p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <Badge variant="premium">
                              {levelLabel(subject.level)}
                            </Badge>

                            {subject.premium ? (
                              <Badge variant="premium">
                                <Crown className="mr-1 h-3.5 w-3.5" />
                                Premium
                              </Badge>
                            ) : null}

                            {subject.featured ? (
                              <Badge variant="success">
                                <Star className="mr-1 h-3.5 w-3.5" />
                                Featured
                              </Badge>
                            ) : null}

                            {subject.trending ? (
                              <Badge variant="warning">
                                <Flame className="mr-1 h-3.5 w-3.5" />
                                Trending
                              </Badge>
                            ) : null}

                            {subject.locked ? (
                              <Badge variant="danger">Locked</Badge>
                            ) : null}
                          </div>

                          <h3 className="text-2xl font-bold tracking-tight text-white transition group-hover:text-cyan-100">
                            {subject.name}
                          </h3>

                          {subject.description ? (
                            <p className="mt-3 line-clamp-3 text-sm leading-7 text-white/65">
                              {subject.description}
                            </p>
                          ) : (
                            <p className="mt-3 text-sm leading-7 text-white/50">
                              এই subject এ curated questions, chapters, practice এবং mock exam available থাকতে পারে।
                            </p>
                          )}
                        </div>

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] text-cyan-100">
                          {subject.icon || <BookOpen className="h-6 w-6" />}
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <div className="flex items-center gap-2 text-cyan-100">
                            <Layers3 className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase tracking-wide">
                              Chapters
                            </span>
                          </div>
                          <h4 className="mt-2 text-2xl font-bold text-white">
                            {subject.totalChapters ?? 0}
                          </h4>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <div className="flex items-center gap-2 text-emerald-100">
                            <Target className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase tracking-wide">
                              Questions
                            </span>
                          </div>
                          <h4 className="mt-2 text-2xl font-bold text-white">
                            {subject.totalQuestions ?? 0}
                          </h4>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <div className="flex items-center gap-2 text-fuchsia-100">
                            <Users className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase tracking-wide">
                              Students
                            </span>
                          </div>
                          <h4 className="mt-2 text-2xl font-bold text-white">
                            {subject.totalStudents ?? 0}
                          </h4>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <div className="flex items-center gap-2 text-amber-100">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase tracking-wide">
                              Score
                            </span>
                          </div>
                          <h4 className="mt-2 text-2xl font-bold text-white">
                            {subject.averageScore ?? 0}%
                          </h4>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        {relativeTime ? (
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/55">
                            <Sparkles className="h-3.5 w-3.5" />
                            Updated {relativeTime}
                          </span>
                        ) : null}

                        {subject.locked ? (
                          <span className="inline-flex items-center gap-2 rounded-full border border-red-400/15 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-100">
                            <Wand2 className="h-3.5 w-3.5" />
                            Premium locked
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-white/55">
                          <CheckCircle2 className="h-4 w-4 text-emerald-100" />
                          <span className="text-sm">
                            Explore chapters and start practicing
                          </span>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1.5 text-sm font-semibold text-cyan-100">
                          Open
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.04] px-6 py-16 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[30px] border border-white/10 bg-white/[0.05] text-cyan-100">
                <BookOpen className="h-11 w-11" />
              </div>

              <h3 className="mt-6 text-2xl font-bold tracking-tight text-white">
                No subjects found
              </h3>

              <p className="mt-3 max-w-lg text-sm leading-7 text-white/60">
                আপনার current filter বা search অনুযায়ী কোনো subject পাওয়া যায়নি।
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm leading-7 text-white/55">
              Subject grid তৈরি করা হয়েছে fast navigation, progress tracking, এবং premium discovery এর জন্য।
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="premium">Live Grid</Badge>
              <Badge variant="success">{subjects.length} Items</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
