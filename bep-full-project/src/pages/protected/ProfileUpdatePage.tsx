// bep-full-project/src/pages/protected/ProfileUpdatePage.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  BookOpen,
  Camera,
  CheckCircle2,
  GraduationCap,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Sparkles,
  User,
  Wand2,
  XCircle,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ProfileUpdateValues {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  institution: string;
  educationLevel: string;
  className: string;
  language: 'bn' | 'en';
  avatarUrl: string;
}

const initialValues: ProfileUpdateValues = {
  fullName: 'Nahid Hasan',
  username: 'nahid_hasan',
  email: 'nahid@example.com',
  phone: '',
  bio: 'I am preparing for HSC and love physics, math, and AI-powered learning.',
  location: 'Dhaka',
  institution: 'Dhaka College',
  educationLevel: 'HSC',
  className: 'Class 12',
  language: 'bn',
  avatarUrl: '',
};

function calculateCompletion(values: ProfileUpdateValues) {
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

  const filled = fields.filter((item) => item.trim().length > 0).length;
  return Math.round((filled / fields.length) * 100);
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

function ChecklistRow({
  label,
  done,
}: {
  label: string;
  done: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="text-sm text-white/65">{label}</span>
      {done ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-100" />
      ) : (
        <XCircle className="h-4 w-4 text-white/30" />
      )}
    </div>
  );
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

export default function ProfileUpdatePage() {
  const [values, setValues] = useState<ProfileUpdateValues>(initialValues);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const completion = useMemo(() => calculateCompletion(values), [values]);

  const updateField = <K extends keyof ProfileUpdateValues>(
    field: K,
    value: ProfileUpdateValues[K],
  ) => {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));
    setSuccess(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!values.fullName.trim() || !values.email.trim()) return;

    try {
      setSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 750));
      setSuccess(true);
    } finally {
      setSaving(false);
    }
  };

  const progressColor =
    completion < 40
      ? 'from-red-400 to-orange-500'
      : completion < 80
        ? 'from-amber-400 to-fuchsia-500'
        : 'from-emerald-400 to-cyan-400';

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
                  Protected Profile Area
                </div>

                <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                  Profile Update
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  আপনার profile details update করুন। Updated info দিয়ে AI recommendations, community trust, এবং dashboard personalization improve হবে।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">
                  <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                  Synced
                </Badge>
                <Badge variant="premium">
                  <Wand2 className="mr-1 h-3.5 w-3.5" />
                  Personalized
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Completion"
            value={`${completion}%`}
            icon={<CheckCircle2 className="h-5 w-5" />}
            accent="emerald"
            note="Profile readiness"
          />
          <StatCard
            title="Visibility"
            value="High"
            icon={<Globe className="h-5 w-5" />}
            accent="cyan"
            note="Better community presence"
          />
          <StatCard
            title="Learning Match"
            value="Active"
            icon={<BookOpen className="h-5 w-5" />}
            accent="amber"
            note="Subjects and batch aligned"
          />
          <StatCard
            title="AI Personalization"
            value="On"
            icon={<Sparkles className="h-5 w-5" />}
            accent="fuchsia"
            note="Tailored study suggestions"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <SectionTitle
                icon={<User className="h-4 w-4" />}
                title="Personal details"
                description="Basic identity information used throughout the platform."
              />

              <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04]">
                    {values.avatarUrl ? (
                      <img
                        src={values.avatarUrl}
                        alt={values.fullName || 'Profile'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-white/45" />
                    )}
                  </div>

                  <label className="absolute -bottom-2 -right-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-100 transition hover:scale-105">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          updateField('avatarUrl', String(reader.result || ''));
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>

                <div className="flex-1">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      value={values.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder="Full name"
                      leftIcon={<User className="h-4 w-4" />}
                    />
                    <Input
                      value={values.username}
                      onChange={(e) => updateField('username', e.target.value)}
                      placeholder="Username"
                    />
                    <Input
                      type="email"
                      value={values.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="Email address"
                      leftIcon={<Mail className="h-4 w-4" />}
                    />
                    <Input
                      value={values.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="Phone number"
                      leftIcon={<Phone className="h-4 w-4" />}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium text-white/70">
                      Bio
                    </label>
                    <textarea
                      value={values.bio}
                      onChange={(e) => updateField('bio', e.target.value)}
                      placeholder="Tell us a little about your study goals..."
                      rows={4}
                      className="w-full rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/20 focus:bg-white/[0.06]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <SectionTitle
                icon={<GraduationCap className="h-4 w-4" />}
                title="Education details"
                description="This helps BEP tailor class, batch, and subject recommendations."
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  value={values.institution}
                  onChange={(e) => updateField('institution', e.target.value)}
                  placeholder="Institution"
                  leftIcon={<BookOpen className="h-4 w-4" />}
                />
                <Input
                  value={values.educationLevel}
                  onChange={(e) => updateField('educationLevel', e.target.value)}
                  placeholder="Education level"
                  leftIcon={<GraduationCap className="h-4 w-4" />}
                />
                <Input
                  value={values.className}
                  onChange={(e) => updateField('className', e.target.value)}
                  placeholder="Class / Batch"
                  leftIcon={<Sparkles className="h-4 w-4" />}
                />
                <Input
                  value={values.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="Location"
                  leftIcon={<MapPin className="h-4 w-4" />}
                />
              </div>

              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-white/70">
                  Preferred language
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    { value: 'bn', label: 'বাংলা', hint: 'Bengali-first learning' },
                    { value: 'en', label: 'English', hint: 'English explanations' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => updateField('language', item.value as ProfileUpdateValues['language'])}
                      className={[
                        'rounded-[24px] border px-4 py-4 text-left transition',
                        values.language === item.value
                          ? 'border-cyan-400/20 bg-cyan-400/10'
                          : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.06]',
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-semibold text-white">{item.label}</h4>
                          <p className="mt-1 text-sm leading-6 text-white/55">{item.hint}</p>
                        </div>

                        {values.language === item.value ? (
                          <CheckCircle2 className="h-5 w-5 text-cyan-100" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border border-white/20" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-cyan-100">
                  <Wand2 className="h-4 w-4" />
                  <span className="text-sm font-semibold">Profile completion progress</span>
                </div>

                <span className="text-sm font-semibold text-white/70">{completion}% complete</span>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completion}%` }}
                  transition={{ duration: 0.45 }}
                  className={['h-full rounded-full bg-gradient-to-r', progressColor].join(' ')}
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button
                  type="submit"
                  disabled={saving}
                  leftIcon={
                    saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )
                  }
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setValues(initialValues)}
                >
                  Reset
                </Button>
              </div>

              {success ? (
                <div className="mt-5 rounded-[24px] border border-emerald-400/15 bg-emerald-400/10 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-100" />
                    <div>
                      <h4 className="font-semibold text-emerald-100">Profile updated</h4>
                      <p className="mt-1 text-sm leading-7 text-white/75">
                        Your profile has been saved successfully.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </form>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-2 text-fuchsia-100">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Why this matters</span>
              </div>

              <div className="space-y-3">
                <ChecklistRow
                  label="Better recommendations"
                  done={Boolean(values.fullName && values.educationLevel)}
                />
                <ChecklistRow
                  label="Stronger community trust"
                  done={Boolean(values.avatarUrl || values.bio)}
                />
                <ChecklistRow
                  label="Leaderboard visibility"
                  done={Boolean(values.username && values.location)}
                />
                <ChecklistRow
                  label="Personalized study flow"
                  done={completion >= 70}
                />
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-2 text-emerald-100">
                <BadgeCheck className="h-4 w-4" />
                <span className="text-sm font-semibold">Profile checklist</span>
              </div>

              <div className="space-y-3">
                <ChecklistRow label="Full name" done={Boolean(values.fullName.trim())} />
                <ChecklistRow label="Email" done={Boolean(values.email.trim())} />
                <ChecklistRow label="Education level" done={Boolean(values.educationLevel.trim())} />
                <ChecklistRow label="Class / Batch" done={Boolean(values.className.trim())} />
                <ChecklistRow label="Avatar or bio" done={Boolean(values.avatarUrl.trim() || values.bio.trim())} />
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
                <p className="text-sm leading-7 text-white/75">
                  A complete profile improves AI suggestions, progress tracking, and community experience.
                </p>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[#08111F]/75 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-cyan-100">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-semibold">Privacy note</span>
              </div>

              <p className="text-sm leading-7 text-white/65">
                Your details are used to personalize learning and improve your account experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
