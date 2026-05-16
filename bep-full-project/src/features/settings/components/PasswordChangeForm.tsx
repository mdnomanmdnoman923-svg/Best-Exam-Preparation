// bep-full-project/src/features/settings/components/PasswordChangeForm.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  Wand2,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export interface PasswordChangeValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChangeFormProps {
  loading?: boolean;
  disabled?: boolean;
  requireCurrentPassword?: boolean;
  minLength?: number;
  onSubmit: (
    values: PasswordChangeValues,
  ) => Promise<void> | void;
  className?: string;
}

function calculateStrength(
  password: string,
) {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) {
    return {
      label: 'Weak',
      percentage: 30,
      className:
        'border-red-400/15 bg-red-400/10 text-red-100',
      barClass:
        'from-red-400 to-red-500',
    };
  }

  if (score <= 4) {
    return {
      label: 'Medium',
      percentage: 65,
      className:
        'border-amber-400/15 bg-amber-400/10 text-amber-100',
      barClass:
        'from-amber-400 to-orange-500',
    };
  }

  return {
    label: 'Strong',
    percentage: 100,
    className:
      'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
    barClass:
      'from-emerald-400 to-cyan-400',
  };
}

export default function PasswordChangeForm({
  loading = false,
  disabled = false,
  requireCurrentPassword = true,
  minLength = 8,
  onSubmit,
  className = '',
}: PasswordChangeFormProps) {
  const [values, setValues] =
    useState<PasswordChangeValues>({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  const [submitting, setSubmitting] =
    useState(false);

  const [showPasswords, setShowPasswords] =
    useState({
      current: false,
      next: false,
      confirm: false,
    });

  const passwordStrength = useMemo(
    () =>
      calculateStrength(
        values.newPassword,
      ),
    [values.newPassword],
  );

  const passwordsMatch =
    values.newPassword.length > 0 &&
    values.newPassword ===
      values.confirmPassword;

  const canSubmit = useMemo(() => {
    if (
      requireCurrentPassword &&
      !values.currentPassword
    ) {
      return false;
    }

    if (
      values.newPassword.length <
      minLength
    ) {
      return false;
    }

    if (!passwordsMatch) {
      return false;
    }

    return true;
  }, [
    minLength,
    passwordsMatch,
    requireCurrentPassword,
    values.currentPassword,
    values.newPassword.length,
  ]);

  const updateField = (
    field: keyof PasswordChangeValues,
    value: string,
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    if (disabled || loading) return;

    setError(null);
    setSuccess(null);

    if (
      requireCurrentPassword &&
      !values.currentPassword
    ) {
      setError(
        'Current password is required.',
      );
      return;
    }

    if (
      values.newPassword.length <
      minLength
    ) {
      setError(
        `Password must be at least ${minLength} characters long.`,
      );
      return;
    }

    if (
      values.newPassword !==
      values.confirmPassword
    ) {
      setError(
        'Passwords do not match.',
      );
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit(values);

      setSuccess(
        'Password updated successfully.',
      );

      setValues({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to update password.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy =
    loading || submitting;

  return (
    <section
      className={[
        'overflow-hidden rounded-[32px] border border-white/10',
        'bg-white/[0.04] shadow-[0_18px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl',
        className,
      ].join(' ')}
    >
      <div className="relative overflow-hidden border-b border-white/10 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
              <Sparkles className="h-3.5 w-3.5" />
              BEP Security Center
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white">
              Change Password
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
              আপনার account security আরও শক্তিশালী করতে নতুন password সেট করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="success">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              Secure
            </Badge>

            <Badge variant="premium">
              <Lock className="mr-1 h-3.5 w-3.5" />
              Encrypted
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[1fr_0.85fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {requireCurrentPassword ? (
            <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-cyan-100">
                <KeyRound className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Current password
                </span>
              </div>

              <Input
                type={
                  showPasswords.current
                    ? 'text'
                    : 'password'
                }
                value={
                  values.currentPassword
                }
                onChange={(e) =>
                  updateField(
                    'currentPassword',
                    e.target.value,
                  )
                }
                placeholder="Enter current password"
                disabled={isBusy || disabled}
                rightIcon={
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords(
                        (prev) => ({
                          ...prev,
                          current:
                            !prev.current,
                        }),
                      )
                    }
                    className="text-white/45 transition hover:text-white"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
              />
            </div>
          ) : null}

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-emerald-100">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-sm font-semibold">
                New password
              </span>
            </div>

            <div className="space-y-4">
              <Input
                type={
                  showPasswords.next
                    ? 'text'
                    : 'password'
                }
                value={
                  values.newPassword
                }
                onChange={(e) =>
                  updateField(
                    'newPassword',
                    e.target.value,
                  )
                }
                placeholder="Create new password"
                disabled={isBusy || disabled}
                rightIcon={
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords(
                        (prev) => ({
                          ...prev,
                          next: !prev.next,
                        }),
                      )
                    }
                    className="text-white/45 transition hover:text-white"
                  >
                    {showPasswords.next ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
              />

              <div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-white/45">
                    Password strength
                  </span>

                  <span
                    className={[
                      'rounded-full border px-3 py-1 font-semibold',
                      passwordStrength.className,
                    ].join(' ')}
                  >
                    {
                      passwordStrength.label
                    }
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${passwordStrength.percentage}%`,
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                    className={[
                      'h-full rounded-full bg-gradient-to-r',
                      passwordStrength.barClass,
                    ].join(' ')}
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-2 text-cyan-100">
                    <Wand2 className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Minimum length
                    </span>
                  </div>

                  <h4 className="mt-2 text-2xl font-bold text-white">
                    {minLength}+
                  </h4>

                  <p className="mt-1 text-xs text-white/45">
                    Recommended characters
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-2 text-emerald-100">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Match status
                    </span>
                  </div>

                  <h4 className="mt-2 text-2xl font-bold text-white">
                    {passwordsMatch
                      ? 'Matched'
                      : 'Pending'}
                  </h4>

                  <p className="mt-1 text-xs text-white/45">
                    Confirmation check
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-fuchsia-100">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Confirm password
              </span>
            </div>

            <Input
              type={
                showPasswords.confirm
                  ? 'text'
                  : 'password'
              }
              value={
                values.confirmPassword
              }
              onChange={(e) =>
                updateField(
                  'confirmPassword',
                  e.target.value,
                )
              }
              placeholder="Confirm new password"
              disabled={isBusy || disabled}
              rightIcon={
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords(
                      (prev) => ({
                        ...prev,
                        confirm:
                          !prev.confirm,
                      }),
                    )
                  }
                  className="text-white/45 transition hover:text-white"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />

            {values.confirmPassword ? (
              <div className="mt-4">
                {passwordsMatch ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Passwords match
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-400/15 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-100">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Passwords do not match
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-[24px] border border-red-400/15 bg-red-400/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-100" />

                <div>
                  <h4 className="font-semibold text-red-100">
                    Password update failed
                  </h4>

                  <p className="mt-1 text-sm leading-7 text-white/75">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {success ? (
            <div className="rounded-[24px] border border-emerald-400/15 bg-emerald-400/10 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-100" />

                <div>
                  <h4 className="font-semibold text-emerald-100">
                    Password updated
                  </h4>

                  <p className="mt-1 text-sm leading-7 text-white/75">
                    {success}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              disabled={
                !canSubmit ||
                isBusy ||
                disabled
              }
              leftIcon={
                isBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )
              }
            >
              {isBusy
                ? 'Updating...'
                : 'Update Password'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              disabled={
                isBusy || disabled
              }
              onClick={() =>
                setValues({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                })
              }
            >
              Reset
            </Button>
          </div>
        </form>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-cyan-100">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Password tips
              </span>
            </div>

            <ul className="space-y-3 text-sm leading-7 text-white/65">
              <li>
                Uppercase, lowercase,
                number এবং special
                character ব্যবহার করুন।
              </li>

              <li>
                একই password একাধিক
                account এ ব্যবহার করবেন
                না।
              </li>

              <li>
                সহজে guess করা যায় এমন
                নাম বা date avoid করুন।
              </li>

              <li>
                প্রতি কয়েক মাস পরপর
                password update করা ভালো।
              </li>
            </ul>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-emerald-100">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Security status
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <span className="text-sm text-white/60">
                  Password strength
                </span>

                <span
                  className={[
                    'rounded-full border px-3 py-1 text-xs font-semibold',
                    passwordStrength.className,
                  ].join(' ')}
                >
                  {
                    passwordStrength.label
                  }
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <span className="text-sm text-white/60">
                  Minimum length
                </span>

                <span className="text-sm font-semibold text-white">
                  {minLength} chars
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <span className="text-sm text-white/60">
                  Match status
                </span>

                <span className="text-sm font-semibold text-white">
                  {passwordsMatch
                    ? 'Matched'
                    : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-cyan-400/15 bg-cyan-400/10 p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 h-5 w-5 shrink-0 text-cyan-100" />

              <div>
                <h3 className="font-semibold text-white">
                  Pro security tip
                </h3>

                <p className="mt-2 text-sm leading-7 text-white/75">
                  Two-factor authentication
                  enable করলে account আরও
                  secure হবে।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
