// bep-full-project/src/pages/public/HomePage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Crown,
  Globe,
  GraduationCap,
  Layers3,
  LineChart,
  MessageCircle,
  PlayCircle,
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

interface FeatureCardItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: 'cyan' | 'emerald' | 'amber' | 'fuchsia';
}

interface StepItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface TestimonialItem {
  name: string;
  role: string;
  message: string;
  rating: number;
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
  accent?: 'cyan' | 'emerald' | 'amber' | 'fuchsia';
  note?: string;
}) {
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

function FeatureCard({ item }: { item: FeatureCardItem }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.06]">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-100">
          {item.icon}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-semibold text-white">{item.title}</h4>
            <Badge
              variant={
                item.accent === 'cyan'
                  ? 'secondary'
                  : item.accent === 'emerald'
                    ? 'success'
                    : item.accent === 'amber'
                      ? 'warning'
                      : 'premium'
              }
            >
              {item.accent}
            </Badge>
          </div>
          <p className="mt-2 text-sm leading-7 text-white/55">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

function StepCard({ step, index }: { step: StepItem; index: number }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-cyan-100">
          {step.icon}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-xs font-bold text-cyan-100">
              {index}
            </span>
            <h4 className="text-lg font-semibold text-white">{step.title}</h4>
          </div>
          <p className="mt-2 text-sm leading-7 text-white/55">{step.description}</p>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold text-white">{item.name}</h4>
          <p className="mt-1 text-sm text-white/45">{item.role}</p>
        </div>

        <div className="flex items-center gap-1 text-amber-100">
          {Array.from({ length: item.rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-white/65">{item.message}</p>
    </div>
  );
}

export default function HomePage() {
  const features: FeatureCardItem[] = [
    {
      title: 'Question Bank',
      description:
        'Organized chapters, difficulty filters, weak topic tracking, and fast search for every subject.',
      icon: <BookOpen className="h-4 w-4" />,
      accent: 'cyan',
    },
    {
      title: 'Practice Engine',
      description:
        'MCQ and written practice with progress-aware sessions and topic-based revision flow.',
      icon: <Target className="h-4 w-4" />,
      accent: 'emerald',
    },
    {
      title: 'Mock Exams',
      description:
        'Timed full tests, analytics, bookmarks, and result previews designed for real exam prep.',
      icon: <PlayCircle className="h-4 w-4" />,
      accent: 'amber',
    },
    {
      title: 'AI Assistant',
      description:
        'Ask questions, generate quizzes, and get quick explanations in a Bengali-first study experience.',
      icon: <Brain className="h-4 w-4" />,
      accent: 'fuchsia',
    },
  ];

  const steps: StepItem[] = [
    {
      title: 'Complete your profile',
      description:
        'Set class, batch, language, and institution so the platform can personalize your study flow.',
      icon: <BadgeCheck className="h-4 w-4" />,
    },
    {
      title: 'Practice daily',
      description:
        'Use topic practice and weak topic review to build accuracy and maintain streaks.',
      icon: <Clock3 className="h-4 w-4" />,
    },
    {
      title: 'Take mock tests',
      description:
        'Measure your preparation with timed exams, analytics, and performance snapshots.',
      icon: <Trophy className="h-4 w-4" />,
    },
    {
      title: 'Climb the leaderboard',
      description:
        'Earn points through consistency, accuracy, and engagement across the BEP ecosystem.',
      icon: <Crown className="h-4 w-4" />,
    },
  ];

  const testimonials: TestimonialItem[] = [
    {
      name: 'Arafat Hossain',
      role: 'HSC Student',
      message:
        'Practice section and AI assistant both are super useful. I can revise faster and track my weak topics clearly.',
      rating: 5,
    },
    {
      name: 'Mim Akter',
      role: 'Admission Candidate',
      message:
        'Mock tests feel close to real exam prep, and the dashboard makes my progress easy to understand.',
      rating: 5,
    },
    {
      name: 'Sabbir Rahman',
      role: 'Moderator',
      message:
        'Community, leaderboard, and analytics are all in one place. It feels like a complete study platform.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050816] p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
          <div className="relative overflow-hidden p-6 md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_28%)]" />
            <div className="relative z-10 grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  BEP — Bengali-first AI Learning Platform
                </div>

                <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
                  Learn smarter, practice harder, and grow faster.
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-8 text-white/60 md:text-base">
                  BEP combines question bank, practice engine, mock tests, leaderboard,
                  community, progress analytics, and AI study help in one clean study workspace.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button leftIcon={<ArrowRight className="h-4 w-4" />}>
                    Get started
                  </Button>
                  <Button variant="secondary" leftIcon={<PlayCircle className="h-4 w-4" />}>
                    Watch demo
                  </Button>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Badge variant="success">
                    <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                    Secure
                  </Badge>
                  <Badge variant="premium">
                    <Crown className="mr-1 h-3.5 w-3.5" />
                    Premium tools
                  </Badge>
                  <Badge variant="secondary">
                    <Globe className="mr-1 h-3.5 w-3.5" />
                    Bengali-first
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[32px] border border-white/10 bg-[#08111F]/75 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
                  <div className="mb-4 flex items-center gap-2 text-cyan-100">
                    <LineChart className="h-4 w-4" />
                    <span className="text-sm font-semibold">Platform snapshot</span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <StatCard
                      title="Active learners"
                      value="24K+"
                      icon={<Users className="h-5 w-5" />}
                      accent="cyan"
                      note="Monthly growth"
                    />
                    <StatCard
                      title="Average accuracy"
                      value="87%"
                      icon={<Target className="h-5 w-5" />}
                      accent="emerald"
                      note="Practice sessions"
                    />
                    <StatCard
                      title="Mock tests"
                      value="180+"
                      icon={<GraduationCap className="h-5 w-5" />}
                      accent="amber"
                      note="Timed exams"
                    />
                    <StatCard
                      title="AI interactions"
                      value="84K"
                      icon={<Brain className="h-5 w-5" />}
                      accent="fuchsia"
                      note="Study responses"
                    />
                  </div>
                </div>

                <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="mb-4 flex items-center gap-2 text-cyan-100">
                    <Wand2 className="h-4 w-4" />
                    <span className="text-sm font-semibold">What you can do</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3">
                      <span className="text-sm text-white/65">Practice by subject and chapter</span>
                      <ChevronRight className="h-4 w-4 text-white/35" />
                    </div>
                    <div className="flex items-center justify-between rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3">
                      <span className="text-sm text-white/65">Review weak topics automatically</span>
                      <ChevronRight className="h-4 w-4 text-white/35" />
                    </div>
                    <div className="flex items-center justify-between rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3">
                      <span className="text-sm text-white/65">Track streaks and leaderboard rank</span>
                      <ChevronRight className="h-4 w-4 text-white/35" />
                    </div>
                    <div className="flex items-center justify-between rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3">
                      <span className="text-sm text-white/65">Get AI explanations and quiz generation</span>
                      <ChevronRight className="h-4 w-4 text-white/35" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Study minutes"
            value="610"
            icon={<Clock3 className="h-5 w-5" />}
            accent="cyan"
            note="This week"
          />
          <StatCard
            title="Questions solved"
            value="1,248"
            icon={<CheckCircle2 className="h-5 w-5" />}
            accent="emerald"
            note="Across sessions"
          />
          <StatCard
            title="Streak"
            value="14d"
            icon={<Star className="h-5 w-5" />}
            accent="amber"
            note="Consistency matters"
          />
          <StatCard
            title="Rank movement"
            value="+8"
            icon={<Trophy className="h-5 w-5" />}
            accent="fuchsia"
            note="Leaderboard climb"
          />
        </section>

        <section className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
          <SectionTitle
            icon={<Layers3 className="h-4 w-4" />}
            title="Core features"
            description="Everything is built to support a complete study journey from practice to performance."
          />

          <div className="grid gap-4 lg:grid-cols-2">
            {features.map((item) => (
              <FeatureCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <SectionTitle
              icon={<BookOpen className="h-4 w-4" />}
              title="How it works"
              description="A simple flow to move from setup to daily growth."
            />

            <div className="grid gap-4">
              {steps.map((step, index) => (
                <StepCard key={step.title} step={step} index={index + 1} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
              <SectionTitle
                icon={<MessageCircle className="h-4 w-4" />}
                title="What learners say"
                description="Students use BEP for revision, practice, and confidence before exams."
              />

              <div className="space-y-4">
                {testimonials.map((item) => (
                  <TestimonialCard key={item.name} item={item} />
                ))}
              </div>
            </div>

            <div className="rounded-[36px] border border-white/10 bg-[#08111F]/75 p-6 backdrop-blur-2xl">
              <div className="mb-4 flex items-center gap-2 text-cyan-100">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm font-semibold">Why BEP feels different</span>
              </div>

              <div className="space-y-3 text-sm leading-8 text-white/65">
                <p>It is not just a question bank. It is a study system with progress, community, and AI.</p>
                <p>It keeps the design simple so learners can focus on revision instead of hunting for tools.</p>
                <p>It supports protected routes, premium features, and admin controls for a real platform setup.</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button leftIcon={<ArrowRight className="h-4 w-4" />}>Create account</Button>
                <Button variant="secondary" leftIcon={<PlayCircle className="h-4 w-4" />}>
                  Explore demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Community"
            value="8.4K"
            icon={<Users className="h-5 w-5" />}
            accent="cyan"
            note="Monthly active members"
          />
          <StatCard
            title="Questions"
            value="320K+"
            icon={<BookOpen className="h-5 w-5" />}
            accent="emerald"
            note="In the bank"
          />
          <StatCard
            title="Analytics"
            value="Real-time"
            icon={<LineChart className="h-5 w-5" />}
            accent="amber"
            note="Track your progress"
          />
          <StatCard
            title="AI Help"
            value="Always on"
            icon={<Brain className="h-5 w-5" />}
            accent="fuchsia"
            note="Study assistant ready"
          />
        </section>

        <section className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-100">
                <BadgeCheck className="h-4 w-4" />
                <span className="text-sm font-semibold">Ready to start?</span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
                Sign in, complete your profile, and begin with practice sessions that actually fit your level.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button leftIcon={<ArrowRight className="h-4 w-4" />}>Get started</Button>
              <Button variant="secondary" leftIcon={<Globe className="h-4 w-4" />}>
                Learn more
              </Button>
            </div>
          </div>
        </section>

        <footer className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 text-white/60 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-bold text-white">BEP</p>
              <p className="mt-2 text-sm leading-7">
                Bengali-first AI learning platform for students, practice, mock tests, progress, and community.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="success">Secure</Badge>
              <Badge variant="premium">Modern</Badge>
              <Badge variant="secondary">Student-focused</Badge>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
