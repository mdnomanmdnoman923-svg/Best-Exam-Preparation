// bep-full-project/src/pages/public/PricingPage.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Crown,
  Gift,
  GraduationCap,
  HelpCircle,
  Layers3,
  LineChart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Wand2,
  Zap,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

type BillingCycle = 'monthly' | 'yearly';

type PlanKey = 'starter' | 'pro' | 'premium';

interface PlanFeature {
  title: string;
  starter: boolean | string;
  pro: boolean | string;
  premium: boolean | string;
}

interface PricingPlan {
  key: PlanKey;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  badge?: string;
  icon: React.ReactNode;
  highlight?: boolean;
  accent: 'cyan' | 'emerald' | 'amber' | 'fuchsia';
  ctaLabel: string;
  features: string[];
}

interface FAQItem {
  q: string;
  a: string;
}

function formatPrice(value: number) {
  if (value === 0) return 'Free';
  return `৳${new Intl.NumberFormat('en-US').format(value)}`;
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

function PlanCard({
  plan,
  cycle,
}: {
  plan: PricingPlan;
  cycle: BillingCycle;
}) {
  const price = cycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

  const accentMap = {
    cyan: 'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
    emerald: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
    amber: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
    fuchsia: 'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100',
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className={[
        'relative overflow-hidden rounded-[34px] border p-6 backdrop-blur-2xl',
        plan.highlight
          ? 'border-cyan-400/20 bg-cyan-400/10 shadow-[0_24px_80px_rgba(0,0,0,0.30)]'
          : 'border-white/10 bg-white/[0.04]',
      ].join(' ')}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.07),transparent_22%)]" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className={['flex h-12 w-12 items-center justify-center rounded-2xl border', accentMap[plan.accent]].join(' ')}>
            {plan.icon}
          </div>

          {plan.badge ? (
            <Badge variant={plan.highlight ? 'premium' : 'secondary'}>{plan.badge}</Badge>
          ) : null}
        </div>

        <div className="mt-5">
          <h3 className="text-2xl font-black tracking-tight text-white">{plan.name}</h3>
          <p className="mt-2 text-sm leading-7 text-white/60">{plan.description}</p>
        </div>

        <div className="mt-6 flex items-end gap-2">
          <div className="text-5xl font-black tracking-tight text-white">{formatPrice(price)}</div>
          <div className="pb-1 text-sm text-white/45">/{cycle === 'monthly' ? 'month' : 'year'}</div>
        </div>

        {cycle === 'yearly' && price > 0 ? (
          <p className="mt-2 text-sm text-emerald-100">
            Annual billing saves more than paying every month.
          </p>
        ) : null}

        <div className="mt-6 space-y-3">
          {plan.features.map((feature) => (
            <div
              key={feature}
              className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-100" />
              <span className="text-sm leading-7 text-white/65">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Button
            className="w-full"
            leftIcon={plan.highlight ? <Sparkles className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          >
            {plan.ctaLabel}
          </Button>

          <Button variant="secondary" className="w-full">
            Compare details
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function ComparisonCell({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? (
      <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-100" />
    ) : (
      <span className="text-white/30">—</span>
    );
  }

  return <span className="text-sm text-white/65">{value}</span>;
}

function ComparisonRow({
  label,
  starter,
  pro,
  premium,
}: {
  label: string;
  starter: boolean | string;
  pro: boolean | string;
  premium: boolean | string;
}) {
  return (
    <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <div className="text-sm text-white/70">{label}</div>
      <div className="flex items-center justify-center">
        <ComparisonCell value={starter} />
      </div>
      <div className="flex items-center justify-center">
        <ComparisonCell value={pro} />
      </div>
      <div className="flex items-center justify-center">
        <ComparisonCell value={premium} />
      </div>
    </div>
  );
}

function FAQCard({ item }: { item: FAQItem }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-100">
          <HelpCircle className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-base font-semibold text-white">{item.q}</h4>
          <p className="mt-2 text-sm leading-7 text-white/60">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
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

export default function PricingPage() {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');

  const plans = useMemo<PricingPlan[]>(
    () => [
      {
        key: 'starter',
        name: 'Starter',
        description: 'Try BEP with core practice tools and a clean study dashboard.',
        monthlyPrice: 0,
        yearlyPrice: 0,
        badge: 'Free',
        icon: <BookOpen className="h-4 w-4" />,
        accent: 'cyan',
        ctaLabel: 'Start free',
        features: [
          'Question bank access',
          'Basic practice engine',
          'Profile and progress tracking',
          'Limited AI assistance',
          'Community reading access',
        ],
      },
      {
        key: 'pro',
        name: 'Pro',
        description: 'For serious learners who want stronger practice and better analytics.',
        monthlyPrice: 299,
        yearlyPrice: 2990,
        badge: 'Most Popular',
        icon: <Target className="h-4 w-4" />,
        accent: 'emerald',
        highlight: true,
        ctaLabel: 'Go Pro',
        features: [
          'Unlimited practice sessions',
          'Full mock test access',
          'AI assistant priority',
          'Progress analytics dashboard',
          'Weak topic recommendations',
          'Community participation tools',
        ],
      },
      {
        key: 'premium',
        name: 'Premium',
        description: 'The full BEP stack with advanced tools, priority support, and extras.',
        monthlyPrice: 599,
        yearlyPrice: 5990,
        badge: 'Best Value',
        icon: <Crown className="h-4 w-4" />,
        accent: 'fuchsia',
        ctaLabel: 'Unlock Premium',
        features: [
          'All Pro features',
          'Premium question packs',
          'Priority AI responses',
          'Leaderboard boosts',
          'Early access to new features',
          'Creator / admin perks',
        ],
      },
    ],
    [],
  );

  const faqs: FAQItem[] = [
    {
      q: 'Can I change plans later?',
      a: 'Yes. You can upgrade or downgrade at any time, and the next billing cycle will reflect the change.',
    },
    {
      q: 'Is there a free plan?',
      a: 'Yes. Starter is free and includes the core learning experience so you can explore before upgrading.',
    },
    {
      q: 'Do yearly plans save money?',
      a: 'Yes. Yearly billing is cheaper than paying monthly across a full year.',
    },
    {
      q: 'Will my progress sync across devices?',
      a: 'Yes. Your account, saved items, progress, and analytics stay synced across supported devices.',
    },
  ];

  const comparison: PlanFeature[] = [
    {
      title: 'Question bank',
      starter: true,
      pro: true,
      premium: true,
    },
    {
      title: 'Unlimited practice',
      starter: false,
      pro: true,
      premium: true,
    },
    {
      title: 'Mock tests',
      starter: 'Limited',
      pro: true,
      premium: true,
    },
    {
      title: 'AI assistant priority',
      starter: 'Basic',
      pro: 'Priority',
      premium: 'Highest',
    },
    {
      title: 'Advanced analytics',
      starter: false,
      pro: true,
      premium: true,
    },
    {
      title: 'Leaderboard boosts',
      starter: false,
      pro: false,
      premium: true,
    },
    {
      title: 'Early feature access',
      starter: false,
      pro: false,
      premium: true,
    },
  ];

  const billingNote = cycle === 'monthly' ? 'Billed monthly' : 'Billed yearly';

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
                  BEP Pricing
                </div>

                <h1 className="text-5xl font-black tracking-tight md:text-6xl">
                  Pick a plan that matches your study speed.
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-8 text-white/60 md:text-base">
                  Start free, upgrade to Pro for deeper practice, or unlock Premium for the full learning stack with priority AI and advanced tools.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">
                  <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                  Secure checkout
                </Badge>
                <Badge variant="premium">
                  <Crown className="mr-1 h-3.5 w-3.5" />
                  Premium tools
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Learners"
            value="24K+"
            icon={<Users className="h-5 w-5" />}
            accent="cyan"
            note="Monthly active users"
          />
          <StatCard
            title="Accuracy"
            value="87%"
            icon={<Target className="h-5 w-5" />}
            accent="emerald"
            note="Average practice score"
          />
          <StatCard
            title="Mock Tests"
            value="180+"
            icon={<GraduationCap className="h-5 w-5" />}
            accent="amber"
            note="Exam-ready test bank"
          />
          <StatCard
            title="AI Help"
            value="On"
            icon={<Wand2 className="h-5 w-5" />}
            accent="fuchsia"
            note="Always ready to assist"
          />
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-100">
                <Crown className="h-4 w-4" />
                <span className="text-sm font-semibold">Billing cycle</span>
              </div>
              <p className="mt-2 text-sm leading-7 text-white/55">
                Toggle between monthly and yearly pricing.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-[24px] border border-white/10 bg-[#08111F]/75 p-2">
              <button
                type="button"
                onClick={() => setCycle('monthly')}
                className={[
                  'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                  cycle === 'monthly'
                    ? 'bg-cyan-400/10 text-cyan-100'
                    : 'text-white/55 hover:text-white',
                ].join(' ')}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setCycle('yearly')}
                className={[
                  'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                  cycle === 'yearly'
                    ? 'bg-cyan-400/10 text-cyan-100'
                    : 'text-white/55 hover:text-white',
                ].join(' ')}
              >
                Yearly
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm text-white/45">{billingNote}</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.key} plan={plan} cycle={cycle} />
          ))}
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
          <SectionTitle
            icon={<Layers3 className="h-4 w-4" />}
            title="Plan comparison"
            description="A quick side-by-side view of the most important differences."
          />

          <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#08111F]/75 p-4">
            <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              <div>Feature</div>
              <div className="text-center">Starter</div>
              <div className="text-center">Pro</div>
              <div className="text-center">Premium</div>
            </div>

            <div className="mt-3 space-y-3">
              {comparison.map((row) => (
                <ComparisonRow
                  key={row.title}
                  label={row.title}
                  starter={row.starter}
                  pro={row.pro}
                  premium={row.premium}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <SectionTitle
              icon={<Trophy className="h-4 w-4" />}
              title="Why upgrade"
              description="More tools help learners build consistency, speed, and confidence."
            />

            <div className="space-y-3">
              <BenefitCard
                icon={<BookOpen className="h-4 w-4" />}
                title="More practice"
                description="Unlimited sessions and better coverage across topics."
              />
              <BenefitCard
                icon={<LineChart className="h-4 w-4" />}
                title="Better insights"
                description="Track weak topics, streaks, scores, and ranking movement."
              />
              <BenefitCard
                icon={<Wand2 className="h-4 w-4" />}
                title="Smarter AI"
                description="Priority responses and better study help."
              />
              <BenefitCard
                icon={<ShieldCheck className="h-4 w-4" />}
                title="Exam confidence"
                description="Mock tests and revision tools for serious prep."
              />
            </div>

            <div className="mt-6 rounded-[28px] border border-cyan-400/15 bg-cyan-400/10 p-4">
              <p className="text-sm leading-7 text-white/75">
                Most learners start with Pro because it balances value and study power well.
              </p>
            </div>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <SectionTitle
              icon={<HelpCircle className="h-4 w-4" />}
              title="Frequently asked questions"
              description="A few common questions students ask before upgrading."
            />

            <div className="space-y-4">
              {faqs.map((item) => (
                <FAQCard key={item.q} item={item} />
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Free plan"
            value={formatPrice(0)}
            icon={<Gift className="h-5 w-5" />}
            accent="cyan"
            note="Try core features"
          />
          <StatCard
            title="Best value"
            value="Pro"
            icon={<Star className="h-5 w-5" />}
            accent="emerald"
            note="Most popular choice"
          />
          <StatCard
            title="Maximum power"
            value="Premium"
            icon={<Flame className="h-5 w-5" />}
            accent="fuchsia"
            note="Full feature access"
          />
          <StatCard
            title="Billing"
            value={billingNote}
            icon={<Clock3 className="h-5 w-5" />}
            accent="amber"
            note="Switch anytime"
          />
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-100">
                <BadgeCheck className="h-4 w-4" />
                <span className="text-sm font-semibold">Ready to choose?</span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
                Start free and upgrade later when you want more practice, deeper analytics, and stronger AI support.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button leftIcon={<ArrowRight className="h-4 w-4" />}>Start free</Button>
              <Button variant="secondary" leftIcon={<Crown className="h-4 w-4" />}>
                Go Premium
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
