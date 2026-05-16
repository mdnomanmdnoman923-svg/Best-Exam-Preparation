// bep-full-project/src/features/admin/components/AdminStats.tsx

import React from 'react';
import {
  BarChart3,
  BookOpen,
  Brain,
  FileQuestion,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';

type StatItem = {
  id: string;
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
};

const stats: StatItem[] = [
  {
    id: 'students',
    title: 'Active Students',
    value: '42,580',
    change: '+12.4%',
    positive: true,
    icon: <Users className="h-6 w-6" />,
  },
  {
    id: 'questions',
    title: 'Question Bank',
    value: '125K+',
    change: '+8.2%',
    positive: true,
    icon: <FileQuestion className="h-6 w-6" />,
  },
  {
    id: 'subjects',
    title: 'Subjects',
    value: '38',
    change: '+3 New',
    positive: true,
    icon: <BookOpen className="h-6 w-6" />,
  },
  {
    id: 'ai',
    title: 'AI Sessions',
    value: '89K',
    change: '+22%',
    positive: true,
    icon: <Brain className="h-6 w-6" />,
  },
];

export default function AdminStats() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl transition duration-300 hover:border-cyan-400/20 hover:bg-white/[0.06]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.10),transparent_30%)]" />

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white/55">
                  {stat.title}
                </p>

                <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
                  {stat.value}
                </h3>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-200">
                {stat.icon}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <div
                className={[
                  'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold',
                  stat.positive
                    ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                    : 'border-red-400/20 bg-red-400/10 text-red-100',
                ].join(' ')}
              >
                <TrendingUp className="h-3.5 w-3.5" />
                {stat.change}
              </div>

              <span className="text-xs text-white/40">
                গত ৩০ দিনের তুলনায়
              </span>
            </div>
          </div>
        </div>
      ))}

      <div className="relative overflow-hidden rounded-3xl border border-amber-400/15 bg-gradient-to-br from-amber-400/10 to-fuchsia-500/10 p-6 md:col-span-2 xl:col-span-4">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-yellow-100">
              <Trophy className="h-8 w-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">
                BEP Growth Analytics
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/70">
                Platform engagement, AI learning sessions এবং premium conversion
                rate দ্রুত বৃদ্ধি পাচ্ছে।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cyan-200" />

                <span className="text-sm font-semibold text-white">
                  +38% Engagement
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-fuchsia-200" />

                <span className="text-sm font-semibold text-white">
                  AI Usage ↑
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
