// bep-full-project/src/features/auth/components/EmailPasswordForm.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

export type EmailPasswordFormMode = 'login' | 'register';

export interface EmailPasswordFormValues {
  email: string;
  password: string;
  confirmPassword?: string;
  rememberMe?: boolean;
}

export interface EmailPasswordFormProps {
  mode?: EmailPasswordFormMode;
  loading?: boolean;
  submitting?: boolean;
  title?: string;
  subtitle?: string;
  defaultValues?: Partial<EmailPasswordFormValues>;
  showRememberMe?: boolean;
  showConfirmPassword?: boolean;
  submitLabel?: string;
  secondaryActionLabel?: string;
  onSubmit: (values: EmailPasswordFormValues) => Promise<void> | void;
  onModeChange?: (mode: EmailPasswordFormMode) => void;
  onForgotPassword?: () => void;
  className?: string;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function EmailPasswordForm({
  mode = 'login',
  loading = false,
  submitting = false,
  title,
  subtitle,
  defaultValues,
  showRememberMe = true,
  showConfirmPassword,
  submitLabel,
  secondaryActionLabel,
  onSubmit,
  onModeChange,
  onForgotPassword,
  className = '',
}: EmailPasswordFormProps) {
  const isRegister = mode === 'register';
  const displayConfirmPassword =
    typeof showConfirmPassword === 'boolean'
      ? showConfirmPassword
      : isRegister;

  const [values, setValues] = useState<EmailPasswordFormValues>({
    email: defaultValues?.email ?? '',
    password: defaultValues?.password ?? '',
    confirmPassword: defaultValues?.confirmPassword ?? '',
    rememberMe: defaultValues?.rememberMe ?? false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const busy = loading || submitting;

  const heading = useMemo(() => {
    if (title) return title;
    return isRegister ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'অ্যাকাউন্টে লগইন করুন';
  }, [isRegister, title]);

  const description = useMemo(() => {
    if (subtitle) return subtitle;
    return isRegister
      ? 'BEP এর Bengali-first learning platform এ join করুন'
      : 'আপনার একাউন্টে নিরাপদে প্রবেশ করুন';
  }, [isRegister, subtitle]);

  const handleChange =
    (field: keyof EmailPasswordFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === 'rememberMe' ? e.target.checked : e.target.value;

      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (error) setError(null);
    };

  const validate = () => {
    const email = values.email.trim();
    const password = values.password;

    if (!email) return 'ইমেইল দিন';
    if (!isValidEmail(email)) return 'সঠিক ইমেইল দিন';
    if (!password) return 'পাসওয়ার্ড দিন';
    if (password.length < 6) return 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে';

    if (displayConfirmPassword && values.confirmPassword !== password) {
      return 'পাসওয়ার্ড মিলছে না';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    await onSubmit({
      email: values.email.trim(),
      password: values.password,
      confirmPassword: displayConfirmPassword ? values.confirmPassword : undefined,
      rememberMe: values.rememberMe,
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={[
        'relative overflow-hidden rounded-3xl border border-white/10',
        'bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.32)] backdrop-blur-2xl',
        className,
      ].join(' ')}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_30%)]" />

      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
              <Sparkles className="h-3.5 w-3.5" />
              BEP Secure Login
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white">
              {heading}
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/60">
              {description}
            </p>
          </div>

          <Badge variant="premium">BEP</Badge>
        </div>

        <div className="space-y-5">
          <Input
            type="email"
            label="ইমেইল"
            placeholder="example@gmail.com"
            value={values.email}
            onChange={handleChange('email')}
            leftIcon={<Mail className="h-4 w-4" />}
            autoComplete="email"
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            label="পাসওয়ার্ড"
            placeholder="••••••••"
            value={values.password}
            onChange={handleChange('password')}
            leftIcon={<Lock className="h-4 w-4" />}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="pointer-events-auto text-white/50 transition hover:text-white"
                aria-label={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখান'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          />

          {displayConfirmPassword ? (
            <Input
              type={showConfirm ? 'text' : 'password'}
              label="পাসওয়ার্ড নিশ্চিত করুন"
              placeholder="••••••••"
              value={values.confirmPassword}
              onChange={handleChange('confirmPassword')}
              leftIcon={<Lock className="h-4 w-4" />}
              autoComplete="new-password"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="pointer-events-auto text-white/50 transition hover:text-white"
                  aria-label={
                    showConfirm ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখান'
                  }
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />
          ) : null}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {showRememberMe ? (
              <label className="inline-flex items-center gap-3 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={Boolean(values.rememberMe)}
                  onChange={handleChange('rememberMe')}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400/30"
                />
                আমাকে মনে রাখুন
              </label>
            ) : (
              <span />
            )}

            {!isRegister && onForgotPassword ? (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-400/15 bg-red-400/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <Button type="submit" loading={busy} fullWidth size="lg">
            {submitLabel ?? (isRegister ? 'রেজিস্টার করুন' : 'লগইন করুন')}
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-white/55">
          {isRegister ? 'আগে থেকেই অ্যাকাউন্ট আছে?' : 'নতুন ব্যবহারকারী?'}

          <button
            type="button"
            onClick={() => onModeChange?.(isRegister ? 'login' : 'register')}
            className="ml-2 font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            {secondaryActionLabel ?? (isRegister ? 'লগইন করুন' : 'রেজিস্টার করুন')}
          </button>
        </div>
      </div>
    </motion.form>
  );
}
