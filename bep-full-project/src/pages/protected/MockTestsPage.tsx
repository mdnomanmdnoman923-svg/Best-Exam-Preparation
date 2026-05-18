// bep-full-project/src/pages/protected/MockTestsPage.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Clock3,
  Crown,
  Filter,
  Flame,
  Layers3,
  Loader2,
  PlayCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Wand2,
  XCircle,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type MockTestStatus = 'upcoming' | 'live' | 'completed';
type MockTestDifficulty = 'easy' | 'medium' | 'hard';
type MockTestType = 'topic' | 'full' | 'weekly' | 'custom';

interface MockTestItem {
  id: string;
  title: string;
  description: string;
  subject: string;
  chapter?: string;
  type: MockTestType;
  status: MockTestStatus;
  difficulty: MockTestDifficulty;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  attemptedUsers: number;
  averageScore: number;
  premium?: boolean;
  featured?: boolean;
  locked?: boolean;
  bookmarked?: boolean;
  createdAt: string;
}

const seedMockTests: MockTestItem[] = [
  {
    id: 'mock-1',
    title: 'Physics Motion & Force Mock',
    description:
      'HSC-level mock test covering speed, velocity, acceleration, force, and Newton laws.',
    subject: 'Physics',
    chapter: 'Motion and Force',
    type: 'topic',
    status: 'live',
    difficulty: 'medium',
    durationMinutes: 45,
    totalQuestions: 25,
    totalMarks: 50,
    attemptedUsers: 1240,
    averageScore: 38,
    premium: false,
    featured: true,
    locked: false,
    bookmarked: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Higher Math Chapter Sprint',
    description:
      'Algebra, quadratic equations, and sequence practice for fast revision.',
    subject: 'Mathematics',
    chapter: 'Higher Math',
    type: 'weekly',
    status: 'upcoming',
    difficulty: 'hard',
    durationMinutes: 60,
    totalQuestions: 30,
    totalMarks: 60,
    attemptedUsers: 820,
    averageScore: 29,
    premium: true,
    featured: true,
    locked: false,
    bookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Chemistry Full Mock Test',
    description:
      'Atomic structure, periodic table, chemical reaction, and bonding consolidated exam.',
    subject: 'Chemistry',
    chapter: 'Full Syllabus',
    type: 'full',
    status: 'completed',
    difficulty: 'hard',
    durationMinutes: 90,
    totalQuestions: 50,
    totalMarks: 100,
    attemptedUsers: 4100,
    averageScore: 63,
    premium: true,
    featured: false,
    locked: false,
    bookmarked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'mock-4',
    title: 'English Grammar Practice Set',
    description:
      'Tense, voice, narration, sentence correction, and vocabulary mixed test.',
    subject: 'English',
    chapter: 'Grammar',
    type: 'custom',
    status: 'upcoming',
    difficulty: 'easy',
    durationMinutes: 30,
    totalQuestions: 20,
    totalMarks: 20,
    attemptedUsers: 560,
    averageScore: 15,
    premium: false,
    featured: false,
    locked: true,
    bookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'mock-5',
    title: 'Biology Weekly Challenge',
    description:
      'Cell biology, photosynthesis, and human physiology questions in a weekly challenge format.',
    subject: 'Biology',
    chapter: 'Weekly Challenge',
    type: 'weekly',
    status: 'live',
    difficulty: 'medium',
    durationMinutes: 40,
    totalQuestions: 22,
    totalMarks: 44,
    attemptedUsers: 910,
    averageScore: 34,
    premium: true,
    featured: true,
    locked: false,
    bookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

const typeLabels: Record<MockTestType, string> = {
  topic: 'Topic',
  full: 'Full',
  weekly: 'Weekly',
  custom: 'Custom',
};

const statusLabels: Record<MockTestStatus, string> = {
  upcoming: 'Upcoming',
  live: 'Live',
  completed: 'Completed',
};

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatRelativeTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function statusVariant(status: MockTestStatus) {
  switch (status) {
    case 'live':
      return 'success' as const;
    case 'upcoming':
      return 'warning' as const;
    case 'completed':
      return 'secondary' as const;
    default:
      return 'secondary' as const;
  }
}

function difficultyVariant(level: MockTestDifficulty) {
  switch (level) {
    case 'easy':
      return 'success' as const;
    case 'medium':
      return 'warning' as const;
    case 'hard':
      return 'danger' as const;
    default:
      return 'secondary' as const;
  }
}

function typeVariant(type: MockTestType) {
  switch (type) {
    case 'topic':
      return 'secondary' as const;
    case 'full':
      return 'premium' as const;
    case 'weekly':
      return 'success' as const;
    case 'custom':
      return 'warning' as const;
    default:
      return 'secondary' as const;
  }
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

        <div className={['flex h-14 w-14 items-center justify-center rounded-2xl border', accentMap[accent]].join(' ')}>
          {icon}
        </div>
      </div>
    </div>
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

function MiniMetric({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#08111F]/70 p-4">
      <div className="flex items-center gap-2 text-cyan-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">{title}</p>
          <h4 className="mt-1 text-lg font-bold text-white">{value}</h4>
        </div>
      </div>
    </div>
  );
}

function MockTestCard({
  item,
  onBookmark,
  onStart,
}: {
  item: MockTestItem;
  onBookmark: (id: string) => void;
  onStart: (id: string) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant={typeVariant(item.type)}>{typeLabels[item.type]}</Badge>
            <Badge variant={statusVariant(item.status)}>{statusLabels[item.status]}</Badge>
            <Badge
              variant={
                item.difficulty === 'easy'
                  ? 'success'
                  : item.difficulty === 'medium'
                    ? 'warning'
                    : 'danger'
              }
            >
              {item.difficulty}
            </Badge>
            {item.premium ? <Badge variant="premium">Premium</Badge> : null}
            {item.featured ? <Badge variant="success">Featured</Badge> : null}
            {item.locked ? <Badge variant="danger">Locked</Badge> : null}
            {item.bookmarked ? <Badge variant="secondary">Saved</Badge> : null}
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-white">{item.title}</h3>

          <p className="mt-3 text-sm leading-7 text-white/65">{item.description}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-cyan-100" />
              {item.subject}
            </div>

            {item.chapter ? (
              <div className="flex items-center gap-2">
                <Layers3 className="h-4 w-4 text-emerald-100" />
                {item.chapter}
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-fuchsia-100" />
              {item.durationMinutes} min
            </div>

            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-amber-100" />
              {item.totalQuestions} questions
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:min-w-[220px]">
          <Button
            onClick={() => onStart(item.id)}
            leftIcon={<PlayCircle className="h-4 w-4" />}
          >
            Start Test
          </Button>

          <Button
            variant="secondary"
            onClick={() => onBookmark(item.id)}
            leftIcon={<Star className="h-4 w-4" />}
          >
            {item.bookmarked ? 'Unsave' : 'Save'}
          </Button>

          <Button variant="secondary" leftIcon={<ArrowRight className="h-4 w-4" />}>
            View Details
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <MiniMetric title="Total marks" value={item.totalMarks} icon={<Trophy className="h-4 w-4" />} />
        <MiniMetric title="Attempts" value={formatNumber(item.attemptedUsers)} icon={<Users className="h-4 w-4" />} />
        <MiniMetric title="Avg score" value={`${item.averageScore}%`} icon={<BadgeCheck className="h-4 w-4" />} />
        <MiniMetric title="Created" value={formatRelativeTime(item.createdAt)} icon={<Clock3 className="h-4 w-4" />} />
      </div>
    </motion.article>
  );
}

function ActionCard({
  title,
  description,
  icon,
  actionLabel,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel: string;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[#08111F]/75 p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.06]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-100">
          {icon}
        </div>

        <div className="inline-flex items-center gap-1 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">
          <ArrowRight className="h-3.5 w-3.5" />
          {actionLabel}
        </div>
      </div>

      <h4 className="mt-4 text-lg font-semibold text-white">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
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
      {label}
    </button>
  );
}

export default function MockTestsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | MockTestType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | MockTestStatus>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | MockTestDifficulty>('all');
  const [loading] = useState(false);
  const [tests, setTests] = useState<MockTestItem[]>(seedMockTests);

  const stats = useMemo(() => {
    return {
      total: tests.length,
      live: tests.filter((item) => item.status === 'live').length,
      upcoming: tests.filter((item) => item.status === 'upcoming').length,
      completed: tests.filter((item) => item.status === 'completed').length,
      premium: tests.filter((item) => item.premium).length,
      bookmarked: tests.filter((item) => item.bookmarked).length,
    };
  }, [tests]);

  const filteredTests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tests
      .filter((item) => {
        const matchesSearch =
          !query ||
          [
            item.title,
            item.description,
            item.subject,
            item.chapter,
            item.type,
            item.status,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query);

        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const matchesDifficulty =
          difficultyFilter === 'all' || item.difficulty === difficultyFilter;

        return matchesSearch && matchesType && matchesStatus && matchesDifficulty;
      })
      .sort((a, b) => {
        const weight = (item: MockTestItem) => {
          let score = 0;
          if (item.status === 'live') score += 100;
          if (item.featured) score += 20;
          if (item.premium) score += 10;
          if (item.bookmarked) score += 5;
          return score;
        };

        return weight(b) - weight(a);
      });
  }, [difficultyFilter, search, statusFilter, tests, typeFilter]);

  const toggleBookmark = (id: string) => {
    setTests((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, bookmarked: !item.bookmarked } : item,
      ),
    );
  };

  const startTest = (id: string) => {
    const selected = tests.find((item) => item.id === id);
    if (!selected) return;
    window.alert(`Starting demo test: ${selected.title}`);
  };

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setStatusFilter('all');
    setDifficultyFilter('all');
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
                  BEP Practice Arena
                </div>

                <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                  Mock Tests
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  Subject-wise mock exam, weekly challenge, and full-syllabus practice এক জায়গায়।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  Secure
                </Badge>
                <Badge variant="premium">
                  <Crown className="mr-1 h-3.5 w-3.5" />
                  Premium Ready
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Tests"
            value={stats.total}
            icon={<BookOpen className="h-5 w-5" />}
            accent="cyan"
            note="Available mock tests"
          />
          <StatCard
            title="Live"
            value={stats.live}
            icon={<PlayCircle className="h-5 w-5" />}
            accent="emerald"
            note="Currently active"
          />
          <StatCard
            title="Upcoming"
            value={stats.upcoming}
            icon={<Clock3 className="h-5 w-5" />}
            accent="amber"
            note="Coming soon"
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircle2 className="h-5 w-5" />}
            accent="fuchsia"
            note="Published results"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <SectionTitle
              icon={<Filter className="h-4 w-4" />}
              title="Filters"
              description="Search এবং filters ব্যবহার করে mock tests দ্রুত খুঁজে নিন।"
            />

            <div className="space-y-4">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tests..."
                leftIcon={<Search className="h-4 w-4" />}
              />

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">
                  Type
                </p>

                <div className="flex flex-wrap gap-2">
                  {(['all', 'topic', 'full', 'weekly', 'custom'] as const).map((item) => (
                    <FilterChip
                      key={item}
                      label={item === 'all' ? 'All' : typeLabels[item]}
                      active={typeFilter === item}
                      onClick={() => setTypeFilter(item)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">
                  Status
                </p>

                <div className="flex flex-wrap gap-2">
                  {(['all', 'upcoming', 'live', 'completed'] as const).map((item) => (
                    <FilterChip
                      key={item}
                      label={item === 'all' ? 'All' : statusLabels[item]}
                      active={statusFilter === item}
                      onClick={() => setStatusFilter(item)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">
                  Difficulty
                </p>

                <div className="flex flex-wrap gap-2">
                  {(['all', 'easy', 'medium', 'hard'] as const).map((item) => (
                    <FilterChip
                      key={item}
                      label={item === 'all' ? 'All' : item}
                      active={difficultyFilter === item}
                      onClick={() => setDifficultyFilter(item)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={clearFilters}>
                  Reset filters
                </Button>
                <Button>
                  Create mock test
                </Button>
              </div>
            </div>

            <div className="mt-6 rounded-[26px] border border-cyan-400/15 bg-cyan-400/10 p-4">
              <p className="text-sm leading-7 text-white/75">
                Mock tests help learners prepare with realistic exam timing, scoring, and difficulty balance.
              </p>
            </div>

            <div className="mt-6 rounded-[30px] border border-white/10 bg-[#08111F]/75 p-5">
              <div className="mb-4 flex items-center gap-2 text-cyan-100">
                <Wand2 className="h-4 w-4" />
                <span className="text-sm font-semibold">Quick tools</span>
              </div>

              <div className="grid gap-3">
                <ActionCard
                  title="Build a new exam"
                  description="Create a subject-wise or full-syllabus mock."
                  icon={<Plus className="h-5 w-5" />}
                  actionLabel="Create"
                />
                <ActionCard
                  title="Duplicate test"
                  description="Clone an existing test with one click."
                  icon={<Layers3 className="h-5 w-5" />}
                  actionLabel="Duplicate"
                />
                <ActionCard
                  title="View analytics"
                  description="Check attempts, scores, and completion trends."
                  icon={<Trophy className="h-5 w-5" />}
                  actionLabel="View"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-cyan-100">
                  <Layers3 className="h-4 w-4" />
                  <span className="text-sm font-semibold">Mock test list</span>
                </div>
                <p className="mt-2 text-sm leading-7 text-white/55">
                  Sorted by relevance, live status, and engagement.
                </p>
              </div>

              <Badge variant="secondary">{filteredTests.length} tests</Badge>
            </div>

            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-100" />
              </div>
            ) : filteredTests.length > 0 ? (
              <div className="space-y-4">
                {filteredTests.map((item) => (
                  <MockTestCard
                    key={item.id}
                    item={item}
                    onBookmark={toggleBookmark}
                    onStart={startTest}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10">
                <XCircle className="h-12 w-12 text-white/30" />
                <h3 className="mt-4 text-xl font-bold">No mock tests found</h3>
                <p className="mt-2 text-sm text-white/55">
                  Filters change করুন বা নতুন test তৈরি করুন।
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Premium Tests"
            value={stats.premium}
            icon={<Crown className="h-5 w-5" />}
            accent="fuchsia"
            note="Locked / premium content"
          />
          <StatCard
            title="Bookmarked"
            value={stats.bookmarked}
            icon={<Star className="h-5 w-5" />}
            accent="amber"
            note="Saved for quick access"
          />
          <StatCard
            title="Average Score"
            value={`${Math.round(tests.reduce((sum, item) => sum + item.averageScore, 0) / tests.length)}%`}
            icon={<Target className="h-5 w-5" />}
            accent="emerald"
            note="Across all mock tests"
          />
          <StatCard
            title="Live Engagement"
            value="High"
            icon={<Flame className="h-5 w-5" />}
            accent="cyan"
            note="Strong active participation"
          />
        </div>
      </div>
    </div>
  );
}
