// src/components/forms/AuthForm.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { validateEmail, validatePassword, validateRequired } from '@/lib/validators';
import { cn } from '@/lib/cn';

export type AuthMode = 'login' | 'register' | 'reset';

export interface AuthFormValues {
  email: string;
  password: string;
  fullName?: string;
  confirmPassword?: string;
}

export interface AuthFormProps {
  mode?: AuthMode;
  loading?: boolean;
  error?: string | null;
  onSubmit: (values: AuthFormValues) => Promise<void> | void;
  onModeChange?: (mode: AuthMode) => void;
  onForgotPassword?: () => void;
  className?: string;
  title?: string;
  subtitle?: string;
}

function normalizeMode(mode: AuthMode): AuthMode {
  return mode;
}

export default function AuthForm({
  mode = 'login',
  loading = false,
  error = null,
  onSubmit,
  onModeChange,
  onForgotPassword,
  className = '',
  title,
  subtitle,
}: AuthFormProps) {
  const activeMode = normalizeMode(mode);
  const [values, setValues] = useState<AuthFormValues>({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof AuthFormValues, string>>>({});

  const resolvedTitle = title
    ?? (activeMode === 'login'
      ? 'অ্যাকাউন্টে সাইন ইন করুন'
      : activeMode === 'register'
        ? 'নতুন অ্যাকাউন্ট তৈরি করুন'
        : 'পাসওয়ার্ড রিসেট করুন');

  const resolvedSubtitle = subtitle
    ?? (activeMode === 'login'
      ? 'আপনার BEP ড্যাশবোর্ডে প্রবেশ করুন'
      : activeMode === 'register'
        ? 'শুরু করুন আপনার শেখার যাত্রা'
        : 'আপনার ইমেইলে রিসেট লিংক পাঠানো হবে');

  const requiresPassword = activeMode !== 'reset';
  const requiresName = activeMode === 'register';
  const requiresConfirm = activeMode === 'register';

  const modeLabel = useMemo(() => {
    if (activeMode === 'login') return 'সাইন ইন';
    if (activeMode === 'register') return 'সাইন আপ';
    return 'রিসেট';
  }, [activeMode]);

  const update = (key: keyof AuthFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof AuthFormValues, string>> = {};

    if (!validateEmail(values.email)) nextErrors.email = 'সঠিক ইমেইল দিন।';

    if (activeMode !== 'reset') {
      if (!validatePassword(values.password ?? '')) {
        nextErrors.password = 'কমপক্ষে ৮ অক্ষরের শক্তিশালী পাসওয়ার্ড দিন।';
      }
    }

    if (activeMode === 'register') {
      if (!validateRequired(values.fullName ?? '')) {
        nextErrors.fullName = 'আপনার নাম লিখুন।';
      }

      if ((values.confirmPassword ?? '') !== (values.password ?? '')) {
        nextErrors.confirmPassword = 'পাসওয়ার্ড মিলছে না।';
      }
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    await onSubmit({
      email: values.email.trim(),
      password: values.password,
      fullName: values.fullName?.trim() || undefined,
      confirmPassword: values.confirmPassword || undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn('w-full max-w-lg', className)}
    >
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.10),transparent_35%)]" />
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-2xl">{resolvedTitle}</CardTitle>
              <CardDescription className="mt-2">{resolvedSubtitle}</CardDescription>
            </div>
            <Badge variant="premium" dot>
              {modeLabel}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {requiresName ? (
              <Input
                label="পূর্ণ নাম"
                placeholder="আপনার নাম লিখুন"
                value={values.fullName ?? ''}
                onChange={(e) => update('fullName', e.target.value)}
                error={fieldErrors.fullName}
                leftIcon={<User className="h-4 w-4" />}
              />
            ) : null}

            <Input
              label="ইমেইল"
              type="email"
              placeholder="example@email.com"
              value={values.email}
              onChange={(e) => update('email', e.target.value)}
              error={fieldErrors.email}
              leftIcon={<Mail className="h-4 w-4" />}
            />

            {requiresPassword ? (
              <Input
                label="পাসওয়ার্ড"
                type={showPassword ? 'text' : 'password'}
                placeholder="আপনার পাসওয়ার্ড"
                value={values.password}
                onChange={(e) => update('password', e.target.value)}
                error={fieldErrors.password}
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="pointer-events-auto text-white/50 transition hover:text-white"
                    aria-label={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখান'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            ) : null}

            {requiresConfirm ? (
              <Input
                label="পাসওয়ার্ড নিশ্চিত করুন"
                type={showPassword ? 'text' : 'password'}
                placeholder="আবার পাসওয়ার্ড লিখুন"
                value={values.confirmPassword ?? ''}
                onChange={(e) => update('confirmPassword', e.target.value)}
                error={fieldErrors.confirmPassword}
                leftIcon={<Lock className="h-4 w-4" />}
              />
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            <Button
              type="submit"
              loading={loading}
              fullWidth
              className="mt-2"
              variant="premium"
            >
              {modeLabel}
            </Button>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              {activeMode === 'login' ? (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              ) : (
                <span className="text-sm text-white/45" />
              )}

              {onModeChange ? (
                <button
                  type="button"
                  onClick={() =>
                    onModeChange(activeMode === 'login' ? 'register' : 'login')
                  }
                  className="text-sm font-medium text-white/70 transition hover:text-white"
                >
                  {activeMode === 'login'
                    ? 'নতুন অ্যাকাউন্ট তৈরি করুন'
                    : 'আগের অ্যাকাউন্টে সাইন ইন করুন'}
                </button>
              ) : null}
            </div>

            {activeMode === 'reset' ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/60">
                আপনার ইমেইল ইনবক্স চেক করুন। রিসেট লিংক পাঠানো হবে।
              </div>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
