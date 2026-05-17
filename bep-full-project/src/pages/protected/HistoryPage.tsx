// bep-full-project/src/pages/protected/HistoryPage.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Crown,
  Filter,
  Flame,
  History,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Wand2,
  X,
  XCircle,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type HistoryType =
  | 'practice'
  | 'exam'
  | 'community'
  | 'ai'
  | 'achievement';

interface HistoryItem {
  id: string;
  title: string;
  description: string;
  type: HistoryType;
  subject?: string;
  chapter?: string;
  date: string;
  time: string;
  score?: string;
  status?: 'success' | 'warning' | 'info' | 'premium';
  premium?: boolean;
  starred?: boolean;
}

const seedHistory: HistoryItem[] = [
  {
    id: 'hist-1',
    title: 'Practice session completed',
    description: 'Solved 24 MCQs in Physics with 87% accuracy.',
    type: 'practice',
    subject: 'Physics',
    chapter: 'Motion and Force',
    date: '2026-05-17',
    time: '08:45 AM',
    score: '87%',
    status: 'success',
    premium: false,
    starred: true,
  },
  {
    id: 'hist-2',
    title: 'Mock exam submitted',
    description: 'Finished a 45-minute HSC mock exam.',
    type: 'exam',
    subject: 'Physics',
    chapter: 'Motion and Force',
    date: '2026-05-16',
    time: '10:20 PM',
    score: '38/50',
    status: 'premium',
    premium: true,
    starred: false,
  },
  {
    id: 'hist-3',
    title: 'AI assistant explained a question',
    description: 'Received a step-by-step explanation for an algebra equation.',
    type: 'ai',
    subject: 'Mathematics',
    chapter: 'Linear Equation',
    date: '2026-05-16',
    time: '06:12 PM',
    status: 'info',
    premium: false,
    starred: false,
  },
  {
    id: 'hist-4',
    title: 'Community reply posted',
    description: 'Shared a study tip in the community feed.',
    type: 'community',
    subject: 'Study Tips',
    date: '2026-05-15',
    time: '09:04 PM',
    status: 'info',
    premium: false,
    starred: false,
  },
  {
    id: 'hist-5',
    title: 'Achievement unlocked',
    description: 'Unlocked 14-day study streak badge.',
    type: 'achievement',
    date: '2026-05-14',
    time: '07:10 AM',
    status: 'success',
    premium: false,
    starred: true,
  },
  {
    id: 'hist-6',
    title: 'Leaderboard rank improved',
    description: 'Moved up 8 positions on the weekly leaderboard.',
    type: 'achievement',
    date: '2026-05-13',
    time: '11:35 PM',
    status: 'premium',
    premium: true,
    starred: false,
  },
];

const typeOptions: Array<{ id: 'all' | HistoryType; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'practice', label: 'Practice' },
  { id: 'exam', label: 'Exams' },
  { id: 'community', label: 'Community' },
  { id: 'ai', label: 'AI' },
  { id: 'achievement', label: 'Achievements' },
];

function typeLabel(type: HistoryType) {
  switch (type) {
    case 'practice':
      return 'Practice';
    case 'exam':
      return 'Exam';
    case 'community':
      return 'Community';
    case 'ai':
      return 'AI';
    case 'achievement':
      return 'Achievement';
    default:
      return 'History';
  }
}

function typeVariant(type: HistoryType) {
  switch (type) {
    case 'practice':
      return 'success' as const;
    case 'exam':
      return 'warning' as const;
    case 'community':
      return 'secondary' as const;
    case 'ai':
      return 'premium' as const;
    case 'achievement':
      return 'premium' as const;
    default:
      return 'secondary' as const;
  }
}

function statusVariant(status?: HistoryItem['status']) {
  switch (status) {
    case 'success':
      return 'success' as const;
    case 'warning':
      return 'warning' as const;
    case 'info':
      return 'secondary' as const;
    case 'premium':
      return 'premium' as const;
    default:
      return 'secondary' as const;
  }
}

function formatDateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString([], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function StatCard({
  title,
  value,
  icon,
  accent = 'cyan',
  note,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: 'cyan' | 'emerald' | 'amber' | 'fuchsia';
  note?: string;
}) {
  const accentMap = {
    cyan: 'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
    emerald: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
    amber: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
    fuchsia: 'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100',
  } as const;

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-white/55">{title}</p>
          <h3 className="mt-2 text-4xl font-black tracking-tight text-white">{value}</h3>
          {note ? <p className="mt-2 text-sm text-white/45">{note}</p> : null}
        </div>

        <div
          className={[
            'flex h-14 w-14 items-center justify-center rounded-2xl border',
            accentMap[accent],
          ].join(' ')}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function HistoryCard({
  item,
  onToggleStar,
}: {
  item: HistoryItem;
  onToggleStar: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant={typeVariant(item.type)}>
              {typeLabel(item.type)}
            </Badge>

            {item.status ? <Badge variant={statusVariant(item.status)}>{item.status}</Badge> : null}

            {item.premium ? <Badge variant="premium">Premium</Badge> : null}

            {item.starred ? <Badge variant="success">Starred</Badge> : null}
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-white">
            {item.title}
          </h3>

          <p className="mt-3 text-sm leading-7 text-white/65">
            {item.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-cyan-100" />
              {formatDateLabel(item.date)}
            </div>

            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-emerald-100" />
              {item.time}
            </div>

            {item.subject ? (
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-fuchsia-100" />
                {item.subject}
              </div>
            ) : null}

            {item.chapter ? (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-100" />
                {item.chapter}
              </div>
            ) : null}
          </div>

          {item.score ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-white/60">
              <Trophy className="h-4 w-4 text-amber-100" />
              Score: {item.score}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
          <button
            type="button"
            onClick={() => onToggleStar(item.id)}
            className={[
              'inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition',
              item.starred
                ? 'border-amber-400/15 bg-amber-400/10 text-amber-100'
                : 'border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/[0.08] hover:text-white',
            ].join(' ')}
          >
            <Star className="h-4 w-4" />
            {item.starred ? 'Starred' : 'Star'}
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
            View details
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-100">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-1 text-sm leading-7 text-white/55">{description}</p>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'all' | HistoryType>('all');
  const [loading] = useState(false);
  const [items, setItems] = useState<HistoryItem[]>(seedHistory);
  const [selectedRange, setSelectedRange] = useState<'7d' | '30d' | '90d'>('7d');

  const stats = useMemo(() => {
    const practice = items.filter((item) => item.type === 'practice').length;
    const exam = items.filter((item) => item.type === 'exam').length;
    const ai = items.filter((item) => item.type === 'ai').length;
    const achievements = items.filter((item) => item.type === 'achievement').length;

    return {
      total: items.length,
      practice,
      exam,
      ai,
      achievements,
      starred: items.filter((item) => item.starred).length,
      premium: items.filter((item) => item.premium).length,
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items
      .filter((item) => {
        const matchesSearch =
          !query ||
          [
            item.title,
            item.description,
            item.subject,
            item.chapter,
            item.type,
            item.score,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query);

        const matchesType = type === 'all' || item.type === type;

        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
  }, [items, search, type]);

  const toggleStar = (id: string) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, starred: !item.starred }
          : item,
      ),
    );
  };

  const clearFilters = () => {
    setSearch('');
    setType('all');
  };

  return (
    <div className="min-h-screen bg-[#050816] p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
          <div className="relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  BEP Activity Timeline
                </div>

                <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                  History
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  Practice, exam, community, AI assistant, and achievement activity সব এক জায়গায় দেখুন।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Logged
                </Badge>
                <Badge variant="premium">
                  <History className="mr-1 h-3.5 w-3.5" />
                  Timeline
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Events"
            value={stats.total}
            icon={<History className="h-5 w-5" />}
            accent="cyan"
            note="All tracked actions"
          />
          <StatCard
            title="Practice"
            value={stats.practice}
            icon={<Target className="h-5 w-5" />}
            accent="emerald"
            note="Solved sessions"
          />
          <StatCard
            title="AI / Exam"
            value={stats.ai + stats.exam}
            icon={<Brain className="h-5 w-5" />}
            accent="fuchsia"
            note="High-value learning actions"
          />
          <StatCard
            title="Starred"
            value={stats.starred}
            icon={<Star className="h-5 w-5" />}
            accent="amber"
            note="Marked as important"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <SectionTitle
              icon={<Filter className="h-4 w-4" />}
              title="Filters"
              description="Search by keyword or narrow the timeline by activity type."
            />

            <div className="space-y-4">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search history..."
                leftIcon={<Search className="h-4 w-4" />}
              />

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">
                  Activity type
                </p>

                <div className="flex flex-wrap gap-2">
                  {typeOptions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setType(item.id)}
                      className={[
                        'rounded-full border px-4 py-2 text-sm font-semibold transition',
                        type === item.id
                          ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
                          : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.06] hover:text-white',
                      ].join(' ')}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">
                  Range
                </p>

                <div className="grid gap-3 md:grid-cols-3">
                  {(['7d', '30d', '90d'] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSelectedRange(item)}
                      className={[
                        'rounded-2xl border px-4 py-3 text-sm font-semibold transition',
                        selectedRange === item
                          ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                          : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.06] hover:text-white',
                      ].join(' ')}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-cyan-400/15 bg-cyan-400/10 p-4">
                <p className="text-sm leading-7 text-white/75">
                  History helps you monitor streaks, exam consistency, and where your study time is going.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={clearFilters}>
                  Reset filters
                </Button>
                <Button>
                  Export history
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-cyan-100">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-sm font-semibold">Activity timeline</span>
                </div>
                <p className="mt-2 text-sm leading-7 text-white/55">
                  Recent actions within the last {selectedRange}.
                </p>
              </div>

              <Badge variant="secondary">{filteredItems.length} items</Badge>
            </div>

            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-100" />
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="space-y-4">
                {filteredItems.map((item, index) => (
                  <HistoryCard
                    key={item.id}
                    item={item}
                    onToggleStar={toggleStar}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10">
                <XCircle className="h-12 w-12 text-white/30" />
                <h3 className="mt-4 text-xl font-bold">
                  No history found
                </h3>
                <p className="mt-2 text-sm text-white/55">
                  Search terms or activity filters adjust করুন।
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Achievements"
            value={stats.achievements}
            icon={<Trophy className="h-5 w-5" />}
            accent="fuchsia"
            note="Unlocked milestones"
          />
          <StatCard
            title="Premium Events"
            value={stats.premium}
            icon={<Crown className="h-5 w-5" />}
            accent="amber"
            note="Premium-only or boosted"
          />
          <StatCard
            title="AI Sessions"
            value={stats.ai}
            icon={<Wand2 className="h-5 w-5" />}
            accent="cyan"
            note="Assistant-assisted actions"
          />
          <StatCard
            title="Verified Activity"
            value="98%"
            icon={<ShieldCheck className="h-5 w-5" />}
            accent="emerald"
            note="Tracked with secure logs"
          />
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-100">
                <Users className="h-4 w-4" />
                <span className="text-sm font-semibold">Activity insights</span>
              </div>
              <p className="mt-2 text-sm leading-7 text-white/55">
                Practice and AI usage are currently the strongest signals in your learning pattern.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="success">Consistent</Badge>
              <Badge variant="premium">Smart learning</Badge>
              <Badge variant="secondary">Upward trend</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
