// bep-full-project/src/pages/admin/AdminDashboardPage.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
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

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'premium';
}

interface ShortcutItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel: string;
}

interface AdminWidgetItem {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
}

const seedActivities: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'New chapter published',
    description: 'Physics → Motion and Force chapter is now live.',
    time: '2 min ago',
    type: 'success',
  },
  {
    id: 'act-2',
    title: 'Premium subscription renewed',
    description: 'Student account 42 renewed Premium for 1 year.',
    time: '12 min ago',
    type: 'premium',
  },
  {
    id: 'act-3',
    title: 'Question flagged for review',
    description: 'A Math MCQ was reported by 3 users and queued.',
    time: '25 min ago',
    type: 'warning',
  },
  {
    id: 'act-4',
    title: 'AI assistant usage spike',
    description: 'BEP AI study assistant handled 1,284 prompts today.',
    time: '1 hour ago',
    type: 'info',
  },
];

const seedShortcuts: ShortcutItem[] = [
  {
    id: 'shortcut-1',
    title: 'Create subject',
    description: 'Add a new subject to the learning hub',
    icon: <BookOpen className="h-5 w-5" />,
    actionLabel: 'Create',
  },
  {
    id: 'shortcut-2',
    title: 'Add chapter',
    description: 'Organize lessons under the right subject',
    icon: <Layers3 className="h-5 w-5" />,
    actionLabel: 'Add',
  },
  {
    id: 'shortcut-3',
    title: 'Insert questions',
    description: 'Populate the question bank with MCQ/SQ/CQ',
    icon: <Wand2 className="h-5 w-5" />,
    actionLabel: 'Insert',
  },
  {
    id: 'shortcut-4',
    title: 'Broadcast notice',
    description: 'Send announcement to all students',
    icon: <MessageCircle className="h-5 w-5" />,
    actionLabel: 'Send',
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

        <div className={['flex h-14 w-14 items-center justify-center rounded-2xl border', accentMap[accent]].join(' ')}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function MiniWidget({ title, value, subtitle, icon }: AdminWidgetItem) {
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
      <p className="mt-3 text-sm leading-6 text-white/55">{subtitle}</p>
    </div>
  );
}

function ActivityBadge({ type }: { type: ActivityItem['type'] }) {
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

export default function AdminDashboardPage() {
  const [search, setSearch] = useState('');
  const [loading] = useState(false);

  const stats = useMemo<DashboardStat[]>(
    () => [
      {
        title: 'Total Students',
        value: '12,480',
        delta: '+14.2% this month',
        icon: <Users className="h-5 w-5" />,
        accent: 'cyan',
      },
      {
        title: 'Questions Bank',
        value: '48,902',
        delta: '+2,180 new questions',
        icon: <Brain className="h-5 w-5" />,
        accent: 'emerald',
      },
      {
        title: 'Active Exams',
        value: '128',
        delta: '+18 running now',
        icon: <ShieldCheck className="h-5 w-5" />,
        accent: 'amber',
      },
      {
        title: 'Premium Members',
        value: '3,742',
        delta: '+9.5% renewal rate',
        icon: <Crown className="h-5 w-5" />,
        accent: 'fuchsia',
      },
    ],
    [],
  );

  const widgets = useMemo<AdminWidgetItem[]>(
    () => [
      {
        title: 'Subjects',
        value: 128,
        subtitle: 'Active subject groups across school to masters level.',
        icon: <BookOpen className="h-4 w-4 text-cyan-100" />,
      },
      {
        title: 'Chapters',
        value: 1_284,
        subtitle: 'Well-structured lesson units ready for delivery.',
        icon: <Layers3 className="h-4 w-4 text-emerald-100" />,
      },
      {
        title: 'Pending Reviews',
        value: 36,
        subtitle: 'Questions, reports, and content awaiting moderation.',
        icon: <Clock3 className="h-4 w-4 text-amber-100" />,
      },
      {
        title: 'AI Prompts',
        value: 24_980,
        subtitle: 'AI assistant interactions in the last 30 days.',
        icon: <Sparkles className="h-4 w-4 text-fuchsia-100" />,
      },
    ],
    [],
  );

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

  const topFeatures = useMemo(
    () => [
      'AI study assistant improvements are live',
      'Question bank sync completed for all subjects',
      'Leaderboard calculations updated in real time',
      'Premium subscription renewal flow stabilized',
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
                  BEP Admin Panel
                </div>

                <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                  Dashboard
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  System-wide performance, content health, AI activity, and learning engagement এক জায়গায় monitor করুন।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Live
                </Badge>
                <Badge variant="premium">
                  <Crown className="mr-1 h-3.5 w-3.5" />
                  Premium Admin
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

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {widgets.map((widget) => (
                <MiniWidget key={widget.title} {...widget} />
              ))}
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-cyan-100">
                    <LineChart className="h-4 w-4" />
                    <span className="text-sm font-semibold">Platform overview</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-white/55">
                    Real-time signals from content, users, exams, and AI usage.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">24h</Badge>
                  <Badge variant="secondary">7d</Badge>
                  <Badge variant="success">30d</Badge>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[26px] border border-white/10 bg-[#08111F]/70 p-5">
                  <div className="flex items-center gap-2 text-cyan-100">
                    <Target className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Completion</span>
                  </div>
                  <h3 className="mt-3 text-4xl font-black text-white">84%</h3>
                  <p className="mt-2 text-sm leading-6 text-white/55">Average student course completion rate.</p>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-[#08111F]/70 p-5">
                  <div className="flex items-center gap-2 text-emerald-100">
                    <Trophy className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Accuracy</span>
                  </div>
                  <h3 className="mt-3 text-4xl font-black text-white">76%</h3>
                  <p className="mt-2 text-sm leading-6 text-white/55">Overall practice answer correctness.</p>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-[#08111F]/70 p-5">
                  <div className="flex items-center gap-2 text-fuchsia-100">
                    <Flame className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Streaks</span>
                  </div>
                  <h3 className="mt-3 text-4xl font-black text-white">5,218</h3>
                  <p className="mt-2 text-sm leading-6 text-white/55">Active students maintaining weekly streaks.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-cyan-100">
                    <Layers3 className="h-4 w-4" />
                    <span className="text-sm font-semibold">Quick actions</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-white/55">
                    Create content and push updates faster.
                  </p>
                </div>

                <Badge variant="premium">Admin tools</Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <ActionTile
                  title="Create subject"
                  description="Add a new subject and make it available to learners."
                  icon={<BookOpen className="h-5 w-5" />}
                  actionLabel="Create now"
                />
                <ActionTile
                  title="Add chapter"
                  description="Organize a subject into chapters and lessons."
                  icon={<Layers3 className="h-5 w-5" />}
                  actionLabel="Add chapter"
                />
                <ActionTile
                  title="Build question set"
                  description="Populate MCQ, SQ, and CQ practice content."
                  icon={<Wand2 className="h-5 w-5" />}
                  actionLabel="Build"
                />
                <ActionTile
                  title="Send announcement"
                  description="Broadcast important updates to all students."
                  icon={<MessageCircle className="h-5 w-5" />}
                  actionLabel="Broadcast"
                />
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-cyan-100">
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-semibold">System highlights</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-white/55">
                    Important updates and trusted health signals.
                  </p>
                </div>

                <Badge variant="success">Healthy</Badge>
              </div>

              <div className="space-y-3">
                {topFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-[#08111F]/70 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-100" />
                    <p className="text-sm leading-7 text-white/65">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-2 text-cyan-100">
                <Users className="h-4 w-4" />
                <span className="text-sm font-semibold">Activity feed</span>
              </div>

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search activity..."
                leftIcon={<Search className="h-4 w-4" />}
              />

              <div className="mt-4 space-y-3">
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
                          <p className="mt-2 text-sm leading-6 text-white/55">{activity.description}</p>
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
              <div className="mb-5 flex items-center gap-2 text-cyan-100">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm font-semibold">Admin status</span>
              </div>

              <div className="space-y-3">
                <InfoRow label="Moderation queue" value="36 items" />
                <InfoRow label="Failed payments" value="2 alerts" />
                <InfoRow label="AI abuse reports" value="4 flagged" />
                <InfoRow label="Storage usage" value="62% full" />
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
                <p className="text-sm leading-7 text-white/75">
                  BEP dashboard is tracking system health, content production, and learning momentum in real time.
                </p>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-2 text-fuchsia-100">
                <Crown className="h-4 w-4" />
                <span className="text-sm font-semibold">Premium insights</span>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-white/60">Premium learners</span>
                    <span className="text-sm font-semibold text-white">3,742</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-white/60">Renewal rate</span>
                    <span className="text-sm font-semibold text-white">81%</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-white/60">ARPU</span>
                    <span className="text-sm font-semibold text-white">৳189</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button leftIcon={<ArrowRight className="h-4 w-4" />}>View premium users</Button>
                <Button variant="secondary">Manage plans</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionTile({
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
          <ChevronRight className="h-3.5 w-3.5" />
          {actionLabel}
        </div>
      </div>

      <h4 className="mt-4 text-lg font-semibold text-white">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="text-sm text-white/60">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}
