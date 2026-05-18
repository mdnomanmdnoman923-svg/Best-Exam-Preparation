// bep-full-project/src/pages/public/AboutPage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Clock3,
  Globe,
  GraduationCap,
  Heart,
  Layers3,
  Lightbulb,
  LineChart,
  MessageCircle,
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

interface StatCardItem {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  note?: string;
  accent?: 'cyan' | 'emerald' | 'amber' | 'fuchsia';
}

interface ValueItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface TeamItem {
  name: string;
  role: string;
  description: string;
  badge?: string;
}

function StatCard({
  title,
  value,
  icon,
  note,
  accent = 'cyan',
}: StatCardItem) {
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

        <div
          className={[
            'flex h-14 w-14 items-center justify-center rounded-2xl border',
            accentMap[accent],
          ].join(' ')}
        >
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

function ValueCard({ item }: { item: ValueItem }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-100">
          {item.icon}
        </div>

        <div className="min-w-0">
          <h4 className="text-lg font-semibold text-white">{item.title}</h4>
          <p className="mt-2 text-sm leading-7 text-white/55">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

function TimelineCard({ item }: { item: TimelineItem }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
          {item.year}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-lg font-semibold text-white">{item.title}</h4>
            <Badge variant="secondary">{item.year}</Badge>
          </div>
          <p className="mt-2 text-sm leading-7 text-white/55">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

function TeamCard({ item }: { item: TeamItem }) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#08111F]/75 text-cyan-100">
        <Users className="h-5 w-5" />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <h4 className="text-lg font-semibold text-white">{item.name}</h4>
        {item.badge ? <Badge variant="premium">{item.badge}</Badge> : null}
      </div>

      <p className="mt-1 text-sm text-white/45">{item.role}</p>
      <p className="mt-3 text-sm leading-7 text-white/60">{item.description}</p>
    </div>
  );
}

function MiniFeature({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[#08111F]/75 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-100">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">{title}</h4>
          <p className="mt-1 text-sm leading-6 text-white/55">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const stats: StatCardItem[] = [
    {
      title: 'Active learners',
      value: '24K+',
      icon: <Users className="h-5 w-5" />,
      note: 'Students using BEP monthly',
      accent: 'cyan',
    },
    {
      title: 'Practice accuracy',
      value: '87%',
      icon: <Target className="h-5 w-5" />,
      note: 'Across practice sessions',
      accent: 'emerald',
    },
    {
      title: 'Mock tests',
      value: '180+',
      icon: <GraduationCap className="h-5 w-5" />,
      note: 'Timed assessments available',
      accent: 'amber',
    },
    {
      title: 'AI responses',
      value: 'Always on',
      icon: <Wand2 className="h-5 w-5" />,
      note: 'Study support ready 24/7',
      accent: 'fuchsia',
    },
  ];

  const values: ValueItem[] = [
    {
      title: 'Bengali-first learning',
      description:
        'We build the experience around how Bangladeshi students actually study, read, and revise.',
      icon: <Globe className="h-4 w-4" />,
    },
    {
      title: 'Practice that matters',
      description:
        'Questions, mock tests, and weak-topic review are all designed to improve real exam performance.',
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      title: 'Personalized growth',
      description:
        'Profiles, progress analytics, and AI assistance adapt to each learner’s pace and needs.',
      icon: <LineChart className="h-4 w-4" />,
    },
    {
      title: 'Trust and safety',
      description:
        'Protected routes, account settings, and privacy controls help keep the platform reliable.',
      icon: <ShieldCheck className="h-4 w-4" />,
    },
  ];

  const timeline: TimelineItem[] = [
    {
      year: '2024',
      title: 'Idea and foundation',
      description:
        'BEP started as a simple vision: make high-quality study tools feel clean, modern, and student-friendly.',
    },
    {
      year: '2025',
      title: 'Core product build',
      description:
        'Question bank, practice flow, mock tests, leaderboard, community, and progress tracking took shape.',
    },
    {
      year: '2026',
      title: 'AI and premium ecosystem',
      description:
        'AI assistant, personalized recommendations, analytics, and premium learning features were expanded.',
    },
  ];

  const team: TeamItem[] = [
    {
      name: 'Product & Design',
      role: 'Crafts the interface and learning flow',
      description:
        'Keeps the experience simple, fast, and visually clear so students can focus on studying.',
      badge: 'Core',
    },
    {
      name: 'Engineering',
      role: 'Builds the platform and protected routes',
      description:
        'Maintains the app architecture, data flow, performance, and security-minded structure.',
      badge: 'System',
    },
    {
      name: 'Learning Content',
      role: 'Curates questions and exam material',
      description:
        'Shapes the question bank, mock tests, and revision tools to match real study needs.',
      badge: 'Academic',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050816] p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
          <div className="relative overflow-hidden p-6 md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_28%)]" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  About BEP
                </div>

                <h1 className="text-5xl font-black tracking-tight md:text-6xl">
                  Built for students who want to grow.
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-8 text-white/60 md:text-base">
                  BEP is a Bengali-first AI learning platform designed to bring question practice, mock exams,
                  community learning, progress analytics, and personalized study help into one clean workspace.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">
                  <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                  Student focused
                </Badge>
                <Badge variant="premium">
                  <Crown className="mr-1 h-3.5 w-3.5" />
                  Modern platform
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <SectionTitle
              icon={<Heart className="h-4 w-4" />}
              title="Our mission"
              description="Make learning feel clearer, faster, and more motivating for students across Bangladesh."
            />

            <div className="space-y-4">
              <MiniFeature
                title="Simplify study time"
                description="Keep practice, review, and revision in one place."
                icon={<Clock3 className="h-4 w-4" />}
              />
              <MiniFeature
                title="Turn effort into progress"
                description="Track consistency, weak topics, and performance over time."
                icon={<LineChart className="h-4 w-4" />}
              />
              <MiniFeature
                title="Make motivation visible"
                description="Use streaks, leaderboard, and achievements to keep momentum high."
                icon={<Trophy className="h-4 w-4" />}
              />
              <MiniFeature
                title="Support every learner"
                description="From Class 6 to Masters level, the platform adapts to study goals."
                icon={<GraduationCap className="h-4 w-4" />}
              />
            </div>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <SectionTitle
              icon={<Sparkles className="h-4 w-4" />}
              title="What makes BEP different"
              description="The product is intentionally focused on clarity, usefulness, and a strong student experience."
            />

            <div className="grid gap-4 md:grid-cols-2">
              {values.map((item) => (
                <ValueCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <SectionTitle
              icon={<Layers3 className="h-4 w-4" />}
              title="How the platform grew"
              description="A quick timeline of the product direction and key milestones."
            />

            <div className="space-y-4">
              {timeline.map((item) => (
                <TimelineCard key={item.year} item={item} />
              ))}
            </div>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <SectionTitle
              icon={<Users className="h-4 w-4" />}
              title="The people behind it"
              description="BEP is shaped by product thinking, engineering, and academic content design."
            />

            <div className="space-y-4">
              {team.map((item) => (
                <TeamCard key={item.name} item={item} />
              ))}
            </div>

            <div className="mt-6 rounded-[28px] border border-cyan-400/15 bg-cyan-400/10 p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="mt-0.5 h-4 w-4 text-cyan-100" />
                <p className="text-sm leading-7 text-white/75">
                  The goal is not just to ship features. It is to create a study system that students actually enjoy using every day.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Support"
            value="Fast"
            icon={<MessageCircle className="h-5 w-5" />}
            accent="cyan"
            note="Responsive user guidance"
          />
          <StatCard
            title="Security"
            value="Protected"
            icon={<ShieldCheck className="h-5 w-5" />}
            accent="emerald"
            note="Account-aware controls"
          />
          <StatCard
            title="Community"
            value="Active"
            icon={<Users className="h-5 w-5" />}
            accent="amber"
            note="Peer learning culture"
          />
          <StatCard
            title="AI"
            value="Helpful"
            icon={<Wand2 className="h-5 w-5" />}
            accent="fuchsia"
            note="Study assistance on demand"
          />
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-100">
                <Star className="h-4 w-4" />
                <span className="text-sm font-semibold">Why learners stay</span>
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-white/60">
                Students come for the tools, but they stay because the experience feels practical, motivating, and easy to use.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button leftIcon={<ArrowRight className="h-4 w-4" />}>
                Get started
              </Button>
              <Button variant="secondary" leftIcon={<BookOpen className="h-4 w-4" />}>
                Explore features
              </Button>
            </div>
          </div>
        </div>

        <footer className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 text-white/60 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-bold text-white">BEP</p>
              <p className="mt-2 text-sm leading-7">
                Bengali-first study platform for practice, mock tests, progress tracking, community, and AI learning support.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="success">Student-first</Badge>
              <Badge variant="premium">AI-powered</Badge>
              <Badge variant="secondary">Built to scale</Badge>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
