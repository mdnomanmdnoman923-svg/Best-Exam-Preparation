// bep-full-project/src/features/settings/components/ProfileSettings.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  BookOpen,
  Camera,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Sparkles,
  User,
  Wand2,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export interface ProfileSettingsValues {
  fullName: string;
  username?: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  institution?: string;
  educationLevel?: string;
  className?: string;
  avatarUrl?: string;
}

export interface ProfileSettingsProps {
  initialValues: ProfileSettingsValues;
  loading?: boolean;
  disabled?: boolean;
  verified?: boolean;
  premium?: boolean;
  onSubmit: (
    values: ProfileSettingsValues,
  ) => Promise<void> | void;
  onAvatarChange?: (
    file: File,
  ) => Promise<void> | void;
  className?: string;
}

function calculateCompletion(
  values: ProfileSettingsValues,
) {
  const fields = [
    values.fullName,
    values.username,
    values.email,
    values.phone,
    values.bio,
    values.location,
    values.institution,
    values.educationLevel,
    values.className,
    values.avatarUrl,
  ];

  const completed =
    fields.filter(
      (item) =>
        typeof item === 'string' &&
        item.trim().length > 0,
    ).length;

  return Math.round(
    (completed / fields.length) * 100,
  );
}

export default function ProfileSettings({
  initialValues,
  loading = false,
  disabled = false,
  verified = false,
  premium = false,
  onSubmit,
  onAvatarChange,
  className = '',
}: ProfileSettingsProps) {
  const [values, setValues] =
    useState<ProfileSettingsValues>(
      initialValues,
    );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  const completion = useMemo(
    () => calculateCompletion(values),
    [values],
  );

  const isBusy =
    saving || loading;

  const updateField = (
    field: keyof ProfileSettingsValues,
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

    if (disabled || isBusy) return;

    setError(null);
    setSuccess(null);

    if (
      !values.fullName.trim()
    ) {
      setError(
        'Full name is required.',
      );
      return;
    }

    if (
      !values.email.trim()
    ) {
      setError(
        'Email is required.',
      );
      return;
    }

    try {
      setSaving(true);

      await onSubmit(values);

      setSuccess(
        'Profile updated successfully.',
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to update profile.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarInput = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file || !onAvatarChange) {
      return;
    }

    try {
      await onAvatarChange(file);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Failed to upload avatar.',
      );
    }
  };

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

        <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
              <Sparkles className="h-3.5 w-3.5" />
              BEP Account Center
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white">
              Profile Settings
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
              আপনার profile information update করুন এবং learning identity personalize করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {verified ? (
              <Badge variant="success">
                <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                Verified
              </Badge>
            ) : null}

            {premium ? (
              <Badge variant="premium">
                Premium
              </Badge>
            ) : null}

            <Badge variant="secondary">
              {completion}% Complete
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[1fr_0.82fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="rounded-[30px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04]">
                  {values.avatarUrl ? (
                    <img
                      src={
                        values.avatarUrl
                      }
                      alt={
                        values.fullName
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-white/45" />
                  )}
                </div>

                {onAvatarChange ? (
                  <label className="absolute -bottom-2 -right-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-100 transition hover:scale-105">
                    <Camera className="h-4 w-4" />

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={
                        handleAvatarInput
                      }
                      disabled={
                        isBusy ||
                        disabled
                      }
                    />
                  </label>
                ) : null}
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">
                  {values.fullName ||
                    'Your Profile'}
                </h3>

                <p className="mt-2 text-sm leading-7 text-white/60">
                  Profile picture এবং public information update করুন।
                </p>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${completion}%`,
                    }}
                    transition={{
                      duration: 0.5,
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-2 text-cyan-100">
              <User className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Personal information
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                value={values.fullName}
                onChange={(e) =>
                  updateField(
                    'fullName',
                    e.target.value,
                  )
                }
                placeholder="Full name"
                leftIcon={
                  <User className="h-4 w-4" />
                }
                disabled={
                  isBusy ||
                  disabled
                }
              />

              <Input
                value={
                  values.username ||
                  ''
                }
                onChange={(e) =>
                  updateField(
                    'username',
                    e.target.value,
                  )
                }
                placeholder="Username"
                leftIcon={
                  <Wand2 className="h-4 w-4" />
                }
                disabled={
                  isBusy ||
                  disabled
                }
              />

              <Input
                type="email"
                value={values.email}
                onChange={(e) =>
                  updateField(
                    'email',
                    e.target.value,
                  )
                }
                placeholder="Email address"
                leftIcon={
                  <Mail className="h-4 w-4" />
                }
                disabled={
                  isBusy ||
                  disabled
                }
              />

              <Input
                value={
                  values.phone || ''
                }
                onChange={(e) =>
                  updateField(
                    'phone',
                    e.target.value,
                  )
                }
                placeholder="Phone number"
                leftIcon={
                  <Phone className="h-4 w-4" />
                }
                disabled={
                  isBusy ||
                  disabled
                }
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-white/70">
                Bio
              </label>

              <textarea
                value={values.bio || ''}
                onChange={(e) =>
                  updateField(
                    'bio',
                    e.target.value,
                  )
                }
                placeholder="Write something about yourself..."
                disabled={
                  isBusy ||
                  disabled
                }
                rows={4}
                className="w-full rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/20 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-2 text-emerald-100">
              <GraduationCap className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Education details
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                value={
                  values.institution ||
                  ''
                }
                onChange={(e) =>
                  updateField(
                    'institution',
                    e.target.value,
                  )
                }
                placeholder="Institution"
                leftIcon={
                  <BookOpen className="h-4 w-4" />
                }
                disabled={
                  isBusy ||
                  disabled
                }
              />

              <Input
                value={
                  values.educationLevel ||
                  ''
                }
                onChange={(e) =>
                  updateField(
                    'educationLevel',
                    e.target.value,
                  )
                }
                placeholder="Education level"
                leftIcon={
                  <GraduationCap className="h-4 w-4" />
                }
                disabled={
                  isBusy ||
                  disabled
                }
              />

              <Input
                value={
                  values.className ||
                  ''
                }
                onChange={(e) =>
                  updateField(
                    'className',
                    e.target.value,
                  )
                }
                placeholder="Class / Batch"
                leftIcon={
                  <Sparkles className="h-4 w-4" />
                }
                disabled={
                  isBusy ||
                  disabled
                }
              />

              <Input
                value={
                  values.location ||
                  ''
                }
                onChange={(e) =>
                  updateField(
                    'location',
                    e.target.value,
                  )
                }
                placeholder="Location"
                leftIcon={
                  <MapPin className="h-4 w-4" />
                }
                disabled={
                  isBusy ||
                  disabled
                }
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-[24px] border border-red-400/15 bg-red-400/10 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-red-400/15 p-1">
                  <Sparkles className="h-4 w-4 text-red-100" />
                </div>

                <div>
                  <h4 className="font-semibold text-red-100">
                    Update failed
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
                    Profile updated
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
                isBusy ||
                disabled
              }
              leftIcon={
                isBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )
              }
            >
              {isBusy
                ? 'Saving...'
                : 'Save Changes'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              disabled={
                isBusy ||
                disabled
              }
              onClick={() =>
                setValues(
                  initialValues,
                )
              }
            >
              Reset
            </Button>
          </div>
        </form>

        <div className="space-y-5">
          <div className="rounded-[30px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-fuchsia-100">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Profile completion
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <span className="text-sm text-white/60">
                Completion rate
              </span>

              <span className="text-lg font-bold text-white">
                {completion}%
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {[
                {
                  label:
                    'Personal info',
                  done:
                    Boolean(
                      values.fullName,
                    ) &&
                    Boolean(
                      values.email,
                    ),
                },
                {
                  label:
                    'Education details',
                  done:
                    Boolean(
                      values.institution,
                    ) &&
                    Boolean(
                      values.educationLevel,
                    ),
                },
                {
                  label:
                    'Profile picture',
                  done:
                    Boolean(
                      values.avatarUrl,
                    ),
                },
                {
                  label: 'Bio',
                  done:
                    Boolean(
                      values.bio,
                    ),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                >
                  <span className="text-sm text-white/65">
                    {item.label}
                  </span>

                  {item.done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-100" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-white/20" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-cyan-100">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Tips
              </span>
            </div>

            <ul className="space-y-3 text-sm leading-7 text-white/65">
              <li>
                Real নাম ব্যবহার করলে
                leaderboard এবং community
                trust বাড়ে।
              </li>

              <li>
                Education level update
                করলে personalized content
                recommendation improve হয়।
              </li>

              <li>
                Profile সম্পূর্ণ হলে
                community visibility
                বাড়তে পারে।
              </li>

              <li>
                Bio section এ আপনার goal
                বা learning focus লিখতে
                পারেন।
              </li>
            </ul>
          </div>

          <div className="rounded-[30px] border border-cyan-400/15 bg-cyan-400/10 p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 h-5 w-5 shrink-0 text-cyan-100" />

              <div>
                <h3 className="font-semibold text-white">
                  Smart profile insight
                </h3>

                <p className="mt-2 text-sm leading-7 text-white/75">
                  Complete profile থাকলে
                  AI recommendation engine
                  আরও accurate subject এবং
                  practice suggestion দিতে
                  পারবে।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
