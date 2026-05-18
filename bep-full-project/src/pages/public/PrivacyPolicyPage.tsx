// bep-full-project/src/pages/public/PrivacyPolicyPage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Clock3,
  Cloud,
  EyeOff,
  FileText,
  Globe,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface PolicySection {
  id: string;
  title: string;
  content: string[];
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

        <div
          className={['flex h-14 w-14 items-center justify-center rounded-2xl border', accentMap[accent]].join(' ')}
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

function PolicyCard({ section }: { section: PolicySection }) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-2 text-cyan-100">
        <FileText className="h-4 w-4" />
        <span className="text-sm font-semibold">{section.title}</span>
      </div>

      <div className="space-y-3 text-sm leading-7 text-white/65">
        {section.content.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}

function BulletCard({
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

export default function PrivacyPolicyPage() {
  const sections: PolicySection[] = [
    {
      id: '1',
      title: '1. Information we collect',
      content: [
        'We collect information you provide directly, such as your name, email address, profile details, and study preferences when you create or update your account.',
        'We also collect learning activity data such as practice attempts, mock test scores, streaks, saved questions, and community interactions to improve your experience on BEP.',
        'Certain technical data may be collected automatically, including device information, browser type, IP address, and usage events for security, diagnostics, and analytics.',
      ],
    },
    {
      id: '2',
      title: '2. How we use your information',
      content: [
        'We use your information to provide core features such as login, question practice, mock tests, progress tracking, leaderboard ranking, and AI study assistance.',
        'Your data helps us personalize recommendations, suggest weak topics, and show relevant study content based on your class, subject, and activity history.',
        'We may also use data to maintain security, detect abuse, improve app performance, and communicate important account or policy updates.',
      ],
    },
    {
      id: '3',
      title: '3. Sharing and disclosure',
      content: [
        'We do not sell your personal information. We only share data when it is needed to operate the platform, comply with law, protect safety, or provide a requested service.',
        'Some profile or activity information may be visible to other users depending on your privacy settings, such as leaderboard display names or community posts.',
        'Service providers that help us with hosting, analytics, authentication, and messaging may process data on our behalf under appropriate safeguards.',
      ],
    },
    {
      id: '4',
      title: '4. Data retention and security',
      content: [
        'We keep your information only as long as necessary to provide the service, meet legal obligations, resolve disputes, and enforce our terms.',
        'We use reasonable administrative, technical, and organizational measures to protect data against unauthorized access, loss, misuse, or alteration.',
        'No system is perfectly secure, so we encourage you to use a strong password and enable additional security options where available.',
      ],
    },
    {
      id: '5',
      title: '5. Your choices and rights',
      content: [
        'You can review and update profile information, change privacy controls, manage notification preferences, and delete or request access to certain data depending on the account settings available to you.',
        'If you do not want some activity to be public, you can adjust visibility settings or choose not to share optional fields in your profile.',
        'You may contact us to ask questions about your data, account, or privacy choices, and we will do our best to help in a timely manner.',
      ],
    },
    {
      id: '6',
      title: '6. Changes to this policy',
      content: [
        'We may update this Privacy Policy from time to time to reflect product changes, legal requirements, or operational improvements.',
        'When we make meaningful changes, we may provide notice through the app, email, or another reasonable communication channel.',
        'Your continued use of BEP after an update means you accept the revised policy.',
      ],
    },
  ];

  const highlights = [
    {
      title: 'Profile control',
      description: 'Update your name, batch, class, and visibility preferences anytime.',
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: 'Learning analytics',
      description: 'Practice history, streaks, and weak topics help personalize your study flow.',
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      title: 'Secure access',
      description: 'We use account protection, session controls, and security checks to keep data safe.',
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      title: 'Privacy by design',
      description: 'Public visibility is limited to what you choose to share in your settings.',
      icon: <EyeOff className="h-4 w-4" />,
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
                  BEP Legal & Trust
                </div>

                <h1 className="text-5xl font-black tracking-tight md:text-6xl">
                  Privacy Policy
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-8 text-white/60 md:text-base">
                  This page explains how BEP collects, uses, shares, and protects your information while you study, practice, and interact on the platform.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">
                  <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                  Privacy aware
                </Badge>
                <Badge variant="premium">
                  <Lock className="mr-1 h-3.5 w-3.5" />
                  Secure platform
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Data control"
            value="High"
            icon={<EyeOff className="h-5 w-5" />}
            accent="cyan"
            note="Visibility settings available"
          />
          <StatCard
            title="Security"
            value="Protected"
            icon={<ShieldCheck className="h-5 w-5" />}
            accent="emerald"
            note="Reasonable safeguards in place"
          />
          <StatCard
            title="Support"
            value="24/7"
            icon={<Mail className="h-5 w-5" />}
            accent="amber"
            note="Contact us for privacy help"
          />
          <StatCard
            title="Policy updates"
            value="Occasional"
            icon={<Clock3 className="h-5 w-5" />}
            accent="fuchsia"
            note="Reviewed as the product evolves"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
              <SectionTitle
                icon={<Cloud className="h-4 w-4" />}
                title="At a glance"
                description="A quick overview of the most important privacy commitments."
              />

              <div className="grid gap-3">
                {highlights.map((item) => (
                  <BulletCard key={item.title} {...item} />
                ))}
              </div>
            </div>

            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
              <SectionTitle
                icon={<Globe className="h-4 w-4" />}
                title="Key rights and controls"
                description="You control the information you provide and how much of it appears publicly."
              />

              <div className="space-y-3 text-sm leading-7 text-white/65">
                <p>You can edit your profile details and preference settings from the account pages.</p>
                <p>You may choose whether to show your activity, progress, or community contributions publicly.</p>
                <p>Notifications, privacy options, and account recovery information can be updated over time.</p>
              </div>

              <div className="mt-5 rounded-[28px] border border-cyan-400/15 bg-cyan-400/10 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-cyan-100" />
                  <p className="text-sm leading-7 text-white/75">
                    We keep privacy controls simple so learners can focus on studying while still staying in control.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-cyan-100">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-semibold">Policy details</span>
                </div>
                <p className="mt-2 text-sm leading-7 text-white/55">
                  The sections below summarize how the platform handles data.
                </p>
              </div>

              <Badge variant="secondary">Updated as needed</Badge>
            </div>

            <div className="space-y-4">
              {sections.map((section) => (
                <PolicyCard key={section.id} section={section} />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
          <SectionTitle
            icon={<Wand2 className="h-4 w-4" />}
            title="Why this matters for BEP"
            description="Privacy supports trust, especially in a platform built around study progress and community."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MiniNote
              title="Study personalization"
              text="Analytics help tailor the AI and practice flow to your level."
              icon={<BookOpen className="h-4 w-4" />}
            />
            <MiniNote
              title="Community safety"
              text="Visibility controls help users share only what they want."
              icon={<Users className="h-4 w-4" />}
            />
            <MiniNote
              title="Account protection"
              text="Security measures help prevent unauthorized access."
              icon={<Lock className="h-4 w-4" />}
            />
            <MiniNote
              title="Transparent rules"
              text="Clear policy language makes the platform easier to trust."
              icon={<FileText className="h-4 w-4" />}
            />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <SectionTitle
              icon={<MessageCircle className="h-4 w-4" />}
              title="Questions or concerns"
              description="Reach out if you want help understanding your privacy options."
            />

            <div className="space-y-3 text-sm leading-7 text-white/65">
              <p>For account or privacy questions, contact the support team from the app or through the support email.</p>
              <p>If you believe something about your data is incorrect, ask us to review it.</p>
              <p>We try to answer privacy requests in a fair and timely way.</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button leftIcon={<ArrowRight className="h-4 w-4" />}>Contact support</Button>
              <Button variant="secondary" leftIcon={<Mail className="h-4 w-4" />}>
                Email us
              </Button>
            </div>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-[#08111F]/75 p-6 backdrop-blur-2xl">
            <div className="mb-4 flex items-center gap-2 text-cyan-100">
              <Clock3 className="h-4 w-4" />
              <span className="text-sm font-semibold">Policy summary</span>
            </div>

            <div className="space-y-3 text-sm leading-8 text-white/65">
              <p>We collect account, study, and technical data to run BEP and improve the learning experience.</p>
              <p>We use that data for personalization, security, analytics, and platform communication.</p>
              <p>We do not sell personal information, and you can manage what becomes public through settings.</p>
              <p>We may update this policy as the product changes, and we will notify you when needed.</p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge variant="success">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                User control
              </Badge>
              <Badge variant="premium">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                Data protection
              </Badge>
            </div>
          </div>
        </div>

        <footer className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 text-white/60 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-bold text-white">BEP Privacy Policy</p>
              <p className="mt-2 text-sm leading-7">
                This is a product-ready privacy policy page template for the BEP platform. Update the policy text with your final legal wording before publishing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">Privacy-first</Badge>
              <Badge variant="success">Transparent</Badge>
              <Badge variant="premium">Secure</Badge>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function MiniNote({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
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
          <p className="mt-1 text-sm leading-6 text-white/55">{text}</p>
        </div>
      </div>
    </div>
  );
}
