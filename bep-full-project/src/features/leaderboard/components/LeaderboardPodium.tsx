// bep-full-project/src/features/leaderboard/components/LeaderboardPodium.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Medal,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

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
}

export interface LeaderboardPodiumProps {
  users: LeaderboardUser[];
  title?: string;
  subtitle?: string;
  onUserClick?: (userId: string) => void;
  onViewAll?: () => void;
  className?: string;
}

type PodiumSlot = {
  rank: number;
  heightClass: string;
  accentClass: string;
  glowClass: string;
  crownClass: string;
  label: string;
};

const podiumSlots: PodiumSlot[] = [
  {
    rank: 2,
    heightClass: 'h-28 md:h-32',
    accentClass: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100',
    glowClass: 'shadow-cyan-500/10',
    crownClass: 'text-cyan-200',
    label: '2nd',
  },
  {
    rank: 1,
    heightClass: 'h-36 md:h-40',
    accentClass: 'border-amber-400/20 bg-amber-400/15 text-amber-100',
    glowClass: 'shadow-amber-500/10',
    crownClass: 'text-yellow-200',
    label: '1st',
  },
  {
    rank: 3,
    heightClass: 'h-24 md:h-28',
    accentClass: 'border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-100',
    glowClass: 'shadow-fuchsia-500/10',
    crownClass: 'text-fuchsia-200',
    label: '3rd',
  },
];

function safeTopThree(users: LeaderboardUser[]) {
  const sorted = [...users].sort((a, b) => a.rank - b.rank);
  return [sorted.find((u) => u.rank === 2), sorted.find((u) => u.rank === 1), sorted.find((u) => u.rank === 3)];
}

function formatPoints(points: number) {
  return new Intl.NumberFormat('en-US').format(points);
}

function PodiumCard({
  user,
  slot,
  onUserClick,
}: {
  user?: LeaderboardUser;
  slot: PodiumSlot;
  onUserClick?: (userId: string) => void;
}) {
  const isEmpty = !user;

  return (
    <motion.button
      type="button"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => user && onUserClick?.(user.id)}
      disabled={isEmpty || !onUserClick}
      className={[
        'group relative flex h-full w-full flex-col items-center justify-end rounded-[32px] border backdrop-blur-2xl transition-all duration-300',
        'overflow-hidden',
        slot.heightClass,
        isEmpty
          ? 'cursor-default border-white/10 bg-white/[0.03] text-white/35'
          : 'border-white/10 bg-white/[0.04] text-white hover:border-cyan-400/20 hover:bg-white/[0.06]',
      ].join(' ')}
    >
      <div
        className={[
          'absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_30%)]',
          isEmpty ? 'opacity-30' : 'opacity-90',
        ].join(' ')}
      />

      <div
        className={[
          'relative z-10 flex w-full flex-1 flex-col items-center justify-end px-4 pb-5 pt-6',
        ].join(' ')}
      >
        <div
          className={[
            'absolute left-1/2 top-4 flex -translate-x-1/2 items-center justify-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em]',
            isEmpty ? 'border-white/10 bg-white/[0.04] text-white/35' : slot.accentClass,
          ].join(' ')}
        >
          {slot.label}
        </div>

        <div
          className={[
            'mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border shadow-lg',
            isEmpty ? 'border-white/10 bg-white/[0.03] text-white/25' : slot.accentClass,
            !isEmpty ? slot.glowClass : '',
          ].join(' ')}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-full w-full rounded-3xl object-cover"
            />
          ) : (
            <div className="text-lg font-bold">
              {user ? user.name.slice(0, 1).toUpperCase() : '?'}
            </div>
          )}
        </div>

        <div className="w-full text-center">
          <h3 className="truncate text-xl font-bold tracking-tight text-white">
            {user?.name || '—'}
          </h3>

          {user?.institution ? (
            <p className="mt-1 truncate text-xs text-white/50">
              {user.institution}
            </p>
          ) : (
            <p className="mt-1 text-xs text-white/40">No podium entry</p>
          )}
        </div>

        <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-2">
          {user?.premium ? <Badge variant="premium">Premium</Badge> : null}
          {user?.badge ? <Badge variant="success">{user.badge}</Badge> : null}
          {typeof user?.streak === 'number' && user.streak > 0 ? (
            <Badge variant="warning" dot>
              {user.streak} Day Streak
            </Badge>
          ) : null}
        </div>

        <div className="mt-5 grid w-full grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-center backdrop-blur-xl">
            <div className="flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/40">
              <Trophy className="h-3.5 w-3.5" />
              Points
            </div>
            <p className="mt-2 text-lg font-bold text-white">
              {user ? formatPoints(user.points) : '—'}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-center backdrop-blur-xl">
            <div className="flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/40">
              <Star className="h-3.5 w-3.5" />
              Rank
            </div>
            <p className="mt-2 text-lg font-bold text-white">
              {user?.rank ? `#${user.rank}` : '—'}
            </p>
          </div>
        </div>

        <div className="mt-5 flex w-full items-center justify-center gap-2 text-sm text-white/50">
          <Zap className={['h-4 w-4', slot.crownClass].join(' ')} />
          {user ? `Top performer in ${user.subject || 'BEP'}` : 'Awaiting ranking data'}
        </div>
      </div>
    </motion.button>
  );
}

export default function LeaderboardPodium({
  users,
  title = 'Leaderboard Podium',
  subtitle = 'Top performers in BEP ranking system',
  onUserClick,
  onViewAll,
  className = '',
}: LeaderboardPodiumProps) {
  const [second, first, third] = safeTopThree(users);

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
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/15 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-100">
                <Crown className="h-4 w-4" />
                Top 3 Podium
              </div>

              {onViewAll ? (
                <Button variant="secondary" onClick={onViewAll}>
                  View All
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 lg:grid-cols-3">
          <PodiumCard user={second} slot={podiumSlots[0]} onUserClick={onUserClick} />
          <PodiumCard user={first} slot={podiumSlots[1]} onUserClick={onUserClick} />
          <PodiumCard user={third} slot={podiumSlots[2]} onUserClick={onUserClick} />
        </div>

        <div className="border-t border-white/10 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 text-sm text-white/55">
              <Medal className="h-4 w-4 text-cyan-100" />
              <span>
                Rankings are updated from learning activity, mock exams, and community contribution.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="premium">Live Updated</Badge>
              <Badge variant="success">{users.length} Students</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
