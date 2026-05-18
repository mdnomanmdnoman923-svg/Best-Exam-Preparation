// bep-full-project/src/pages/public/AuthPage.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wand2,
  Zap,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type AuthMode = 'login' | 'signup';

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
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

function FeatureCard({ item }: { item: FeatureItem }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[#08111F]/75 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-100">
          {item.icon}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">{item.title}</h4>
          <p className="mt-1 text-sm leading-6 text-white/55">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: true,
  });

  const features = useMemo<FeatureItem[]>(
    () => [
      {
        title: 'Bengali-first learning',
        description: 'Class, batch, and subject experience tailored for Bangladesh students.',
        icon: <BookOpen className="h-4 w-4" />,
      },
      {
        title: 'AI study assistant',
        description: 'Ask questions, generate quizzes, and get quick explanations instantly.',
        icon: <Wand2 className="h-4 w-4" />,
      },
      {
        title: 'Progress analytics',
        description: 'Track streaks, weak topics, leaderboard rank, and practice accuracy.',
        icon: <Sparkles className="h-4 w-4" />,
      },
      {
        title: 'Community and mock tests',
        description: 'Join discussions, solve mock exams, and build consistency every day.',
        icon: <Users className="h-4 w-4" />,
      },
    ],
    [],
  );

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 700));
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 700));
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(
    () => [
      {
        title: 'Students',
        value: '24K+',
        icon: <Users className="h-5 w-5" />,
        accent: 'cyan' as const,
        note: 'Active learners monthly',
      },
      {
        title: 'Accuracy',
        value: '87%',
        icon: <BadgeCheck className="h-5 w-5" />,
        accent: 'emerald' as const,
        note: 'Average practice success',
      },
      {
        title: 'Mock Tests',
        value: '180+',
        icon: <ShieldCheck className="h-5 w-5" />,
        accent: 'amber' as const,
        note: 'Exam-ready assessments',
      },
      {
        title: 'Streaks',
        value: '14d',
        icon: <Star className="h-5 w-5" />,
        accent: 'fuchsia' as const,
        note: 'Average active streaks',
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-[#050816] p-6 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
          <div className="relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_30%)]" />
            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                <Sparkles className="h-3.5 w-3.5" />
                BEP Secure Access
              </div>

              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Welcome to BEP
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                Join your learning workspace, continue practice, and unlock AI-powered study tools designed for students.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {stats.map((item) => (
                  <StatCard key={item.title} {...item} />
                ))}
              </div>

              <div className="mt-6 rounded-[30px] border border-white/10 bg-[#08111F]/75 p-5">
                <div className="mb-4 flex items-center gap-2 text-cyan-100">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-semibold">What you get</span>
                </div>

                <div className="grid gap-3">
                  {features.map((item) => (
                    <FeatureCard key={item.title} item={item} />
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[28px] border border-cyan-400/15 bg-cyan-400/10 p-4">
                  <div className="flex items-start gap-3">
                    <Zap className="mt-0.5 h-4 w-4 text-cyan-100" />
                    <div>
                      <h4 className="font-semibold text-cyan-100">Fast learning flow</h4>
                      <p className="mt-1 text-sm leading-7 text-white/75">
                        Practice, mock exams, progress, and AI help—all in one place.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-emerald-400/15 bg-emerald-400/10 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-100" />
                    <div>
                      <h4 className="font-semibold text-emerald-100">Protected account</h4>
                      <p className="mt-1 text-sm leading-7 text-white/75">
                        Login security, verified profile, and private learning data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
          <div className="border-b border-white/10 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-cyan-100">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm font-semibold">Account access</span>
                </div>
                <p className="mt-2 text-sm leading-7 text-white/55">
                  Sign in or create a new account to continue.
                </p>
              </div>

              <Badge variant="premium">
                <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                Secure
              </Badge>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-[24px] border border-white/10 bg-[#08111F]/75 p-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={[
                  'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                  mode === 'login'
                    ? 'bg-cyan-400/10 text-cyan-100'
                    : 'text-white/55 hover:text-white',
                ].join(' ')}
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => setMode('signup')}
                className={[
                  'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                  mode === 'signup'
                    ? 'bg-cyan-400/10 text-cyan-100'
                    : 'text-white/55 hover:text-white',
                ].join(' ')}
              >
                Create account
              </button>
            </div>
          </div>

          <div className="p-5">
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <Input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Email address"
                  leftIcon={<Mail className="h-4 w-4" />}
                />

                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-white/50 transition hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />

                <div className="flex items-center justify-between gap-3 text-sm">
                  <label className="flex items-center gap-2 text-white/60">
                    <input
                      type="checkbox"
                      checked={loginForm.rememberMe}
                      onChange={(e) =>
                        setLoginForm((prev) => ({ ...prev, rememberMe: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-white/20 bg-white/10"
                    />
                    Remember me
                  </label>

                  <button type="button" className="text-cyan-100 transition hover:text-cyan-50">
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  leftIcon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  className="w-full"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#08111F] px-3 text-xs uppercase tracking-[0.18em] text-white/40">
                      or continue with
                    </span>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <SocialButton label="Google" />
                  <SocialButton label="GitHub" />
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <Input
                  value={signupForm.fullName}
                  onChange={(e) => setSignupForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Full name"
                  leftIcon={<Users className="h-4 w-4" />}
                />

                <Input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Email address"
                  leftIcon={<Mail className="h-4 w-4" />}
                />

                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={signupForm.password}
                  onChange={(e) => setSignupForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Create password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-white/50 transition hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />

                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={signupForm.confirmPassword}
                  onChange={(e) =>
                    setSignupForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                  placeholder="Confirm password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="text-white/50 transition hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />

                <div className="flex items-start gap-3 rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                  <input
                    type="checkbox"
                    checked={signupForm.agreeToTerms}
                    onChange={(e) =>
                      setSignupForm((prev) => ({ ...prev, agreeToTerms: e.target.checked }))
                    }
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10"
                  />
                  <p className="text-sm leading-7 text-white/60">
                    I agree to the terms, privacy policy, and community guidelines.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  leftIcon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  className="w-full"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </Button>

                <div className="rounded-[24px] border border-cyan-400/15 bg-cyan-400/10 p-4">
                  <p className="text-sm leading-7 text-white/75">
                    নতুন account create করলে dashboard, progress, leaderboard, and AI assistant ready হবে।
                  </p>
                </div>
              </form>
            )}

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="rounded-[26px] border border-white/10 bg-[#08111F]/75 p-4">
                <div className="flex items-center gap-2 text-cyan-100">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-sm font-semibold">Secure login</span>
                </div>
                <p className="mt-2 text-sm leading-7 text-white/55">
                  OTP-ready, password-protected, and built for protected routes.
                </p>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-[#08111F]/75 p-4">
                <div className="flex items-center gap-2 text-fuchsia-100">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-semibold">Fast onboarding</span>
                </div>
                <p className="mt-2 text-sm leading-7 text-white/55">
                  New users can complete profile details after signup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-black/20 text-[10px] font-bold text-cyan-100">
        {label[0]}
      </span>
      Continue with {label}
    </button>
  );
}
