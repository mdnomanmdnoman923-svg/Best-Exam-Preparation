// bep-full-project/src/pages/protected/DashboardPage.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock3,
  Crown,
  Flame,
  GraduationCap,
  Layers3,
  LineChart,
  Loader2,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Wand2,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface DashboardStat {
  title: string;
  value: string | number;
  delta: string;
  icon: React.ReactNode;
  accent?: 'cyan' | 'emerald' | 'amber' | 'fuchsia' | 'violet';
}

interface RecentActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'premium';
}

interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel: string;
}

interface SubjectProgressItem {
  id: string;
  name: string;
  chapterCount: number;
  questionCount: number;
  progress: number;
  premium?: boolean;
  trending?: boolean;
  icon: React.ReactNode;
}

const seedActivities: RecentActivityItem[] = [
  {
    id: 'act-1',
    title: 'Practice session completed',
    description: 'You finished 24 MCQs with 87% accuracy in Physics.',
    time: '2 min ago',
    type: 'success',
  },
  {
    id: 'act-2',
    title: 'Leaderboard position improved',
    description: 'You moved up 8 positions this week.',
    time: '14 min ago',
    type: 'premium',
  },
  {
    id: 'act-3',
    title: 'Weak topic detected',
    description: 'Algebra equations need more revision based on your last attempts.',
    time: '1 hour ago',
    type: 'warning',
  },
  {
    id: 'act-4',
    title: 'AI assistant used',
    description: 'Your study assistant answered 5 question explanations today.',
    time: '3 hours ago',
    type: 'info',
  },
];

const quickActions: QuickActionItem[] = [
  {
    id: 'qa-1',
    title: 'Start practice',
    description: 'Resume your next practice set',
    icon: <Target className="h-5 w-5" />,
    actionLabel: 'Practice',
  },
  {
    id: 'qa-2',
    title: 'Open AI assistant',
    description: 'Ask a question or generate a quiz',
    icon: <Brain className="h-5 w-5" />,
    actionLabel: 'Ask AI',
  },
  {
    id: 'qa-3',
    title: 'View progress',
    description: 'Check your overall learning analytics',
    icon: <LineChart className="h-5 w-5" />,
    actionLabel: 'View',
  },
  {
    id: 'qa-4',
    title: 'Join community',
    description: 'Discuss with other learners',
    icon: <MessageCircle className="h-5 w-5" />,
    actionLabel: 'Open',
  },
];

const subjectProgress: SubjectProgressItem[] = [
  {
    id: 'sub-1',
    name: 'Mathematics',
    chapterCount: 18,
    questionCount: 3200,
    progress: 82,
    premium: true,
    trending: true,
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: 'sub-2',
    name: 'Physics',
    chapterCount: 14,
    questionCount: 2500,
    progress: 91,
    premium: false,
    trending: true,
    icon: <Brain className="h-5 w-5" />,
  },
  {
    id: 'sub-3',
    name: 'English',
    chapterCount: 10,
    questionCount: 980,
    progress: 65,
    premium: false,
    trending: false,
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    id: 'sub-4',
    name: 'Chemistry',
    chapterCount: 12,
    questionCount: 1680,
    progress: 74,
    premium: true,
    trending: false,
    icon: <Layers3 className="h-5 w-5" />,
  },
];

function StatCard({
  title,
  value,
  delta,
  icon,
  accent = 'cyan',
}: DashboardStat) {
  const accentMap = {
    cyan: 'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
    emerald: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
    amber: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
    fuchsia: 'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100',
    violet: 'border-violet-400/15 bg-violet-400/10 text-violet-100',
  } as const;

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-white/55">{title}</p>
          <h3 className="mt-2 text-4xl font-black tracking-tight text-white">{value}</h3>
          <p className="mt-2 text-sm text-emerald-100">{delta}</p>
        </div>

        <div
          className={['flex h-14 w-14 items-center justify-center rounded-2xl border', accentMap[accent]].join(' ')}
        >
          {icon}
        </div>
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
    <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-cyan-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">{title}</p>
          <h4 className="mt-1 text-2xl font-bold text-white">{value}</h4>
        </div>
      </div>
    </div>
  );
}

function ActivityBadge({ type }: { type: RecentActivityItem['type'] }) {
  const map = {
    success: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
    info: 'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
    warning: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
    premium: 'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100',
  } as const;

  const label = {
    success: 'Success',
    info: 'Info',
    warning: 'Review',
    premium: 'Premium',
  } as const;

  return (
    <span className={['inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold', map[type]].join(' ')}>
      {label[type]}
    </span>
  );
}

function SubjectCard({ subject }: { subject: SubjectProgressItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-100">
            {subject.icon}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-white">{subject.name}</h3>
              {subject.premium ? <Badge variant="premium">Premium</Badge> : null}
              {subject.trending ? <Badge variant="success">Trending</Badge> : null}
            </div>

            <p className="mt-2 text-sm leading-7 text-white/55">
              {subject.chapterCount} chapters · {subject.questionCount.toLocaleString()} questions
            </p>
          </div>
        </div>

        <button
          type="button"
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-white/55 transition hover:bg-white/[0.08] hover:text-white"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-white/45">
          <span>Progress</span>
          <span>{subject.progress}%</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-400"
            style={{ width: `${subject.progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [search, setSearch] = useState('');

  const stats = useMemo<DashboardStat[]>(
    () => [
      {
        title: 'Study Streak',
        value: '14 days',
        delta: '+3 this week',
        icon: <Flame className="h-5 w-5" />,
        accent: 'amber',
      },
      {
        title: 'Practice Accuracy',
        value: '87%',
        delta: '+4.2% from last week',
        icon: <Target className="h-5 w-5" />,
        accent: 'emerald',
      },
      {
        title: 'Leaderboard Rank',
        value: '#12',
        delta: 'Up 8 positions',
        icon: <Trophy className="h-5 w-5" />,
        accent: 'fuchsia',
      },
      {
        title: 'Premium Access',
        value: 'Active',
        delta: 'Expires in 28 days',
        icon: <Crown className="h-5 w-5" />,
        accent: 'cyan',
      },
    ],
    [],
  );

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return subjectProgress;

    return subjectProgress.filter((subject) =>
      [subject.name, String(subject.chapterCount), String(subject.questionCount)]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return seedActivities;

    return seedActivities.filter((item) =>
      [item.title, item.description, item.time, item.type]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  const topSignals = useMemo(
    () => [
      'AI study assistant recommends Physics revision today',
      'Your Math weak topics are improving steadily',
      'A new community question matches your current chapter',
      'Leaderboard activity is high in your batch',
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-[#050816] p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
          <div className="relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  BEP Learning Dashboard
                </div>

                <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                  Dashboard
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  আপনার practice, progress, AI usage, and study trends এক জায়গায় দেখুন।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Live
                </Badge>
                <Badge variant="premium">
                  <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                  Synced
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <MiniMetric title="Questions Done" value="1,248" icon={<BookOpen className="h-4 w-4" />} />
              <MiniMetric title="AI Prompts" value="84" icon={<Brain className="h-4 w-4" />} />
              <MiniMetric title="Community Replies" value="36" icon={<MessageCircle className="h-4 w-4" />} />
              <MiniMetric title="Weekly Minutes" value="610" icon={<Clock3 className="h-4 w-4" />} />
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-cyan-100">
                    <LineChart className="h-4 w-4" />
                    <span className="text-sm font-semibold">Overall performance</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-white/55">
                    Real-time learning signals from your current study flow.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">7d</Badge>
                  <Badge variant="secondary">30d</Badge>
                  <Badge variant="success">90d</Badge>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[26px] border border-white/10 bg-[#08111F]/70 p-5">
                  <div className="flex items-center gap-2 text-cyan-100">
                    <Target className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Accuracy
                    </span>
                  </div>
                  <h3 className="mt-3 text-4xl font-black text-white">87%</h3>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Average practice correctness.
                  </p>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-[#08111F]/70 p-5">
                  <div className="flex items-center gap-2 text-emerald-100">
                    <Flame className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Streak
                    </span>
                  </div>
                  <h3 className="mt-3 text-4xl font-black text-white">14</h3>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Consecutive active days.
                  </p>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-[#08111F]/70 p-5">
                  <div className="flex items-center gap-2 text-fuchsia-100">
                    <Trophy className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Rank
                    </span>
                  </div>
                  <h3 className="mt-3 text-4xl font-black text-white">12</h3>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Current leaderboard position.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-cyan-100">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-semibold">Subject progress</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-white/55">
                    Your current learning roadmap by subject.
                  </p>
                </div>

                <Badge variant="premium">{filteredSubjects.length} subjects</Badge>
              </div>

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dashboard..."
                leftIcon={<Search className="h-4 w-4" />}
              />

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {filteredSubjects.map((subject) => (
                  <SubjectCard key={subject.id} subject={subject} />
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-cyan-100">
                    <Wand2 className="h-4 w-4" />
                    <span className="text-sm font-semibold">Quick actions</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-white/55">
                    Continue your study flow faster.
                  </p>
                </div>

                <Badge variant="secondary">Tools</Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {quickActions.map((item) => (
                  <ActionCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    actionLabel={item.actionLabel}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-2 text-emerald-100">
                <Star className="h-4 w-4" />
                <span className="text-sm font-semibold">Study signals</span>
              </div>

              <div className="space-y-3">
                {topSignals.map((signal) => (
                  <div
                    key={signal}
                    className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-[#08111F]/70 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-100" />
                    <p className="text-sm leading-7 text-white/65">{signal}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-2 text-cyan-100">
                <Users className="h-4 w-4" />
                <span className="text-sm font-semibold">Recent activity</span>
              </div>

              <div className="space-y-3">
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-[22px] border border-white/10 bg-[#08111F]/75 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-semibold text-white">{activity.title}</h4>
                            <ActivityBadge type={activity.type} />
                          </div>

                          <p className="mt-2 text-sm leading-6 text-white/55">
                            {activity.description}
                          </p>
                        </div>

                        <span className="shrink-0 text-xs text-white/40">{activity.time}</span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-100" />
                    <p className="mt-3 text-sm text-white/55">No activity found</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-2 text-fuchsia-100">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm font-semibold">Performance summary</span>
              </div>

              <div className="space-y-3">
                <SummaryRow label="This week sessions" value="18" />
                <SummaryRow label="Questions reviewed" value="246" />
                <SummaryRow label="AI suggestions used" value="41" />
                <SummaryRow label="Weak topics improved" value="6" />
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
                <p className="text-sm leading-7 text-white/75">
                  Consistency is trending upward. Keep the streak alive and your ranking should continue to improve.
                </p>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-2 text-fuchsia-100">
                <Crown className="h-4 w-4" />
                <span className="text-sm font-semibold">Premium insights</span>
              </div>

              <div className="space-y-3">
                <InfoRow label="Premium access" value="Active" />
                <InfoRow label="Remaining AI quota" value="18 prompts" />
                <InfoRow label="Leaderboard boost" value="Enabled" />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button>
                  View premium tools
                </Button>
                <Button variant="secondary">
                  Manage plan
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Lessons Completed"
            value="128"
            icon={<BookOpen className="h-5 w-5" />}
            accent="cyan"
            delta="+12 this week"
          />
          <StatCard
            title="AI Interactions"
            value="84"
            icon={<Brain className="h-5 w-5" />}
            accent="fuchsia"
            delta="+9% from last week"
          />
          <StatCard
            title="Community Replies"
            value="36"
            icon={<MessageCircle className="h-5 w-5" />}
            accent="emerald"
            delta="+5 since yesterday"
          />
          <StatCard
            title="Study Minutes"
            value="610"
            icon={<Clock3 className="h-5 w-5" />}
            accent="amber"
            delta="+74 this week"
          />
        </div>
      </div>
    </div>
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

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="text-sm text-white/60">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="text-sm text-white/60">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}
