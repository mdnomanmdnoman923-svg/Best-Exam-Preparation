// bep-full-project/src/pages/public/TermsPage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileText,
  Globe,
  Handshake,
  Lock,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface TermsSection {
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

function TermsCard({ section }: { section: TermsSection }) {
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

export default function TermsPage() {
  const sections: TermsSection[] = [
    {
      id: '1',
      title: '1. Acceptance of terms',
      content: [
        'By accessing or using BEP, you agree to these Terms of Service and any additional policies that apply to specific features.',
        'If you do not agree with any part of the Terms, you should stop using the platform.',
        'These Terms apply to all users, including visitors, registered users, and premium subscribers.',
      ],
    },
    {
      id: '2',
      title: '2. Account registration and responsibilities',
      content: [
        'You are responsible for providing accurate information when creating and updating your account.',
        'Keep your login credentials safe and do not share them with others.',
        'You are responsible for all activity that happens under your account unless you report unauthorized access promptly.',
      ],
    },
    {
      id: '3',
      title: '3. Use of the platform',
      content: [
        'BEP is designed for learning, practice, mock tests, progress tracking, and community discussion.',
        'You agree not to misuse the service, attempt unauthorized access, interfere with platform operations, or use content in a harmful way.',
        'We may limit or suspend access if we believe a user is violating the Terms or compromising platform safety.',
      ],
    },
    {
      id: '4',
      title: '4. Content and intellectual property',
      content: [
        'The BEP platform, design, code, branding, and original content are protected by intellectual property rights.',
        'You may use the service for personal learning purposes only, unless we grant separate permission in writing.',
        'Any content you submit to the community or platform remains subject to our policies and may be moderated for safety and quality.',
      ],
    },
    {
      id: '5',
      title: '5. Payments, subscriptions, and billing',
      content: [
        'Some features of BEP may require a paid subscription or premium access.',
        'By purchasing a plan, you agree to the pricing, billing cycle, and renewal rules shown at checkout or on the pricing page.',
        'Refunds, if available, will follow the refund policy or support process communicated by BEP.',
      ],
    },
    {
      id: '6',
      title: '6. Termination and suspension',
      content: [
        'We may suspend or terminate access if a user violates the Terms, misuses the platform, or creates a security risk.',
        'You may stop using the service at any time and may delete your account through the available account settings or support process.',
        'Certain obligations, such as intellectual property protections and liability limits, may continue after termination.',
      ],
    },
    {
      id: '7',
      title: '7. Changes to the service and terms',
      content: [
        'We may improve, modify, or discontinue features from time to time to keep the platform useful and secure.',
        'We may update these Terms when necessary. If changes are significant, we may provide notice within the app or by email.',
        'Continued use after an update means you accept the revised Terms.',
      ],
    },
  ];

  const highlights = [
    {
      title: 'Account safety',
      description: 'Protect your login credentials and keep your account activity secure.',
      icon: <Lock className="h-4 w-4" />,
    },
    {
      title: 'Respectful use',
      description: 'Use the learning tools, community, and AI features responsibly.',
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: 'Subscription clarity',
      description: 'Paid plans follow the pricing and billing details shown in the app.',
      icon: <Handshake className="h-4 w-4" />,
    },
    {
      title: 'Platform trust',
      description: 'We maintain rules and moderation so BEP stays safe and useful.',
      icon: <ShieldCheck className="h-4 w-4" />,
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
                  Terms of Service
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-8 text-white/60 md:text-base">
                  These Terms explain how you can use BEP, what we provide, and the responsibilities that apply when using our learning platform.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">
                  <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                  Clear rules
                </Badge>
                <Badge variant="premium">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  Secure platform
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Trust"
            value="High"
            icon={<ShieldCheck className="h-5 w-5" />}
            accent="emerald"
            note="Rules and moderation"
          />
          <StatCard
            title="Clarity"
            value="Simple"
            icon={<FileText className="h-5 w-5" />}
            accent="cyan"
            note="Easy-to-read terms"
          />
          <StatCard
            title="Support"
            value="Available"
            icon={<Clock3 className="h-5 w-5" />}
            accent="amber"
            note="Help when needed"
          />
          <StatCard
            title="Users"
            value="All"
            icon={<Users className="h-5 w-5" />}
            accent="fuchsia"
            note="Visitors and members"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
              <SectionTitle
                icon={<ShieldCheck className="h-4 w-4" />}
                title="At a glance"
                description="The most important rules and responsibilities in one place."
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
                title="Using BEP responsibly"
                description="Your study activity, community behavior, and account use should stay safe and respectful."
              />

              <div className="space-y-3 text-sm leading-7 text-white/65">
                <p>Use the platform for learning, revision, practice, and related educational purposes.</p>
                <p>Do not try to disrupt service, access accounts without permission, or misuse data.</p>
                <p>Follow community guidelines and any rules shown for specific features or events.</p>
              </div>

              <div className="mt-5 rounded-[28px] border border-cyan-400/15 bg-cyan-400/10 p-4">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-4 w-4 text-cyan-100" />
                  <p className="text-sm leading-7 text-white/75">
                    A safe, well-behaved community keeps the platform helpful for everyone.
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
                  <span className="text-sm font-semibold">Terms details</span>
                </div>
                <p className="mt-2 text-sm leading-7 text-white/55">
                  The sections below summarize the key legal points.
                </p>
              </div>

              <Badge variant="secondary">Updated as needed</Badge>
            </div>

            <div className="space-y-4">
              {sections.map((section) => (
                <TermsCard key={section.id} section={section} />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
          <SectionTitle
            icon={<BookOpen className="h-4 w-4" />}
            title="What this means for learners"
            description="BEP is built to be useful, but it still works best when everyone follows the rules."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MiniNote
              title="Use for learning"
              text="Practice, mock exams, and AI study help are meant for educational use."
              icon={<BookOpen className="h-4 w-4" />}
            />
            <MiniNote
              title="Protect your account"
              text="Keep your password private and use available security controls."
              icon={<Lock className="h-4 w-4" />}
            />
            <MiniNote
              title="Respect the community"
              text="Posts, replies, and mentions should stay constructive and safe."
              icon={<Users className="h-4 w-4" />}
            />
            <MiniNote
              title="Billing is transparent"
              text="Any paid plan follows the pricing details shown in the product."
              icon={<Handshake className="h-4 w-4" />}
            />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
            <SectionTitle
              icon={<MessageCircle className="h-4 w-4" />}
              title="Questions or concerns"
              description="Reach out to the support team if you need help understanding these Terms."
            />

            <div className="space-y-3 text-sm leading-7 text-white/65">
              <p>If you are unsure how the Terms apply to your account, contact support from inside the app.</p>
              <p>We can help with billing questions, account issues, and general platform guidance.</p>
              <p>For significant policy changes, we may notify users by email or in-app message.</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button leftIcon={<ArrowRight className="h-4 w-4" />}>Contact support</Button>
              <Button variant="secondary" leftIcon={<Wand2 className="h-4 w-4" />}>
                Explore features
              </Button>
            </div>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-[#08111F]/75 p-6 backdrop-blur-2xl">
            <div className="mb-4 flex items-center gap-2 text-cyan-100">
              <Clock3 className="h-4 w-4" />
              <span className="text-sm font-semibold">Summary</span>
            </div>

            <div className="space-y-3 text-sm leading-8 text-white/65">
              <p>Use BEP for educational purposes and keep your account information accurate.</p>
              <p>Respect platform safety, community rules, and intellectual property rights.</p>
              <p>Some features may require a subscription and are governed by billing details shown in the app.</p>
              <p>We may update the Terms when the product changes or to reflect legal requirements.</p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge variant="success">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                Student-friendly
              </Badge>
              <Badge variant="premium">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                Secure usage
              </Badge>
            </div>
          </div>
        </div>

        <footer className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 text-white/60 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-bold text-white">BEP Terms of Service</p>
              <p className="mt-2 text-sm leading-7">
                This page is a product-ready terms template for the BEP platform. Replace the text with your final legal wording before publishing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">Clear</Badge>
              <Badge variant="success">Fair</Badge>
              <Badge variant="premium">Trusted</Badge>
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
