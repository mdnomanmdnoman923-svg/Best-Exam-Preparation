// bep-full-project/src/features/dashboard/components/QuickActions.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  BookOpen,
  FileQuestion,
  Flame,
  GraduationCap,
  LayoutDashboard,
  MessageSquareText,
  Sparkles,
  Trophy,
} from 'lucide-react';

import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  premium?: boolean;
  highlighted?: boolean;
  color?: string;
}

export interface QuickActionsProps {
  actions?: QuickActionItem[];
  title?: string;
  subtitle?: string;
  onActionClick?: (actionId: string) => void;
  className?: string;
}

const defaultActions: QuickActionItem[] = [
  {
    id: 'practice',
    title: 'Practice MCQ',
    description: 'Daily smart MCQ practice শুরু করুন',
    icon: <FileQuestion className="h-6 w-6" />,
    highlighted: true,
  },

  {
    id: 'mock-exam',
    title: 'Mock Exam',
    description: 'Real exam environment এ পরীক্ষা দিন',
    icon: <GraduationCap className="h-6 w-6" />,
  },

  {
    id: 'ai-tutor',
    title: 'AI Tutor',
    description: 'বাংলায় AI explanation এবং hints নিন',
    icon: <Brain className="h-6 w-6" />,
    premium: true,
  },

  {
    id: 'leaderboard',
    title: 'Leaderboard',
    description: 'Top students ranking দেখুন',
    icon: <Trophy className="h-6 w-6" />,
  },

  {
    id: 'community',
    title: 'Community',
    description: 'Study discussion এ অংশ নিন',
    icon: <MessageSquareText className="h-6 w-6" />,
  },

  {
    id: 'subjects',
    title: 'Subjects',
    description: 'সব subject এবং chapter explore করুন',
    icon: <BookOpen className="h-6 w-6" />,
  },
];

export default function QuickActions({
  actions = defaultActions,
  title = 'Quick Actions',
  subtitle = 'এক ক্লিকে আপনার learning journey শুরু করুন',
  onActionClick,
  className = '',
}: QuickActionsProps) {
  return (
    <section className={className}>
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_20px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl">
        <div className="relative overflow-hidden border-b border-white/10 p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                <Sparkles className="h-3.5 w-3.5" />
                BEP Dashboard
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white">
                {title}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                <LayoutDashboard className="h-4 w-4" />
                Smart Dashboard
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/15 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-100">
                <Flame className="h-4 w-4" />
                Daily Streak Active
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
          {actions.map((action, index) => (
            <motion.button
              key={action.id}
              type="button"
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.25,
                delay: index * 0.04,
              }}
              whileHover={{
                y: -4,
              }}
              onClick={() =>
                onActionClick?.(action.id)
              }
              className={[
                'group relative overflow-hidden rounded-[28px] border border-white/10',
                'bg-[#08111F]/80 p-5 text-left backdrop-blur-xl',
                'transition-all duration-300 hover:border-cyan-400/20',
                'hover:bg-white/[0.05] hover:shadow-[0_16px_50px_rgba(0,0,0,0.24)]',
                action.highlighted
                  ? 'border-cyan-400/15 bg-cyan-400/[0.06]'
                  : '',
              ].join(' ')}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_30%)] opacity-0 transition duration-300 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={[
                      'flex h-16 w-16 items-center justify-center rounded-3xl border',
                      'border-white/10 bg-white/[0.05] text-cyan-100',
                      'transition duration-300 group-hover:scale-105',
                    ].join(' ')}
                  >
                    {action.icon}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {action.premium ? (
                      <Badge variant="premium">
                        Premium
                      </Badge>
                    ) : null}

                    {action.highlighted ? (
                      <Badge variant="success">
                        Popular
                      </Badge>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="text-xl font-bold tracking-tight text-white transition group-hover:text-cyan-100">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-white/60">
                    {action.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">
                    Open now
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/55 transition duration-300 group-hover:border-cyan-400/20 group-hover:bg-cyan-400/10 group-hover:text-cyan-100">
                    <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="border-t border-white/10 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm leading-7 text-white/55">
              AI-powered personalized learning experience with Bengali-first UX.
            </p>

            <Button
              variant="secondary"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Explore Full Dashboard
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
