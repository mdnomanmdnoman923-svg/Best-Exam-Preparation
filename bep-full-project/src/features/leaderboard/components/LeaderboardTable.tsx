// bep-full-project/src/features/leaderboard/components/LeaderboardTable.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Crown,
  Filter,
  Search,
  Sparkles,
  Star,
  Trophy,
  TrendingUp,
  User2,
  Zap,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  institution?: string;
  points: number;
  rank: number;
  streak?: number;
  premium?: boolean;
  score?: number;
  subject?: string;
  badge?: string;
  completedExams?: number;
  correctAnswers?: number;
  accuracy?: number;
}

export interface LeaderboardTableProps {
  users: LeaderboardUser[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  searchable?: boolean;
  showFilters?: boolean;
  onUserClick?: (userId: string) => void;
  onViewProfile?: (userId: string) => void;
  className?: string;
}

type SortMode = 'rank' | 'points' | 'streak';

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

function getRowAccent(rank: number) {
  if (rank === 1) {
    return {
      border: 'border-amber-400/20',
      bg: 'bg-amber-400/10',
      text: 'text-amber-100',
      badge: 'gold',
    };
  }

  if (rank === 2) {
    return {
      border: 'border-cyan-400/20',
      bg: 'bg-cyan-400/10',
      text: 'text-cyan-100',
      badge: 'default',
    };
  }

  if (rank === 3) {
    return {
      border: 'border-fuchsia-400/20',
      bg: 'bg-fuchsia-400/10',
      text: 'text-fuchsia-100',
      badge: 'premium',
    };
  }

  return {
    border: 'border-white/10',
    bg: 'bg-white/[0.04]',
    text: 'text-white/75',
    badge: 'secondary',
  } as const;
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="h-4 w-4" />;
  if (rank <= 3) return <Trophy className="h-4 w-4" />;
  return <Award className="h-4 w-4" />;
}

export default function LeaderboardTable({
  users,
  title = 'Leaderboard Table',
  subtitle = 'Detailed student performance ranking',
  loading = false,
  searchable = true,
  showFilters = true,
  onUserClick,
  onViewProfile,
  className = '',
}: LeaderboardTableProps) {
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('rank');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  const subjects = useMemo(() => {
    const values = users
      .map((user) => user.subject?.trim())
      .filter(Boolean) as string[];

    return ['all', ...Array.from(new Set(values))];
  }, [users]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    const next = users.filter((user) => {
      const matchesSearch =
        !query ||
        [user.name, user.institution, user.subject, user.badge]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesSubject =
        subjectFilter === 'all' || user.subject === subjectFilter;

      return matchesSearch && matchesSubject;
    });

    const sorted = [...next].sort((a, b) => {
      if (sortMode === 'points') {
        return b.points - a.points;
      }

      if (sortMode === 'streak') {
        return (b.streak || 0) - (a.streak || 0);
      }

      return a.rank - b.rank;
    });

    return sorted;
  }, [search, sortMode, subjectFilter, users]);

  return (
    <section className={className}>
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_20px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl">
        <div className="relative overflow-hidden border-b border-white/10 p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                <Sparkles className="h-3.5 w-3.5" />
                BEP Rankings
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
                {users.length} Students
              </Badge>

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                <TrendingUp className="h-4 w-4" />
                Live Ranking
              </div>
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
                  placeholder="Search students, institution, subject..."
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
            ) : (
              <div />
            )}

            <div className="flex flex-wrap items-center gap-3">
              {showFilters ? (
                <>
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
                    {(['rank', 'points', 'streak'] as SortMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setSortMode(mode)}
                        className={[
                          'rounded-xl px-4 py-2 text-sm font-medium transition capitalize',
                          sortMode === mode
                            ? 'bg-cyan-400/15 text-cyan-100'
                            : 'text-white/55 hover:text-white',
                        ].join(' ')}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
                    <Filter className="h-4 w-4 text-white/45" />
                    <select
                      value={subjectFilter}
                      onChange={(e) => setSubjectFilter(e.target.value)}
                      className="bg-transparent text-sm text-white outline-none"
                    >
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject === 'all' ? 'All Subjects' : subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : null}

              <Button variant="secondary" leftIcon={<ArrowRight className="h-4 w-4" />}>
                View Full Rankings
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-white/[0.03]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                  Subject
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                  Points
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                  Streak
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                  Accuracy
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(8)].map((_, index) => (
                  <tr key={index} className="border-t border-white/5">
                    <td colSpan={7} className="px-6 py-5">
                      <div className="h-16 animate-pulse rounded-2xl bg-white/[0.05]" />
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => {
                  const accent = getRowAccent(user.rank);

                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, delay: index * 0.02 }}
                      className={[
                        'border-t border-white/5 transition hover:bg-white/[0.03]',
                        user.rank <= 3 ? 'bg-white/[0.02]' : '',
                      ].join(' ')}
                    >
                      <td className="px-6 py-5">
                        <div
                          className={[
                            'inline-flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-bold',
                            accent.border,
                            accent.bg,
                            accent.text,
                          ].join(' ')}
                        >
                          {getRankIcon(user.rank)}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <button
                          type="button"
                          onClick={() => onUserClick?.(user.id)}
                          className="group flex items-center gap-4 text-left"
                        >
                          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 text-white/70">
                                <User2 className="h-6 w-6" />
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold text-white transition group-hover:text-cyan-100">
                                {user.name}
                              </h3>

                              {user.premium ? <Badge variant="premium">Premium</Badge> : null}
                              {user.badge ? <Badge variant="success">{user.badge}</Badge> : null}
                            </div>

                            <p className="mt-1 text-xs text-white/45">
                              {user.institution || 'No institution'}
                            </p>
                          </div>
                        </button>
                      </td>

                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-white/70">
                          <Sparkles className="h-3.5 w-3.5 text-cyan-100" />
                          {user.subject || 'General'}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-white">
                          <Zap className="h-4 w-4 text-yellow-200" />
                          <span className="text-sm font-semibold">
                            {formatNumber(user.points)}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/15 bg-orange-400/10 px-3 py-1.5 text-sm font-semibold text-orange-100">
                          <Crown className="h-4 w-4" />
                          {user.streak || 0} day
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-amber-200" />
                          <span className="text-sm font-semibold text-white">
                            {typeof user.accuracy === 'number'
                              ? `${user.accuracy}%`
                              : `${user.score ?? 0}%`}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Button
                          variant="secondary"
                          onClick={() => onViewProfile?.(user.id)}
                          rightIcon={<ArrowRight className="h-4 w-4" />}
                        >
                          Profile
                        </Button>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="mx-auto flex max-w-md flex-col items-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04]">
                        <Trophy className="h-9 w-9 text-white/35" />
                      </div>

                      <h3 className="mt-5 text-xl font-semibold text-white">
                        No rankings found
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-white/55">
                        Search বা filter পরিবর্তন করে আবার চেষ্টা করুন।
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-white/10 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm leading-7 text-white/55">
              Leaderboard updates are based on practice activity, exam performance, and community participation.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="premium">Live Updated</Badge>
              <Badge variant="success">{filteredUsers.length} Visible</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
