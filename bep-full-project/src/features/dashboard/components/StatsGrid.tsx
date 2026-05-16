// bep-full-project/src/features/dashboard/components/StatsGrid.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Brain,
  BookOpen,
  FileQuestion,
  Flame,
  GraduationCap,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';

export interface StatCardItem {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon: React.ReactNode;
  description?: string;
  badge?: string;
  accent?: 'cyan' | 'fuchsia' | 'emerald' | 'amber' | 'violet';
}

export interface StatsGridProps {
  stats?: StatCardItem[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
}

const defaultStats: StatCardItem[] = [
  {
    id: 'total-students',
    title: 'Active Students',
    value: '42.8K',
    change: '+12.4%',
    positive: true,
    icon: <Users className="h-6 w-6" />,
    description: 'গত ৩০ দিনে active learning users',
    badge: 'Growth',
    accent: 'cyan',
  },
  {
    id: 'total-questions',
    title: 'Question Bank',
    value: '125K+',
    change: '+8.2%',
    positive: true,
    icon: <FileQuestion className="h-6 w-6" />,
    description: 'MCQ, SQ এবং CQ practice questions',
    badge: 'Content',
    accent: 'fuchsia',
  },
  {
    id: 'ai-sessions',
    title: 'AI Sessions',
    value: '89K',
    change: '+22%',
    positive: true,
    icon: <Brain className="h-6 w-6" />,
    description: 'Bengali-first AI tutor interactions',
    badge: 'AI',
    accent: 'violet',
  },
  {
    id: 'mock-exams',
    title: 'Mock Exams',
    value: '18.4K',
    change: '+15.1%',
    positive: true,
    icon: <GraduationCap className="h-6 w-6" />,
    description: 'Completed timed exam attempts',
    badge: 'Exams',
    accent: 'emerald',
  },
  {
    id: 'streak-days',
    title: 'Streak Days',
    value: '7.2K',
    change: '+10.8%',
    positive: true,
    icon: <Flame className="h-6 w-6" />,
    description: 'Learners maintaining daily streaks',
    badge: 'Retention',
    accent: 'amber',
  },
  {
    id: 'premium-users',
    title: 'Premium Users',
    value: '9.6K',
    change: '+18.5%',
    positive: true,
    icon: <Trophy className="h-6 w-6" />,
    description: 'Subscribed to BEP premium plans',
    badge: 'Revenue',
    accent: 'cyan',
  },
];

function getAccentClasses(accent: NonNullable<StatCardItem['accent']>) {
  switch (accent) {
    case 'fuchsia':
      return {
        container:
          'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100',
        glow:
          'group-hover:shadow-fuchsia-500/10',
        gradient:
          'from-fuchsia-500/15 via-fuchsia-500/8 to-transparent',
      };
    case 'emerald':
      return {
        container:
          'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
        glow:
          'group-hover:shadow-emerald-500/10',
        gradient:
          'from-emerald-500/15 via-emerald-500/8 to-transparent',
      };
    case 'amber':
      return {
        container:
          'border-amber-400/15 bg-amber-400/10 text-amber-100',
        glow:
          'group-hover:shadow-amber-500/10',
        gradient:
          'from-amber-500/15 via-amber-500/8 to-transparent',
      };
    case 'violet':
      return {
        container:
          'border-violet-400/15 bg-violet-400/10 text-violet-100',
        glow:
          'group-hover:shadow-violet-500/10',
        gradient:
          'from-violet-500/15 via-violet-500/8 to-transparent',
      };
    case 'cyan':
    default:
      return {
        container:
          'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
        glow:
          'group-hover:shadow-cyan-500/10',
        gradient:
          'from-cyan-500/15 via-cyan-500/8 to-transparent',
      };
  }
}

export default function StatsGrid({
  stats = defaultStats,
  loading = false,
  title = 'Performance Overview',
  subtitle = 'আপনার platform growth এবং learning metrics এক জায়গায় দেখুন',
  className = '',
}: StatsGridProps) {
  return (
    <section className={className}>
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_20px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl">
        <div className="relative overflow-hidden border-b border-white/10 p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                <Sparkles className="h-3.5 w-3.5" />
                BEP Analytics
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white">
                {title}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="premium">Live Metrics</Badge>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                <ArrowUpRight className="h-4 w-4" />
                Real-time Growth
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? [...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-44 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04]"
                />
              ))
            : stats.map((stat, index) => {
                const accent = getAccentClasses(stat.accent || 'cyan');

                return (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    whileHover={{ y: -4 }}
                    className={[
                      'group relative overflow-hidden rounded-[28px] border border-white/10',
                      'bg-[#08111F]/80 p-5 backdrop-blur-xl',
                      'transition-all duration-300 hover:border-cyan-400/20',
                      'hover:bg-white/[0.05] hover:shadow-[0_16px_50px_rgba(0,0,0,0.24)]',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        'absolute inset-0 bg-gradient-to-br opacity-100',
                        accent.gradient,
                      ].join(' ')}
                    />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          {stat.badge ? (
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
                              {stat.badge}
                            </div>
                          ) : null}

                          <p className="text-sm font-medium text-white/55">
                            {stat.title}
                          </p>

                          <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
                            {stat.value}
                          </h3>
                        </div>

                        <div
                          className={[
                            'flex h-14 w-14 items-center justify-center rounded-3xl border',
                            accent.container,
                            'shadow-lg transition duration-300',
                            accent.glow,
                          ].join(' ')}
                        >
                          {stat.icon}
                        </div>
                      </div>

                      {stat.description ? (
                        <p className="mt-4 text-sm leading-6 text-white/60">
                          {stat.description}
                        </p>
                      ) : null}

                      <div className="mt-5 flex items-center gap-2">
                        {stat.change ? (
                          <div
                            className={[
                              'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold',
                              stat.positive
                                ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                                : 'border-red-400/20 bg-red-400/10 text-red-100',
                            ].join(' ')}
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                            {stat.change}
                          </div>
                        ) : null}

                        <span className="text-xs text-white/40">
                          গত ৩০ দিনের তুলনায়
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
