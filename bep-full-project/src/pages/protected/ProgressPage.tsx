// bep-full-project/src/pages/protected/ProgressPage.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock3,
  Crown,
  Flame,
  LineChart,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  TrendingUp,
  Users,
  Wand2,
  XCircle,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ProgressStat {
  title: string;
  value: string | number;
  delta: string;
  icon: React.ReactNode;
  accent?: 'cyan' | 'emerald' | 'amber' | 'fuchsia' | 'violet';
}

interface ProgressSubjectItem {
  id: string;
  name: string;
  chapterCount: number;
  questionCount: number;
  progress: number;
  accuracy: number;
  streak: number;
  premium?: boolean;
  trending?: boolean;
  weakTopics?: number;
  icon: React.ReactNode;
}

interface WeakTopicItem {
  id: string;
  topic: string;
  subject: string;
  accuracy: number;
  attempts: number;
  recommended: string;
}

interface DailyActivityItem {
  id: string;
  day: string;
  studyMinutes: number;
  accuracy: number;
  practiceCount: number;
}

const subjectData: ProgressSubjectItem[] = [
  {
    id: 'sub-1',
    name: 'Mathematics',
    chapterCount: 18,
    questionCount: 3200,
    progress: 82,
    accuracy: 88,
    streak: 14,
    premium: true,
    trending: true,
    weakTopics: 3,
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: 'sub-2',
    name: 'Physics',
    chapterCount: 14,
    questionCount: 2500,
    progress: 91,
    accuracy: 92,
    streak: 18,
    premium: false,
    trending: true,
    weakTopics: 2,
    icon: <Brain className="h-5 w-5" />,
  },
  {
    id: 'sub-3',
    name: 'English',
    chapterCount: 10,
    questionCount: 980,
    progress: 65,
    accuracy: 76,
    streak: 6,
    premium: false,
    trending: false,
    weakTopics: 5,
    icon: <Wand2 className="h-5 w-5" />,
  },
  {
    id: 'sub-4',
    name: 'Chemistry',
    chapterCount: 12,
    questionCount: 1680,
    progress: 74,
    accuracy: 84,
    streak: 9,
    premium: true,
    trending: false,
    weakTopics: 4,
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    id: 'sub-5',
    name: 'Biology',
    chapterCount: 11,
    questionCount: 1410,
    progress: 69,
    accuracy: 79,
    streak: 8,
    premium: false,
    trending: false,
    weakTopics: 4,
    icon: <Target className="h-5 w-5" />,
  },
];

const weakTopics: WeakTopicItem[] = [
  {
    id: 'wt-1',
    topic: 'Linear equations',
    subject: 'Mathematics',
    accuracy: 62,
    attempts: 18,
    recommended: 'Practice 10 more MCQs and 2 short-answer problems.',
  },
  {
    id: 'wt-2',
    topic: 'Voice change',
    subject: 'English',
    accuracy: 58,
    attempts: 14,
    recommended: 'Revise rules and solve transformation drills.',
  },
  {
    id: 'wt-3',
    topic: 'Atomic structure',
    subject: 'Chemistry',
    accuracy: 70,
    attempts: 20,
    recommended: 'Review proton/neutron/electron basics.',
  },
];

const dailyActivity: DailyActivityItem[] = [
  { id: 'd-1', day: 'Mon', studyMinutes: 65, accuracy: 84, practiceCount: 42 },
  { id: 'd-2', day: 'Tue', studyMinutes: 78, accuracy: 86, practiceCount: 51 },
  { id: 'd-3', day: 'Wed', studyMinutes: 52, accuracy: 80, practiceCount: 34 },
  { id: 'd-4', day: 'Thu', studyMinutes: 90, accuracy: 89, practiceCount: 58 },
  { id: 'd-5', day: 'Fri', studyMinutes: 74, accuracy: 87, practiceCount: 46 },
  { id: 'd-6', day: 'Sat', studyMinutes: 102, accuracy: 91, practiceCount: 61 },
  { id: 'd-7', day: 'Sun', studyMinutes: 44, accuracy: 78, practiceCount: 28 },
];

function formatPercentage(value: number) {
  return `${Math.round(value)}%`;
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
  accent?: 'cyan' | 'emerald' | 'amber' | 'fuchsia' | 'violet';
  note?: string;
}) {
  const accentMap = {
    cyan: 'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
    emerald: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
    amber: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
    fuchsia: 'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100',
    violet: 'border-violet-400/15 bg-violet-400/10 text-violet-100',
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

function SubjectProgressCard({ item }: { item: ProgressSubjectItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-100">
            {item.icon}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-white">{item.name}</h3>
              {item.premium ? <Badge variant="premium">Premium</Badge> : null}
              {item.trending ? <Badge variant="success">Trending</Badge> : null}
            </div>

            <p className="mt-2 text-sm leading-7 text-white/55">
              {item.chapterCount} chapters · {item.questionCount.toLocaleString()} questions
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

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <TinyStat label="Progress" value={formatPercentage(item.progress)} />
        <TinyStat label="Accuracy" value={formatPercentage(item.accuracy)} />
        <TinyStat label="Weak topics" value={item.weakTopics ?? 0} />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-white/45">
          <span>Completion</span>
          <span>{item.progress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-400"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function TinyStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#08111F]/70 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">{label}</div>
      <div className="mt-1 text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function WeakTopicCard({ item }: { item: WeakTopicItem }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[#08111F]/75 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-white">{item.topic}</h4>
            <Badge variant="secondary">{item.subject}</Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-white/55">{item.recommended}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-right">
          <div className="text-xs uppercase tracking-wider text-white/40">Accuracy</div>
          <div className="mt-1 text-lg font-bold text-white">{formatPercentage(item.accuracy)}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2 text-sm text-white/50">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
          Attempts: {item.attempts}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
          Suggested focus: revision
        </div>
      </div>
    </div>
  );
}

function BarRow({
  label,
  value,
  percentage,
}: {
  label: string;
  value: string | number;
  percentage: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-white/55">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-400"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ActivityCard({ item }: { item: DailyActivityItem }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[#08111F]/75 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{item.day}</p>
          <p className="mt-1 text-xs text-white/45">{item.practiceCount} practices</p>
        </div>
        <Badge variant="secondary">{item.studyMinutes} min</Badge>
      </div>

      <div className="mt-4 space-y-3">
        <BarRow label="Study" value={`${item.studyMinutes} min`} percentage={Math.min(item.studyMinutes, 120)} />
        <BarRow label="Accuracy" value={`${item.accuracy}%`} percentage={item.accuracy} />
      </div>
    </div>
  );
}

function InsightRow({
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

export default function ProgressPage() {
  const [search, setSearch] = useState('');
  const [loading] = useState(false);

  const stats = useMemo(() => {
    const totalSubjects = subjectData.length;
    const avgProgress = Math.round(subjectData.reduce((sum, item) => sum + item.progress, 0) / totalSubjects);
    const avgAccuracy = Math.round(subjectData.reduce((sum, item) => sum + item.accuracy, 0) / totalSubjects);
    const totalWeakTopics = subjectData.reduce((sum, item) => sum + (item.weakTopics ?? 0), 0);
    const totalStreak = Math.max(...subjectData.map((item) => item.streak));

    return {
      totalSubjects,
      avgProgress,
      avgAccuracy,
      totalWeakTopics,
      totalStreak,
    };
  }, []);

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return subjectData;

    return subjectData.filter((subject) =>
      [
        subject.name,
        String(subject.chapterCount),
        String(subject.questionCount),
        String(subject.progress),
        String(subject.accuracy),
        String(subject.weakTopics),
      ]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  const totalStudyMinutes = useMemo(
    () => dailyActivity.reduce((sum, item) => sum + item.studyMinutes, 0),
    [],
  );
  const totalPracticeCount = useMemo(
    () => dailyActivity.reduce((sum, item) => sum + item.practiceCount, 0),
    [],
  );
  const bestAccuracyDay = useMemo(() => {
    const sorted = [...dailyActivity].sort((a, b) => b.accuracy - a.accuracy);
    return sorted[0];
  }, []);

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
                  BEP Learning Analytics
                </div>

                <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                  Progress
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  Subject progress, weak topic signals, daily activity, and performance trends এক জায়গায়।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Synced
                </Badge>
                <Badge variant="premium">
                  <TrendingUp className="mr-1 h-3.5 w-3.5" />
                  Trending Up
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Average Progress"
            value={`${stats.avgProgress}%`}
            icon={<LineChart className="h-5 w-5" />}
            accent="cyan"
            note="Across all subjects"
          />
          <StatCard
            title="Average Accuracy"
            value={`${stats.avgAccuracy}%`}
            icon={<Target className="h-5 w-5" />}
            accent="emerald"
            note="Practice performance"
          />
          <StatCard
            title="Weak Topics"
            value={stats.totalWeakTopics}
            icon={<Flame className="h-5 w-5" />}
            accent="amber"
            note="Need more review"
          />
          <StatCard
            title="Best Streak"
            value={`${stats.totalStreak}d`}
            icon={<Trophy className="h-5 w-5" />}
            accent="fuchsia"
            note="Highest subject streak"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <SectionTitle
              icon={<Search className="h-4 w-4" />}
              title="Search progress"
              description="Find a subject, topic count, or progress figure quickly."
            />

            <div className="space-y-4">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subjects..."
                leftIcon={<Search className="h-4 w-4" />}
              />

              <div className="rounded-[26px] border border-cyan-400/15 bg-cyan-400/10 p-4">
                <p className="text-sm leading-7 text-white/75">
                  Progress is more than completion. Accuracy, streak, and weak topics matter too.
                </p>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-[#08111F]/75 p-5">
                <div className="mb-4 flex items-center gap-2 text-cyan-100">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-sm font-semibold">Weekly overview</span>
                </div>

                <div className="grid gap-3">
                  <InsightRow label="Total study minutes" value={`${totalStudyMinutes} min`} />
                  <InsightRow label="Total practices" value={String(totalPracticeCount)} />
                  <InsightRow label="Best day" value={`${bestAccuracyDay.day} · ${bestAccuracyDay.accuracy}%`} />
                  <InsightRow label="Average daily accuracy" value={`${Math.round(dailyActivity.reduce((s, d) => s + d.accuracy, 0) / dailyActivity.length)}%`} />
                </div>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2 text-fuchsia-100">
                  <Clock3 className="h-4 w-4" />
                  <span className="text-sm font-semibold">Daily activity</span>
                </div>

                <div className="space-y-3">
                  {dailyActivity.map((item) => (
                    <ActivityCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-cyan-100">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-semibold">Subject progress</span>
                </div>
                <p className="mt-2 text-sm leading-7 text-white/55">
                  Completion and accuracy by subject.
                </p>
              </div>

              <Badge variant="secondary">{filteredSubjects.length} subjects</Badge>
            </div>

            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-100" />
              </div>
            ) : filteredSubjects.length > 0 ? (
              <div className="space-y-4">
                {filteredSubjects.map((subject) => (
                  <SubjectProgressCard key={subject.id} item={subject} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10">
                <XCircle className="h-12 w-12 text-white/30" />
                <h3 className="mt-4 text-xl font-bold">No subject found</h3>
                <p className="mt-2 text-sm text-white/55">Search term clear করুন বা অন্য query দিন।</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Daily Minutes"
            value={`${totalStudyMinutes}m`}
            icon={<Clock3 className="h-5 w-5" />}
            accent="cyan"
            note="This week's study time"
          />
          <StatCard
            title="Practices"
            value={totalPracticeCount}
            icon={<BookOpen className="h-5 w-5" />}
            accent="emerald"
            note="Questions attempted"
          />
          <StatCard
            title="Top Accuracy Day"
            value={formatPercentage(bestAccuracyDay.accuracy)}
            icon={<BadgeCheck className="h-5 w-5" />}
            accent="amber"
            note={`${bestAccuracyDay.day} was your best day`}
          />
          <StatCard
            title="Momentum"
            value="Strong"
            icon={<Flame className="h-5 w-5" />}
            accent="fuchsia"
            note="Consistency is improving"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <SectionTitle
              icon={<Flame className="h-4 w-4" />}
              title="Weak topics"
              description="Topics that need more revision based on recent attempts."
            />

            <div className="space-y-3">
              {weakTopics.map((item) => (
                <WeakTopicCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-cyan-100">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-semibold">Insights</span>
                </div>
                <p className="mt-2 text-sm leading-7 text-white/55">
                  This summary helps guide your next study session.
                </p>
              </div>

              <Badge variant="premium">Smart guidance</Badge>
            </div>

            <div className="space-y-3">
              <InsightRow label="Best subject" value="Physics" />
              <InsightRow label="Strongest streak" value="Physics · 18 days" />
              <InsightRow label="Most weak topics" value="English" />
              <InsightRow label="Recommended focus" value="Revision + targeted MCQs" />
            </div>

            <div className="mt-5 rounded-[26px] border border-cyan-400/15 bg-cyan-400/10 p-4">
              <p className="text-sm leading-7 text-white/75">
                Keep the current streak alive. A small daily practice block can improve accuracy very fast.
              </p>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <Button leftIcon={<ArrowRight className="h-4 w-4" />}>View weak topics</Button>
              <Button variant="secondary" leftIcon={<Sparkles className="h-4 w-4" />}>Generate revision</Button>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-100">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-semibold">Progress trend</span>
              </div>
              <p className="mt-2 text-sm leading-7 text-white/55">
                Your average progress and accuracy are both trending in the right direction.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="success">Improving</Badge>
              <Badge variant="secondary">Consistent</Badge>
              <Badge variant="premium">Focused</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
