// bep-full-project/src/pages/protected/ChangePasswordPage.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  KeyRound,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import PasswordChangeForm from '@/features/settings/components/PasswordChangeForm';

interface SecurityTipItem {
  id: string;
  title: string;
  description: string;
}

const securityTips: SecurityTipItem[] = [
  {
    id: 'tip-1',
    title: 'Use a strong mix',
    description:
      'Uppercase, lowercase, number, এবং special character combine করুন।',
  },
  {
    id: 'tip-2',
    title: 'Do not reuse passwords',
    description:
      'Same password multiple accounts এ ব্যবহার করলে risk বেড়ে যায়।',
  },
  {
    id: 'tip-3',
    title: 'Keep 2FA enabled',
    description:
      'Two-factor authentication থাকলে account আরও secure থাকে।',
  },
  {
    id: 'tip-4',
    title: 'Update regularly',
    description:
      'সময় সময় password update করলে long-term protection improve হয়।',
  },
];

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
          <h3 className="mt-2 text-4xl font-black tracking-tight text-white">
            {value}
          </h3>
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

function TipRow({ item }: { item: SecurityTipItem }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#08111F]/75 p-4">
      <h4 className="text-sm font-semibold text-white">{item.title}</h4>
      <p className="mt-2 text-sm leading-7 text-white/55">{item.description}</p>
    </div>
  );
}

export default function ChangePasswordPage() {
  const [saved, setSaved] = useState(false);

  const stats = useMemo(
    () => [
      {
        title: 'Security Score',
        value: '92%',
        icon: <ShieldCheck className="h-5 w-5" />,
        accent: 'emerald' as const,
        note: 'Based on current password policy',
      },
      {
        title: '2FA Status',
        value: 'Enabled',
        icon: <BadgeCheck className="h-5 w-5" />,
        accent: 'fuchsia' as const,
        note: 'Recommended for all accounts',
      },
      {
        title: 'Min Length',
        value: '10+',
        icon: <KeyRound className="h-5 w-5" />,
        accent: 'amber' as const,
        note: 'Admin enforced policy',
      },
      {
        title: 'Risk Level',
        value: 'Low',
        icon: <Lock className="h-5 w-5" />,
        accent: 'cyan' as const,
        note: 'Protected with active security rules',
      },
    ],
    [],
  );

  const handleSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

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
                  Protected Account Area
                </div>

                <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                  Change Password
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  নিজের account security আপডেট করুন। একটি strong password ব্যবহার করলে
                  session এবং recovery flow আরও safe হয়।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Secure Area
                </Badge>
                <Badge variant="premium">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  Account Protected
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
            <PasswordChangeForm
              requireCurrentPassword
              minLength={10}
              onSubmit={handleSubmit}
            />

            {saved ? (
              <div className="rounded-[26px] border border-emerald-400/15 bg-emerald-400/10 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-100" />
                  <div>
                    <h4 className="font-semibold text-emerald-100">
                      Password updated
                    </h4>
                    <p className="mt-1 text-sm leading-7 text-white/75">
                      আপনার নতুন password save হয়েছে।
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-cyan-100">
                <Lock className="h-4 w-4" />
                <span className="text-sm font-semibold">What happens next</span>
              </div>

              <div className="space-y-3 text-sm leading-7 text-white/65">
                <p>Password change হওয়ার পর নতুন session active থাকতে পারে, তবে নিরাপত্তার জন্য re-login লাগতে পারে।</p>
                <p>Trusted devices এ নতুন password sync হতে কয়েক মুহূর্ত লাগতে পারে।</p>
                <p>যদি 2FA enabled থাকে, তাহলে additional verification flow also trigger হতে পারে।</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_16px_55px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
              <div className="mb-4 flex items-center gap-2 text-cyan-100">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Security tips</span>
              </div>

              <div className="space-y-3">
                {securityTips.map((item) => (
                  <TipRow key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_16px_55px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
              <div className="mb-4 flex items-center gap-2 text-fuchsia-100">
                <Wand2 className="h-4 w-4" />
                <span className="text-sm font-semibold">Recommended actions</span>
              </div>

              <div className="space-y-3">
                <ActionRow
                  title="Enable two-factor authentication"
                  description="Login আরও safe রাখতে 2FA চালু করুন।"
                />
                <ActionRow
                  title="Review active sessions"
                  description="অচেনা device থাকলে logout করুন।"
                />
                <ActionRow
                  title="Check recovery email"
                  description="Account recovery info updated আছে কিনা দেখুন।"
                />
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
                <p className="text-sm leading-7 text-white/75">
                  শক্ত password + 2FA = safer account. এটা admin panel থেকে later audit করাও সহজ হবে।
                </p>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[#08111F]/75 p-5 shadow-[0_16px_55px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
              <div className="mb-4 flex items-center gap-2 text-amber-100">
                <ArrowRight className="h-4 w-4" />
                <span className="text-sm font-semibold">Short reminder</span>
              </div>

              <p className="text-sm leading-7 text-white/65">
                Password update শেষে browser এ logout notice পেলে re-enter করে নিন। Safe থাকাই best.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => window.history.back()}>
                  Go back
                </Button>
                <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Back to top
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#08111F]/75 p-4">
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <p className="mt-2 text-sm leading-7 text-white/55">{description}</p>
    </div>
  );
}
