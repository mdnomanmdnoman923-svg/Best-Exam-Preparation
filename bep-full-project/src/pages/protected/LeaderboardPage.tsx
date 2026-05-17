// bep-full-project/src/pages/protected/LeaderboardPage.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Crown,
  Flame,
  Filter,
  Loader2,
  Medal,
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

type LeaderboardScope =
  | 'global'
  | 'weekly'
  | 'monthly'
  | 'class';

interface LeaderboardUserItem {
  id: string;
  rank: number;
  name: string;
  username?: string;
  avatar?: string;
  role?: string;
  points: number;
  accuracy: number;
  streak: number;
  exams: number;
  practice: number;
  premium?: boolean;
  verified?: boolean;
  trending?: boolean;
  className?: string;
  subject?: string;
}

const seedUsers: LeaderboardUserItem[] = [
  {
    id: 'u-1',
    rank: 1,
    name: 'Admin Root',
    username: 'adminroot',
    avatar: 'https://i.pravatar.cc/200?img=5',
    role: 'Admin',
    points: 9820,
    accuracy: 96,
    streak: 31,
    exams: 48,
    practice: 820,
    premium: true,
    verified: true,
    trending: true,
    className: 'Super Admin',
    subject: 'All Subjects',
  },
  {
    id: 'u-2',
    rank: 2,
    name: 'Arafat Hossain',
    username: 'arafat',
    avatar: 'https://i.pravatar.cc/200?img=12',
    role: 'Student',
    points: 8740,
    accuracy: 94,
    streak: 24,
    exams: 41,
    practice: 711,
    premium: true,
    verified: true,
    trending: true,
    className: 'HSC 2nd Year',
    subject: 'Physics',
  },
  {
    id: 'u-3',
    rank: 3,
    name: 'Nusrat Jahan',
    username: 'nusratj',
    avatar: 'https://i.pravatar.cc/200?img=32',
    role: 'Student',
    points: 8035,
    accuracy: 92,
    streak: 19,
    exams: 36,
    practice: 654,
    premium: false,
    verified: true,
    trending: false,
    className: 'HSC 1st Year',
    subject: 'Mathematics',
  },
  {
    id: 'u-4',
    rank: 4,
    name: 'Sabbir Rahman',
    username: 'sabbir_mod',
    avatar: 'https://i.pravatar.cc/200?img=48',
    role: 'Moderator',
    points: 7620,
    accuracy: 90,
    streak: 21,
    exams: 29,
    practice: 540,
    premium: true,
    verified: true,
    trending: false,
    className: 'Moderator',
    subject: 'Community',
  },
  {
    id: 'u-5',
    rank: 5,
    name: 'Mim Akter',
    username: 'mimakter',
    avatar: 'https://i.pravatar.cc/200?img=41',
    role: 'Student',
    points: 7210,
    accuracy: 91,
    streak: 16,
    exams: 34,
    practice: 602,
    premium: false,
    verified: true,
    trending: true,
    className: 'Admission',
    subject: 'English',
  },
  {
    id: 'u-6',
    rank: 6,
    name: 'Sakib Hasan',
    username: 'sakibh',
    avatar: 'https://i.pravatar.cc/200?img=18',
    role: 'Student',
    points: 6985,
    accuracy: 89,
    streak: 11,
    exams: 26,
    practice: 496,
    premium: false,
    verified: false,
    trending: false,
    className: 'HSC 2nd Year',
    subject: 'Chemistry',
  },
  {
    id: 'u-7',
    rank: 7,
    name: 'Tasnিম Ahmed',
    username: 'tasnim',
    avatar: 'https://i.pravatar.cc/200?img=23',
    role: 'Student',
    points: 6550,
    accuracy: 88,
    streak: 9,
    exams: 23,
    practice: 451,
    premium: true,
    verified: true,
    trending: false,
    className: 'College',
    subject: 'Biology',
  },
  {
    id: 'u-8',
    rank: 8,
    name: 'Rafi Islam',
    username: 'rafi_i',
    avatar: 'https://i.pravatar.cc/200?img=11',
    role: 'Student',
    points: 6215,
    accuracy: 86,
    streak: 8,
    exams: 21,
    practice: 418,
    premium: false,
    verified: false,
    trending: false,
    className: 'Class 10',
    subject: 'Mathematics',
  },
];

function scopeLabel(scope: LeaderboardScope) {
  switch (scope) {
    case 'global':
      return 'Global';
    case 'weekly':
      return 'Weekly';
    case 'monthly':
      return 'Monthly';
    case 'class':
      return 'Class';
    default:
      return 'Global';
  }
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
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

function ScopeButton({
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

function Avatar({
  name,
  avatar,
  rank,
}: {
  name: string;
  avatar?: string;
  rank: number;
}) {
  const medal =
    rank === 1
      ? 'from-amber-300 to-yellow-500'
      : rank === 2
        ? 'from-slate-300 to-slate-500'
        : rank === 3
          ? 'from-orange-300 to-amber-600'
          : 'from-cyan-400 to-fuchsia-500';

  return (
    <div className="relative">
      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.04]">
        {avatar ? (
          <img src={avatar} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm font-bold text-cyan-100">
            {name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </span>
        )}
      </div>

      <div
        className={[
          'absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br text-xs font-black text-white shadow-lg',
          medal,
        ].join(' ')}
      >
        {rank}
      </div>
    </div>
  );
}

function RankRow({
  user,
  highlight = false,
}: {
  user: LeaderboardUserItem;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={[
        'rounded-[30px] border p-5 backdrop-blur-xl',
        highlight
          ? 'border-cyan-400/20 bg-cyan-400/10'
          : 'border-white/10 bg-white/[0.04]',
      ].join(' ')}
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar name={user.name} avatar={user.avatar} rank={user.rank} />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-xl font-bold text-white">
                {user.name}
              </h3>

              {user.verified ? (
                <Badge variant="success">
                  <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                  Verified
                </Badge>
              ) : null}

              {user.premium ? <Badge variant="premium">Premium</Badge> : null}

              {user.trending ? <Badge variant="warning">Trending</Badge> : null}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/45">
              {user.username ? <span>@{user.username}</span> : null}
              {user.username ? <span>•</span> : null}
              <span>{user.role || 'Student'}</span>
              {user.className ? <span>•</span> : null}
              {user.className ? <span>{user.className}</span> : null}
              {user.subject ? <span>•</span> : null}
              {user.subject ? <span>{user.subject}</span> : null}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[520px] xl:grid-cols-4">
          <MiniMetric title="Points" value={formatNumber(user.points)} icon={<Trophy className="h-4 w-4" />} />
          <MiniMetric title="Accuracy" value={`${user.accuracy}%`} icon={<Target className="h-4 w-4" />} />
          <MiniMetric title="Streak" value={`${user.streak}d`} icon={<Flame className="h-4 w-4" />} />
          <MiniMetric title="Practice" value={formatNumber(user.practice)} icon={<BookOpen className="h-4 w-4" />} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <DetailPill label="Exams" value={formatNumber(user.exams)} />
        <DetailPill label="Study minutes" value={`${formatNumber(user.practice * 2)} min`} />
        <DetailPill label="Rank change" value={user.rank <= 3 ? 'Top tier' : `#${user.rank}`} />
      </div>
    </motion.div>
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

function DetailPill({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="text-sm text-white/55">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
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

export default function LeaderboardPage() {
  const [scope, setScope] = useState<LeaderboardScope>('weekly');
  const [search, setSearch] = useState('');
  const [loading] = useState(false);

  const stats = useMemo(() => {
    return {
      total: seedUsers.length,
      premium: seedUsers.filter((user) => user.premium).length,
      verified: seedUsers.filter((user) => user.verified).length,
      averageAccuracy:
        Math.round(
          seedUsers.reduce((sum, user) => sum + user.accuracy, 0) / seedUsers.length,
        ) || 0,
      topStreak: Math.max(...seedUsers.map((user) => user.streak)),
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return seedUsers.filter((user) => {
      const matchesSearch =
        !query ||
        [
          user.name,
          user.username,
          user.role,
          user.subject,
          user.className,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query);

      return matchesSearch;
    });
  }, [search]);

  const topThree = filteredUsers.slice(0, 3);
  const rest = filteredUsers.slice(3);

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
                  BEP Rankings
                </div>

                <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                  Leaderboard
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  Streak, accuracy, practice, and overall points অনুযায়ী top learners দেখুন।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  Fair Play
                </Badge>
                <Badge variant="premium">
                  <Crown className="mr-1 h-3.5 w-3.5" />
                  Competitive
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Participants"
            value={stats.total}
            icon={<Users className="h-5 w-5" />}
            accent="cyan"
            note="Users on the board"
          />
          <StatCard
            title="Average Accuracy"
            value={`${stats.averageAccuracy}%`}
            icon={<Target className="h-5 w-5" />}
            accent="emerald"
            note="Across top performers"
          />
          <StatCard
            title="Premium Players"
            value={stats.premium}
            icon={<Crown className="h-5 w-5" />}
            accent="fuchsia"
            note="Premium account holders"
          />
          <StatCard
            title="Best Streak"
            value={`${stats.topStreak}d`}
            icon={<Flame className="h-5 w-5" />}
            accent="amber"
            note="Highest active streak"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <SectionTitle
              icon={<Filter className="h-4 w-4" />}
              title="Leaderboard filters"
              description="Scope নির্বাচন করুন এবং ফলাফল search করুন।"
            />

            <div className="space-y-4">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search learners..."
                leftIcon={<Search className="h-4 w-4" />}
              />

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">
                  Scope
                </p>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {(['global', 'weekly', 'monthly', 'class'] as const).map((item) => (
                    <ScopeButton
                      key={item}
                      label={scopeLabel(item)}
                      active={scope === item}
                      onClick={() => setScope(item)}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-cyan-400/15 bg-cyan-400/10 p-4">
                <p className="text-sm leading-7 text-white/75">
                  {scopeLabel(scope)} ranking updates regularly based on practice activity, exam score, and consistency.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-cyan-100">
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm font-semibold">
                    {scopeLabel(scope)} Top 3
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-white/55">
                  Leading performers across the current leaderboard scope.
                </p>
              </div>

              <Badge variant="secondary">{filteredUsers.length} users</Badge>
            </div>

            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-100" />
              </div>
            ) : topThree.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                {topThree.map((user, index) => (
                  <TopPodium
                    key={user.id}
                    user={user}
                    position={index + 1}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10">
                <XCircle className="h-12 w-12 text-white/30" />
                <h3 className="mt-4 text-xl font-bold">
                  No users found
                </h3>
                <p className="mt-2 text-sm text-white/55">
                  Search or scope পরিবর্তন করুন।
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-100">
                <Medal className="h-4 w-4" />
                <span className="text-sm font-semibold">Full leaderboard</span>
              </div>
              <p className="mt-2 text-sm leading-7 text-white/55">
                Search results sorted by rank. Use the board to inspect performance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">Transparent</Badge>
              <Badge variant="premium">Reward-ready</Badge>
            </div>
          </div>

          <div className="space-y-4">
            {rest.length > 0 ? (
              rest.map((user) => (
                <RankRow key={user.id} user={user} />
              ))
            ) : (
              <div className="flex min-h-[240px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10">
                <XCircle className="h-12 w-12 text-white/30" />
                <h3 className="mt-4 text-xl font-bold">
                  No leaderboard entries
                </h3>
                <p className="mt-2 text-sm text-white/55">
                  Nothing matched your filters.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Accuracy Standard"
            value="Top 10% must be 90+"
            icon={<BadgeCheck className="h-5 w-5" />}
            accent="emerald"
            note="Quality threshold for highlights"
          />
          <StatCard
            title="Weekly Climb"
            value="+8"
            icon={<ArrowRight className="h-5 w-5" />}
            accent="cyan"
            note="Recent position gain"
          />
          <StatCard
            title="Trending Users"
            value={seedUsers.filter((user) => user.trending).length}
            icon={<Flame className="h-5 w-5" />}
            accent="amber"
            note="High momentum learners"
          />
          <StatCard
            title="Ranked by"
            value="Points + Streak"
            icon={<ShieldCheck className="h-5 w-5" />}
            accent="fuchsia"
            note="Balanced scoring model"
          />
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-100">
                <CalendarDays className="h-4 w-4" />
                <span className="text-sm font-semibold">Ranking insights</span>
              </div>
              <p className="mt-2 text-sm leading-7 text-white/55">
                Daily practice and exam score matter most for upward movement.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Consistency</Badge>
              <Badge variant="success">Accuracy</Badge>
              <Badge variant="premium">Premium boosts</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopPodium({
  user,
  position,
}: {
  user: LeaderboardUserItem;
  position: number;
}) {
  const heightMap = {
    1: 'h-48',
    2: 'h-40',
    3: 'h-32',
  } as const;

  return (
    <div className="flex flex-col items-center">
      <div
        className={[
          'flex w-full flex-col items-center justify-end rounded-[28px] border border-white/10 bg-[#08111F]/75 p-4 backdrop-blur-xl',
          heightMap[position as 1 | 2 | 3] || 'h-40',
        ].join(' ')}
      >
        <Avatar name={user.name} avatar={user.avatar} rank={user.rank} />
        <h4 className="mt-4 text-center text-lg font-bold text-white">{user.name}</h4>
        <p className="mt-1 text-sm text-white/55">
          {formatNumber(user.points)} pts
        </p>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {user.verified ? <Badge variant="success">Verified</Badge> : null}
        {user.premium ? <Badge variant="premium">Premium</Badge> : null}
      </div>
    </div>
  );
}
