// bep-full-project/src/features/progress/components/WeakTopicList.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Flame,
  Filter,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export type WeakTopicSeverity = 'low' | 'medium' | 'high';

export interface WeakTopicItem {
  id: string;
  topic: string;
  subject?: string;
  chapter?: string;
  score?: number;
  accuracy?: number;
  attempts?: number;
  mistakes?: number;
  severity?: WeakTopicSeverity;
  recommendation?: string;
  lastPracticedAt?: string;
  premium?: boolean;
}

export interface WeakTopicListProps {
  title?: string;
  subtitle?: string;
  topics: WeakTopicItem[];
  loading?: boolean;
  searchable?: boolean;
  showFilter?: boolean;
  collapsible?: boolean;
  defaultExpandedCount?: number;
  onTopicClick?: (topicId: string) => void;
  onPracticeTopic?: (topicId: string) => void;
  onViewAll?: () => void;
  className?: string;
}

function getSeverityMeta(severity: WeakTopicSeverity = 'medium') {
  switch (severity) {
    case 'low':
      return {
        label: 'Low risk',
        className: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
      };
    case 'high':
      return {
        label: 'High risk',
        className: 'border-red-400/15 bg-red-400/10 text-red-100',
      };
    case 'medium':
    default:
      return {
        label: 'Needs focus',
        className: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
      };
  }
}

function safeScore(item: WeakTopicItem) {
  if (typeof item.score === 'number') return Math.max(0, Math.min(100, item.score));
  if (typeof item.accuracy === 'number') return Math.max(0, Math.min(100, item.accuracy));
  return 0;
}

function formatRelativeDate(value?: string) {
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

export default function WeakTopicList({
  title = 'Weak Topics',
  subtitle = 'যেসব chapter/topic এ আরও practice দরকার, সেগুলো এখানে দেখুন',
  topics,
  loading = false,
  searchable = true,
  showFilter = true,
  collapsible = true,
  defaultExpandedCount = 5,
  onTopicClick,
  onPracticeTopic,
  onViewAll,
  className = '',
}: WeakTopicListProps) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(!collapsible);
  const [filterSeverity, setFilterSeverity] = useState<WeakTopicSeverity | 'all'>('all');

  const filteredTopics = useMemo(() => {
    const query = search.trim().toLowerCase();

    return topics.filter((topic) => {
      const matchesSearch =
        !query ||
        [topic.topic, topic.subject, topic.chapter, topic.recommendation]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesSeverity =
        filterSeverity === 'all' ? true : topic.severity === filterSeverity;

      return matchesSearch && matchesSeverity;
    });
  }, [filterSeverity, search, topics]);

  const visibleTopics = useMemo(() => {
    if (!collapsible || expanded) return filteredTopics;
    return filteredTopics.slice(0, defaultExpandedCount);
  }, [collapsible, defaultExpandedCount, expanded, filteredTopics]);

  const hiddenCount = Math.max(0, filteredTopics.length - visibleTopics.length);

  return (
    <section className={className}>
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_20px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl">
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
                {topics.length} Topics
              </Badge>

              <div className="inline-flex items-center gap-2 rounded-full border border-red-400/15 bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-100">
                <AlertTriangle className="h-4 w-4" />
                Focus Needed
              </div>

              {onViewAll ? (
                <Button variant="secondary" onClick={onViewAll}>
                  View All
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            {searchable ? (
              <div className="w-full xl:max-w-lg">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search weak topics..."
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
            ) : (
              <div />
            )}

            <div className="flex flex-wrap items-center gap-3">
              {showFilter ? (
                <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
                  {(['all', 'low', 'medium', 'high'] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFilterSeverity(item)}
                      className={[
                        'rounded-xl px-4 py-2 text-sm font-medium capitalize transition',
                        filterSeverity === item
                          ? 'bg-cyan-400/15 text-cyan-100'
                          : 'text-white/55 hover:text-white',
                      ].join(' ')}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ) : null}

              {collapsible ? (
                <Button
                  variant="secondary"
                  leftIcon={
                    expanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  }
                  onClick={() => setExpanded((prev) => !prev)}
                >
                  {expanded ? 'Collapse' : 'Expand'}
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04]"
                />
              ))}
            </div>
          ) : filteredTopics.length > 0 ? (
            <div className="space-y-4">
              {visibleTopics.map((topic, index) => {
                const meta = getSeverityMeta(topic.severity);
                const score = safeScore(topic);
                const relativeDate = formatRelativeDate(topic.lastPracticedAt);

                return (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: index * 0.03 }}
                    className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/20 hover:bg-white/[0.06]"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                    <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <button
                        type="button"
                        onClick={() => onTopicClick?.(topic.id)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-bold tracking-tight text-white transition group-hover:text-cyan-100">
                            {topic.topic}
                          </h3>

                          <div
                            className={[
                              'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold',
                              meta.className,
                            ].join(' ')}
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            {meta.label}
                          </div>

                          {topic.premium ? (
                            <Badge variant="premium">Premium</Badge>
                          ) : null}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/50">
                          {topic.subject ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                              <BookOpen className="h-3.5 w-3.5" />
                              {topic.subject}
                            </span>
                          ) : null}

                          {topic.chapter ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                              <Target className="h-3.5 w-3.5" />
                              {topic.chapter}
                            </span>
                          ) : null}

                          {typeof topic.attempts === 'number' ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                              <Flame className="h-3.5 w-3.5" />
                              {topic.attempts} attempts
                            </span>
                          ) : null}

                          {relativeDate ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                              <TrendingUp className="h-3.5 w-3.5" />
                              Practiced {relativeDate}
                            </span>
                          ) : null}
                        </div>

                        {topic.recommendation ? (
                          <p className="mt-4 text-sm leading-7 text-white/65">
                            {topic.recommendation}
                          </p>
                        ) : null}
                      </button>

                      <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[360px] xl:grid-cols-1">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                          <div className="flex items-center gap-2 text-cyan-100">
                            <Target className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase tracking-wide">
                              Score
                            </span>
                          </div>
                          <h4 className="mt-2 text-2xl font-bold text-white">
                            {score}%
                          </h4>
                          <p className="mt-1 text-xs text-white/45">
                            Current accuracy
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                          <div className="flex items-center gap-2 text-emerald-100">
                            <Zap className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase tracking-wide">
                              Mistakes
                            </span>
                          </div>
                          <h4 className="mt-2 text-2xl font-bold text-white">
                            {typeof topic.mistakes === 'number' ? topic.mistakes : '--'}
                          </h4>
                          <p className="mt-1 text-xs text-white/45">
                            Need revision
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                          <div className="flex items-center gap-2 text-fuchsia-100">
                            <Filter className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase tracking-wide">
                              Severity
                            </span>
                          </div>
                          <h4 className="mt-2 text-2xl font-bold text-white">
                            {meta.label}
                          </h4>
                          <p className="mt-1 text-xs text-white/45">
                            Priority level
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm text-white/55">
                        {topic.attempts || topic.mistakes ? (
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                            <Flame className="h-3.5 w-3.5 text-orange-200" />
                            Practice more to strengthen this topic
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-cyan-100" />
                            Add practice sessions to reveal weak areas
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          variant="secondary"
                          onClick={() => onTopicClick?.(topic.id)}
                        >
                          Open Topic
                        </Button>

                        <Button
                          onClick={() => onPracticeTopic?.(topic.id)}
                          rightIcon={<ArrowRight className="h-4 w-4" />}
                        >
                          Practice Now
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {collapsible && !expanded && hiddenCount > 0 ? (
                <div className="flex justify-center pt-2">
                  <Button
                    variant="secondary"
                    leftIcon={<ChevronDown className="h-4 w-4" />}
                    onClick={() => setExpanded(true)}
                  >
                    Show {hiddenCount} more
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.04] px-6 py-16 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[30px] border border-white/10 bg-white/[0.05] text-cyan-100">
                <BookOpen className="h-11 w-11" />
              </div>

              <h3 className="mt-6 text-2xl font-bold tracking-tight text-white">
                No weak topics found
              </h3>

              <p className="mt-3 max-w-lg text-sm leading-7 text-white/60">
                Search বা filter পরিবর্তন করে আবার চেষ্টা করুন। আরও practice করলে weak area গুলো এখানে populate হবে।
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm leading-7 text-white/55">
              Weak topic analysis helps you focus on chapters where mistakes are highest and accuracy is lowest.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="premium">Live Analysis</Badge>
              <Badge variant="success">{filteredTopics.length} Visible</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
