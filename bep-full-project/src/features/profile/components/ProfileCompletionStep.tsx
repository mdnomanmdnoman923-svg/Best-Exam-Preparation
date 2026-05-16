// bep-full-project/src/features/profile/components/ProfileCompletionStep.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Crown,
  GraduationCap,
  MapPin,
  Phone,
  Sparkles,
  User,
  Users,
  X,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export type ProfileCompletionStatus =
  | 'completed'
  | 'partial'
  | 'missing';

export interface ProfileCompletionItem {
  id: string;
  label: string;
  value?: string | null;
  required?: boolean;
  completed?: boolean;
  icon?: React.ReactNode;
  helperText?: string;
}

export interface ProfileCompletionStepProps {
  title?: string;
  subtitle?: string;
  progress?: number;
  status?: ProfileCompletionStatus;
  items: ProfileCompletionItem[];
  loading?: boolean;
  premium?: boolean;
  onContinue?: () => void;
  onEdit?: (itemId: string) => void;
  onSkip?: () => void;
  className?: string;
}

function getStatusMeta(status: ProfileCompletionStatus) {
  switch (status) {
    case 'completed':
      return {
        label: 'Completed',
        className: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
        icon: <CheckCircle2 className="h-4 w-4" />,
      };
    case 'partial':
      return {
        label: 'In Progress',
        className: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
        icon: <BadgeCheck className="h-4 w-4" />,
      };
    case 'missing':
    default:
      return {
        label: 'Missing Info',
        className: 'border-red-400/15 bg-red-400/10 text-red-100',
        icon: <X className="h-4 w-4" />,
      };
  }
}

function defaultIconForItem(item: ProfileCompletionItem) {
  const key = item.id.toLowerCase();

  if (
    key.includes('name') ||
    key.includes('user')
  ) {
    return <User className="h-4 w-4" />;
  }

  if (
    key.includes('class') ||
    key.includes('batch') ||
    key.includes('education')
  ) {
    return <GraduationCap className="h-4 w-4" />;
  }

  if (
    key.includes('phone') ||
    key.includes('mobile')
  ) {
    return <Phone className="h-4 w-4" />;
  }

  if (
    key.includes('location') ||
    key.includes('address') ||
    key.includes('city')
  ) {
    return <MapPin className="h-4 w-4" />;
  }

  if (
    key.includes('institution') ||
    key.includes('school') ||
    key.includes('college')
  ) {
    return <BookOpen className="h-4 w-4" />;
  }

  if (
    key.includes('group') ||
    key.includes('batch')
  ) {
    return <Users className="h-4 w-4" />;
  }

  return <Sparkles className="h-4 w-4" />;
}

export default function ProfileCompletionStep({
  title = 'Complete Your Profile',
  subtitle = 'আপনার profile সম্পূর্ণ করলে BEP personal suggestions, leaderboard, এবং premium features আরও smart হবে',
  progress = 0,
  status = 'partial',
  items,
  loading = false,
  premium = false,
  onContinue,
  onEdit,
  onSkip,
  className = '',
}: ProfileCompletionStepProps) {
  const safeProgress = Math.max(
    0,
    Math.min(100, progress),
  );

  const completedCount = items.filter(
    (item) =>
      Boolean(
        item.completed ??
          (typeof item.value === 'string'
            ? item.value.trim().length > 0
            : item.value != null),
      ),
  ).length;

  const statusMeta = getStatusMeta(status);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={[
        'overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04]',
        'shadow-[0_18px_70px_rgba(0,0,0,0.30)] backdrop-blur-2xl',
        className,
      ].join(' ')}
    >
      <div className="relative overflow-hidden border-b border-white/10 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
              <Sparkles className="h-3.5 w-3.5" />
              BEP Profile Setup
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white">
              {title}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="premium">
              {completedCount}/{items.length} Done
            </Badge>

            {premium ? (
              <Badge variant="premium">
                <Crown className="mr-1 h-3.5 w-3.5" />
                Premium Ready
              </Badge>
            ) : null}

            <div
              className={[
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold',
                statusMeta.className,
              ].join(' ')}
            >
              {statusMeta.icon}
              {statusMeta.label}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-white/45">
                Completion Progress
              </span>
              <span className="font-bold text-cyan-100">
                {safeProgress}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${safeProgress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
              />
            </div>

            <p className="mt-3 text-sm leading-6 text-white/55">
              আপনার profile যত complete হবে, BEP তত বেশি personalized experience দিতে পারবে।
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-cyan-100">
              <BadgeCheck className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Summary
              </span>
            </div>

            <h3 className="mt-3 text-4xl font-bold tracking-tight text-white">
              {completedCount}/{items.length}
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Fields completed
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04]"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              {items.map((item, index) => {
                const completed = Boolean(
                  item.completed ??
                    (typeof item.value === 'string'
                      ? item.value.trim().length > 0
                      : item.value != null),
                );

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: index * 0.03 }}
                    className={[
                      'rounded-[28px] border p-5 backdrop-blur-xl transition-all duration-300',
                      completed
                        ? 'border-emerald-400/15 bg-emerald-400/10'
                        : 'border-white/10 bg-white/[0.04]',
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 gap-4">
                        <div
                          className={[
                            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border',
                            completed
                              ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                              : 'border-white/10 bg-white/[0.05] text-cyan-100',
                          ].join(' ')}
                        >
                          {item.icon || defaultIconForItem(item)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-white">
                              {item.label}
                            </h3>

                            {item.required ? (
                              <Badge variant="secondary">Required</Badge>
                            ) : (
                              <Badge variant="premium">Optional</Badge>
                            )}

                            {completed ? (
                              <div className="inline-flex items-center gap-1 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-100">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Completed
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 rounded-full border border-amber-400/15 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-100">
                                <X className="h-3.5 w-3.5" />
                                Pending
                              </div>
                            )}
                          </div>

                          {item.helperText ? (
                            <p className="mt-2 text-sm leading-6 text-white/60">
                              {item.helperText}
                            </p>
                          ) : null}

                          {item.value ? (
                            <p className="mt-2 text-sm leading-6 text-white/75">
                              <span className="text-white/45">Current:</span>{' '}
                              {item.value}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      {onEdit ? (
                        <button
                          type="button"
                          onClick={() => onEdit(item.id)}
                          className="inline-flex h-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/65 transition hover:bg-white/[0.08] hover:text-white"
                        >
                          Edit
                        </button>
                      ) : null}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="space-y-4">
              <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2 text-cyan-100">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-semibold">Why this matters</span>
                </div>

                <p className="text-sm leading-7 text-white/65">
                  Completed profile data helps BEP generate better class recommendations, premium suggestions, and personalized learning analytics.
                </p>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/65">
                    <span className="font-semibold text-white">Smart matching:</span> class, batch, and education level sync.
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/65">
                    <span className="font-semibold text-white">Leaderboard:</span> complete profile improves visibility and ranking context.
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/65">
                    <span className="font-semibold text-white">AI tutor:</span> more accurate study suggestions and reminders.
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2 text-yellow-100">
                  <BadgeCheck className="h-4 w-4" />
                  <span className="text-sm font-semibold">Completion status</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="text-sm text-white/60">Progress</span>
                    <span className="text-sm font-semibold text-white">
                      {safeProgress}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="text-sm text-white/60">Completed fields</span>
                    <span className="text-sm font-semibold text-white">
                      {completedCount}/{items.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-cyan-400/15 bg-cyan-400/10 p-5">
                <div className="mb-2 flex items-center gap-2 text-cyan-100">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-semibold">Next step</span>
                </div>

                <p className="text-sm leading-7 text-white/75">
                  সব দরকারি তথ্য complete করে continue করুন। চাইলে পরে যেকোনো সময় edit করা যাবে।
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={onContinue}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Continue
                </Button>

                {onSkip ? (
                  <Button
                    variant="secondary"
                    onClick={onSkip}
                  >
                    Skip for now
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
