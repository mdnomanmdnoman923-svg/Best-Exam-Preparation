// bep-full-project/src/features/progress/components/ProgressCharts.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Brain,
  CalendarDays,
  ChevronDown,
  Clock3,
  Flame,
  LineChart,
  PieChart,
  Sparkles,
  Target,
  Trophy,
  TrendingUp,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart as ReLineChart,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export type ProgressChartMode =
  | 'overview'
  | 'accuracy'
  | 'study-time'
  | 'subjects'
  | 'streak';

export interface ProgressDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  tertiaryValue?: number;
  date?: string;
}

export interface ProgressSubjectData {
  subject: string;
  score: number;
  totalQuestions?: number;
  correct?: number;
  incorrect?: number;
  completed?: number;
}

export interface ProgressChartProps {
  title?: string;
  subtitle?: string;
  mode?: ProgressChartMode;
  weeklyData?: ProgressDataPoint[];
  subjectData?: ProgressSubjectData[];
  loading?: boolean;
  premium?: boolean;
  totalStudyMinutes?: number;
  averageScore?: number;
  completedSessions?: number;
  streakDays?: number;
  onModeChange?: (mode: ProgressChartMode) => void;
  onViewDetails?: () => void;
  className?: string;
}

const defaultWeeklyData: ProgressDataPoint[] = [
  { label: 'Mon', value: 58, secondaryValue: 36, tertiaryValue: 22 },
  { label: 'Tue', value: 64, secondaryValue: 42, tertiaryValue: 28 },
  { label: 'Wed', value: 72, secondaryValue: 48, tertiaryValue: 34 },
  { label: 'Thu', value: 66, secondaryValue: 41, tertiaryValue: 30 },
  { label: 'Fri', value: 81, secondaryValue: 57, tertiaryValue: 39 },
  { label: 'Sat', value: 88, secondaryValue: 63, tertiaryValue: 44 },
  { label: 'Sun', value: 92, secondaryValue: 71, tertiaryValue: 52 },
];

const defaultSubjectData: ProgressSubjectData[] = [
  { subject: 'Math', score: 78, totalQuestions: 320, correct: 250, incorrect: 70, completed: 84 },
  { subject: 'Physics', score: 66, totalQuestions: 280, correct: 185, incorrect: 95, completed: 71 },
  { subject: 'Chemistry', score: 72, totalQuestions: 260, correct: 187, incorrect: 73, completed: 77 },
  { subject: 'Biology', score: 84, totalQuestions: 340, correct: 286, incorrect: 54, completed: 91 },
  { subject: 'English', score: 69, totalQuestions: 220, correct: 152, incorrect: 68, completed: 64 },
];

const modes: Array<{
  value: ProgressChartMode;
  label: string;
  icon: React.ReactNode;
}> = [
  { value: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
  { value: 'accuracy', label: 'Accuracy', icon: <Target className="h-4 w-4" /> },
  { value: 'study-time', label: 'Study Time', icon: <Clock3 className="h-4 w-4" /> },
  { value: 'subjects', label: 'Subjects', icon: <PieChart className="h-4 w-4" /> },
  { value: 'streak', label: 'Streak', icon: <Flame className="h-4 w-4" /> },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours}h`;
  return `${hours}h ${remaining}m`;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    value?: number;
    name?: string;
    color?: string;
    dataKey?: string;
  }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#08111F] px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <p className="text-sm font-semibold text-white">{label}</p>
      <div className="mt-2 space-y-1">
        {payload.map((entry, index) => (
          <div key={`${entry.dataKey || entry.name || index}`} className="flex items-center justify-between gap-4 text-xs text-white/65">
            <span>{entry.name || entry.dataKey}</span>
            <span className="font-semibold text-white">
              {typeof entry.value === 'number' ? entry.value : '--'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProgressCharts({
  title = 'Progress Analytics',
  subtitle = 'আপনার learning growth, accuracy, study time এবং subject-wise performance এক জায়গায় দেখুন',
  mode = 'overview',
  weeklyData = defaultWeeklyData,
  subjectData = defaultSubjectData,
  loading = false,
  premium = false,
  totalStudyMinutes = 780,
  averageScore = 78,
  completedSessions = 42,
  streakDays = 7,
  onModeChange,
  onViewDetails,
  className = '',
}: ProgressChartProps) {
  const [internalMode, setInternalMode] = useState<ProgressChartMode>(mode);
  const activeMode = onModeChange ? mode : internalMode;

  const safeAverageScore = clamp(averageScore, 0, 100);
  const safeStudyMinutes = Math.max(0, totalStudyMinutes);

  const overviewData = useMemo(
    () =>
      weeklyData.map((item, index) => ({
        ...item,
        day: item.label,
        progress: clamp(item.value, 0, 100),
        accuracy: clamp(item.secondaryValue ?? item.value - 20, 0, 100),
        studyTime: Math.max(0, item.tertiaryValue ?? Math.round(item.value * 0.75)),
        index,
      })),
    [weeklyData],
  );

  const pieData = useMemo(
    () =>
      subjectData.map((item) => ({
        name: item.subject,
        value: clamp(item.score, 0, 100),
      })),
    [subjectData],
  );

  const subjectBarData = useMemo(
    () =>
      subjectData.map((item) => ({
        subject: item.subject,
        score: clamp(item.score, 0, 100),
        completed: clamp(item.completed ?? item.score, 0, 100),
      })),
    [subjectData],
  );

  const streakData = useMemo(
    () =>
      weeklyData.map((item) => ({
        day: item.label,
        streak: clamp(item.tertiaryValue ?? Math.round(item.value * 0.6), 0, 100),
        value: clamp(item.value, 0, 100),
      })),
    [weeklyData],
  );

  const handleModeChange = (nextMode: ProgressChartMode) => {
    if (onModeChange) {
      onModeChange(nextMode);
      return;
    }

    setInternalMode(nextMode);
  };

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex min-h-[360px] items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.04]">
          <div className="h-20 w-20 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.05]" />
        </div>
      );
    }

    switch (activeMode) {
      case 'accuracy':
        return (
          <ResponsiveContainer width="100%" height={360}>
            <ReLineChart data={overviewData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="accuracy"
                name="Accuracy"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="progress"
                name="Completion"
                stroke="#d946ef"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ReLineChart>
          </ResponsiveContainer>
        );

      case 'study-time':
        return (
          <ResponsiveContainer width="100%" height={360}>
            <AreaChart data={overviewData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="studyTimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d946ef" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#d946ef" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="studyTime"
                name="Study Time"
                stroke="#22d3ee"
                fillOpacity={1}
                fill="url(#studyTimeGradient)"
                strokeWidth={3}
              />
              <Area
                type="monotone"
                dataKey="progress"
                name="Completion"
                stroke="#d946ef"
                fillOpacity={1}
                fill="url(#completionGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'subjects':
        return (
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={subjectBarData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <XAxis dataKey="subject" stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="score" name="Score" radius={[12, 12, 0, 0]}>
                {subjectBarData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.subject}`}
                    fill={index % 2 === 0 ? '#22d3ee' : '#d946ef'}
                  />
                ))}
              </Bar>
              <Line type="monotone" dataKey="completed" name="Completion" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'streak':
        return (
          <ResponsiveContainer width="100%" height={360}>
            <AreaChart data={streakData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="streakGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="streak"
                name="Streak"
                stroke="#fb7185"
                fillOpacity={1}
                fill="url(#streakGradient)"
                strokeWidth={3}
              />
              <Line type="monotone" dataKey="value" name="Activity" stroke="#22d3ee" strokeWidth={2} dot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'overview':
      default:
        return (
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={overviewData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="progress"
                name="Completion"
                stroke="#22d3ee"
                fill="rgba(34, 211, 238, 0.18)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                name="Accuracy"
                stroke="#d946ef"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Bar dataKey="studyTime" name="Study Time" fill="#f59e0b" radius={[12, 12, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <section className={className}>
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_20px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl">
        <div className="relative overflow-hidden border-b border-white/10 p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                <Sparkles className="h-3.5 w-3.5" />
                BEP Progress Center
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white">
                {title}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="premium">Live Analytics</Badge>
              {premium ? <Badge variant="success">Premium Insights</Badge> : null}
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                <TrendingUp className="h-4 w-4" />
                Real-time Progress
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 p-5">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/70 p-5">
              <div className="flex items-center gap-2 text-cyan-100">
                <Clock3 className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Study Time
                </span>
              </div>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
                {formatMinutes(safeStudyMinutes)}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Total study minutes
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/70 p-5">
              <div className="flex items-center gap-2 text-emerald-100">
                <Target className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Average Score
                </span>
              </div>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
                {safeAverageScore}%
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Across all practice
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/70 p-5">
              <div className="flex items-center gap-2 text-fuchsia-100">
                <Brain className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Sessions
                </span>
              </div>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
                {completedSessions}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Completed sessions
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/70 p-5">
              <div className="flex items-center gap-2 text-orange-100">
                <Flame className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Streak
                </span>
              </div>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
                {streakDays}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Consecutive active days
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {modes.map((item) => {
              const active = activeMode === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleModeChange(item.value)}
                  className={[
                    'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
                    active
                      ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
                      : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.06] hover:text-white',
                  ].join(' ')}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/70 p-4">
            {renderChart()}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_340px]">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex items-center gap-2 text-cyan-100">
                <LineChart className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Weekly trend summary
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                  <div className="flex items-center gap-2 text-cyan-100">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Growth
                    </span>
                  </div>
                  <h4 className="mt-2 text-2xl font-bold text-white">+18%</h4>
                  <p className="mt-1 text-xs text-white/45">
                    Compared to last week
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                  <div className="flex items-center gap-2 text-emerald-100">
                    <Target className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Accuracy
                    </span>
                  </div>
                  <h4 className="mt-2 text-2xl font-bold text-white">
                    {safeAverageScore}%
                  </h4>
                  <p className="mt-1 text-xs text-white/45">
                    Overall average accuracy
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                  <div className="flex items-center gap-2 text-fuchsia-100">
                    <CalendarDays className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Active Days
                    </span>
                  </div>
                  <h4 className="mt-2 text-2xl font-bold text-white">
                    {streakDays}
                  </h4>
                  <p className="mt-1 text-xs text-white/45">
                    Current streak
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex items-center gap-2 text-yellow-100">
                <Trophy className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Insights
                </span>
              </div>

              <div className="space-y-3 text-sm leading-7 text-white/65">
                <p>
                  আপনার study pattern consistent হচ্ছে। বিশেষ করে weekend performance শক্তিশালী।
                </p>
                <p>
                  Practice accuracy সবচেয়ে বেশি Biology এবং Math এ দেখা যাচ্ছে।
                </p>
                <p>
                  Weak areas চিহ্নিত করে review করলে score আরও বাড়বে।
                </p>
              </div>

              {premium ? (
                <div className="mt-4 rounded-2xl border border-fuchsia-400/15 bg-fuchsia-400/10 p-4 text-sm leading-7 text-white/75">
                  Premium analytics unlocked. You can now compare subject trends, streak history, এবং time-based learning insights.
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-white/55">
                  Premium insights unlock deeper analytics and personalized study recommendations.
                </div>
              )}

              {onViewDetails ? (
                <div className="mt-5">
                  <Button
                    onClick={onViewDetails}
                    rightIcon={<ChevronDown className="h-4 w-4" />}
                    variant="secondary"
                  >
                    View Details
                  </Button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex items-center gap-2 text-fuchsia-100">
              <PieChart className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Subject completion snapshot
              </span>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4">
                <ResponsiveContainer width="100%" height={280}>
                  <RePieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={3}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`subject-cell-${entry.name}`}
                          fill={index % 2 === 0 ? '#22d3ee' : '#d946ef'}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {subjectData.map((item, index) => (
                  <div
                    key={item.subject}
                    className="rounded-2xl border border-white/10 bg-[#08111F]/70 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {item.subject}
                        </h4>
                        <p className="mt-1 text-xs text-white/45">
                          {item.correct ?? 0} correct / {item.incorrect ?? 0} incorrect
                        </p>
                      </div>

                      <span className="text-sm font-bold text-cyan-100">
                        {clamp(item.score, 0, 100)}%
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${clamp(item.score, 0, 100)}%` }}
                        transition={{ duration: 0.5, delay: index * 0.04 }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/70 p-5">
              <div className="flex items-center gap-2 text-cyan-100">
                <Target className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Best score
                </span>
              </div>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
                {Math.max(...weeklyData.map((item) => item.value), safeAverageScore)}%
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Peak performance this week
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/70 p-5">
              <div className="flex items-center gap-2 text-emerald-100">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Momentum
                </span>
              </div>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
                Strong
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Consistent improvement detected
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/70 p-5">
              <div className="flex items-center gap-2 text-orange-100">
                <Flame className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Streak health
                </span>
              </div>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
                {streakDays > 0 ? 'Active' : 'Idle'}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                {streakDays > 0 ? 'Keep the momentum going' : 'Start a new streak today'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
