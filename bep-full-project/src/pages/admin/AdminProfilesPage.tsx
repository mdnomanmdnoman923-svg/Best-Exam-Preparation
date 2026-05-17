// bep-full-project/src/pages/admin/AdminProfilesPage.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Crown,
  Edit3,
  Eye,
  Filter,
  GraduationCap,
  Layers3,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  User,
  Users,
  Wand2,
  X,
  XCircle,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type ProfileRole = 'student' | 'moderator' | 'admin';
type ProfileLanguage = 'bn' | 'en';

interface AdminProfileItem {
  id: string;
  uid: string;
  name: string;
  username?: string;
  email: string;
  photoURL?: string | null;
  role: ProfileRole;
  premium: boolean;
  verified: boolean;
  institution?: string;
  phone?: string;
  className?: string;
  educationLevel?: string;
  location?: string;
  language: ProfileLanguage;
  totalPoints: number;
  totalExams: number;
  totalPracticeCompleted: number;
  leaderboardRank?: number;
  streak?: number;
  bookmarksCount?: number;
  joinedAt?: string;
  lastActiveAt?: string;
  updatedAt?: string;
}

interface ProfileFormState {
  name: string;
  username: string;
  email: string;
  photoURL: string;
  role: ProfileRole;
  premium: boolean;
  verified: boolean;
  institution: string;
  phone: string;
  className: string;
  educationLevel: string;
  location: string;
  language: ProfileLanguage;
  totalPoints: number;
  totalExams: number;
  totalPracticeCompleted: number;
  leaderboardRank: number;
  streak: number;
  bookmarksCount: number;
}

const seedProfiles: AdminProfileItem[] = [
  {
    id: 'profile-1',
    uid: 'uid-student-001',
    name: 'Arafat Hossain',
    username: 'arafat',
    email: 'arafat@example.com',
    photoURL: 'https://i.pravatar.cc/200?img=12',
    role: 'student',
    premium: true,
    verified: true,
    institution: 'Dhaka College',
    phone: '+8801712345678',
    className: 'HSC 2nd Year',
    educationLevel: 'College',
    location: 'Dhaka',
    language: 'bn',
    totalPoints: 1840,
    totalExams: 18,
    totalPracticeCompleted: 246,
    leaderboardRank: 12,
    streak: 14,
    bookmarksCount: 32,
    joinedAt: '2026-02-10T10:00:00.000Z',
    lastActiveAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'profile-2',
    uid: 'uid-student-002',
    name: 'Nusrat Jahan',
    username: 'nusratj',
    email: 'nusrat@example.com',
    photoURL: 'https://i.pravatar.cc/200?img=32',
    role: 'student',
    premium: false,
    verified: true,
    institution: 'Govt. Science College',
    phone: '+8801812345678',
    className: 'HSC 1st Year',
    educationLevel: 'College',
    location: 'Chattogram',
    language: 'bn',
    totalPoints: 1260,
    totalExams: 11,
    totalPracticeCompleted: 168,
    leaderboardRank: 41,
    streak: 7,
    bookmarksCount: 18,
    joinedAt: '2026-03-18T10:00:00.000Z',
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'profile-3',
    uid: 'uid-moderator-001',
    name: 'Sabbir Rahman',
    username: 'sabbir_mod',
    email: 'sabbir@bep.top',
    photoURL: 'https://i.pravatar.cc/200?img=48',
    role: 'moderator',
    premium: true,
    verified: true,
    institution: 'BEP Moderation Team',
    phone: '+8801912345678',
    className: 'Admin',
    educationLevel: 'Platform',
    location: 'Remote',
    language: 'en',
    totalPoints: 3720,
    totalExams: 0,
    totalPracticeCompleted: 52,
    leaderboardRank: 4,
    streak: 21,
    bookmarksCount: 10,
    joinedAt: '2025-12-05T10:00:00.000Z',
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'profile-4',
    uid: 'uid-admin-001',
    name: 'Admin Root',
    username: 'adminroot',
    email: 'admin@bep.top',
    photoURL: 'https://i.pravatar.cc/200?img=5',
    role: 'admin',
    premium: true,
    verified: true,
    institution: 'BEP HQ',
    phone: '+8801512345678',
    className: 'Super Admin',
    educationLevel: 'Platform',
    location: 'Dhaka',
    language: 'bn',
    totalPoints: 9999,
    totalExams: 0,
    totalPracticeCompleted: 0,
    leaderboardRank: 1,
    streak: 0,
    bookmarksCount: 0,
    joinedAt: '2025-10-01T10:00:00.000Z',
    lastActiveAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function roleLabel(role: ProfileRole) {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'moderator':
      return 'Moderator';
    case 'student':
    default:
      return 'Student';
  }
}

function roleBadgeVariant(role: ProfileRole): 'success' | 'premium' | 'secondary' {
  switch (role) {
    case 'admin':
      return 'premium';
    case 'moderator':
      return 'success';
    case 'student':
    default:
      return 'secondary';
  }
}

function languageLabel(lang: ProfileLanguage) {
  return lang === 'bn' ? 'বাংলা' : 'English';
}

function formatRelativeTime(value?: string) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function StatCard({
  title,
  value,
  icon,
  accent = 'cyan',
  note,
}: {
  title: string;
  value: number | string;
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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 block text-sm text-white/60">{children}</label>;
}

export default function AdminProfilesPage() {
  const [profiles, setProfiles] = useState<AdminProfileItem[]>(seedProfiles);
  const [loading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<ProfileRole | 'all'>('all');
  const [premiumFilter, setPremiumFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [languageFilter, setLanguageFilter] = useState<'all' | ProfileLanguage>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<AdminProfileItem | null>(null);
  const [form, setForm] = useState<ProfileFormState>({
    name: '',
    username: '',
    email: '',
    photoURL: '',
    role: 'student',
    premium: false,
    verified: false,
    institution: '',
    phone: '',
    className: '',
    educationLevel: '',
    location: '',
    language: 'bn',
    totalPoints: 0,
    totalExams: 0,
    totalPracticeCompleted: 0,
    leaderboardRank: 0,
    streak: 0,
    bookmarksCount: 0,
  });

  const stats = useMemo(() => {
    const total = profiles.length;
    const premium = profiles.filter((item) => item.premium).length;
    const verified = profiles.filter((item) => item.verified).length;
    const admins = profiles.filter((item) => item.role === 'admin').length;
    const activeNow = profiles.filter((item) => {
      const date = item.lastActiveAt ? new Date(item.lastActiveAt) : null;
      if (!date || Number.isNaN(date.getTime())) return false;
      return Date.now() - date.getTime() <= 1000 * 60 * 60 * 24;
    }).length;

    const averageCompletion = total
      ? Math.round(
          profiles.reduce((sum, item) => {
            const fields = [
              item.name,
              item.email,
              item.phone,
              item.institution,
              item.className,
              item.educationLevel,
              item.location,
              item.photoURL,
            ];
            const filled = fields.filter((value) => Boolean(value && String(value).trim())).length;
            return sum + Math.round((filled / fields.length) * 100);
          }, 0) / total,
        )
      : 0;

    return {
      total,
      premium,
      verified,
      admins,
      activeNow,
      averageCompletion,
    };
  }, [profiles]);

  const filteredProfiles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return profiles
      .filter((profile) => {
        const matchesSearch =
          !query ||
          [
            profile.name,
            profile.username,
            profile.email,
            profile.institution,
            profile.phone,
            profile.className,
            profile.educationLevel,
            profile.location,
            profile.role,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query);

        const matchesRole = roleFilter === 'all' || profile.role === roleFilter;
        const matchesPremium =
          premiumFilter === 'all' ||
          (premiumFilter === 'yes' ? profile.premium : !profile.premium);
        const matchesVerified =
          verifiedFilter === 'all' ||
          (verifiedFilter === 'yes' ? profile.verified : !profile.verified);
        const matchesLanguage = languageFilter === 'all' || profile.language === languageFilter;

        return matchesSearch && matchesRole && matchesPremium && matchesVerified && matchesLanguage;
      })
      .sort((a, b) => {
        const rankA = a.leaderboardRank || 9999;
        const rankB = b.leaderboardRank || 9999;
        return rankA - rankB;
      });
  }, [languageFilter, premiumFilter, profiles, roleFilter, ڳsearch, verifiedFilter]);

  const resetForm = () => {
    setForm({
      name: '',
      username: '',
      email: '',
      photoURL: '',
      role: 'student',
      premium: false,
      verified: false,
      institution: '',
      phone: '',
      className: '',
      educationLevel: '',
      location: '',
      language: 'bn',
      totalPoints: 0,
      totalExams: 0,
      totalPracticeCompleted: 0,
      leaderboardRank: 0,
      streak: 0,
      bookmarksCount: 0,
    });
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (profile: AdminProfileItem) => {
    setEditingId(profile.id);
    setForm({
      name: profile.name,
      username: profile.username || '',
      email: profile.email,
      photoURL: profile.photoURL || '',
      role: profile.role,
      premium: profile.premium,
      verified: profile.verified,
      institution: profile.institution || '',
      phone: profile.phone || '',
      className: profile.className || '',
      educationLevel: profile.educationLevel || '',
      location: profile.location || '',
      language: profile.language,
      totalPoints: profile.totalPoints,
      totalExams: profile.totalExams,
      totalPracticeCompleted: profile.totalPracticeCompleted,
      leaderboardRank: profile.leaderboardRank || 0,
      streak: profile.streak || 0,
      bookmarksCount: profile.bookmarksCount || 0,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    try {
      setSaving(true);
      const now = new Date().toISOString();

      if (editingId) {
        setProfiles((previous) =>
          previous.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  name: form.name.trim(),
                  username: form.username.trim(),
                  email: form.email.trim(),
                  photoURL: form.photoURL.trim() || null,
                  role: form.role,
                  premium: form.premium,
                  verified: form.verified,
                  institution: form.institution.trim(),
                  phone: form.phone.trim(),
                  className: form.className.trim(),
                  educationLevel: form.educationLevel.trim(),
                  location: form.location.trim(),
                  language: form.language,
                  totalPoints: Number(form.totalPoints) || 0,
                  totalExams: Number(form.totalExams) || 0,
                  totalPracticeCompleted: Number(form.totalPracticeCompleted) || 0,
                  leaderboardRank: Number(form.leaderboardRank) || undefined,
                  streak: Number(form.streak) || 0,
                  bookmarksCount: Number(form.bookmarksCount) || 0,
                  updatedAt: now,
                }
              : item,
          ),
        );
      } else {
        const nextProfile: AdminProfileItem = {
          id: `profile-${Date.now()}`,
          uid: `uid-${Date.now()}`,
          name: form.name.trim(),
          username: form.username.trim(),
          email: form.email.trim(),
          photoURL: form.photoURL.trim() || null,
          role: form.role,
          premium: form.premium,
          verified: form.verified,
          institution: form.institution.trim(),
          phone: form.phone.trim(),
          className: form.className.trim(),
          educationLevel: form.educationLevel.trim(),
          location: form.location.trim(),
          language: form.language,
          totalPoints: Number(form.totalPoints) || 0,
          totalExams: Number(form.totalExams) || 0,
          totalPracticeCompleted: Number(form.totalPracticeCompleted) || 0,
          leaderboardRank: Number(form.leaderboardRank) || undefined,
          streak: Number(form.streak) || 0,
          bookmarksCount: Number(form.bookmarksCount) || 0,
          joinedAt: now,
          lastActiveAt: now,
          updatedAt: now,
        };

        setProfiles((previous) => [nextProfile, ...previous]);
      }

      closeForm();
    } finally {
      setSaving(false);
    }
  };

  const removeProfile = (id: string) => {
    const confirmed = window.confirm('Delete this profile?');
    if (!confirmed) return;
    setProfiles((previous) => previous.filter((item) => item.id !== id));
    if (selectedProfile?.id === id) {
      setSelectedProfile(null);
    }
  };

  const togglePremium = (id: string) => {
    setProfiles((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, premium: !item.premium, updatedAt: new Date().toISOString() }
          : item,
      ),
    );
  };

  const toggleVerified = (id: string) => {
    setProfiles((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, verified: !item.verified, updatedAt: new Date().toISOString() }
          : item,
      ),
    );
  };

  const promoteRole = (id: string) => {
    setProfiles((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;
        const nextRole: ProfileRole = item.role === 'student' ? 'moderator' : 'admin';
        return { ...item, role: nextRole, updatedAt: new Date().toISOString() };
      }),
    );
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
                  BEP Admin Panel
                </div>

                <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                  Profile Management
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  Admin can inspect user profiles, manage roles, verification, and premium access from one place.
                </p>
              </div>

              <Button onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>
                Add Profile
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Profiles"
            value={stats.total}
            icon={<Users className="h-5 w-5" />}
            accent="cyan"
            note="Registered users in the platform"
          />
          <StatCard
            title="Premium"
            value={stats.premium}
            icon={<Crown className="h-5 w-5" />}
            accent="fuchsia"
            note="Users with premium access"
          />
          <StatCard
            title="Verified"
            value={stats.verified}
            icon={<BadgeCheck className="h-5 w-5" />}
            accent="emerald"
            note="Profiles with verification badge"
          />
          <StatCard
            title="Active Today"
            value={stats.activeNow}
            icon={<ShieldCheck className="h-5 w-5" />}
            accent="amber"
            note="Last active within 24 hours"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-2 text-cyan-100">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-semibold">Filters</span>
            </div>

            <div className="space-y-4">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search profile..."
                leftIcon={<Search className="h-4 w-4" />}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel>Role</FieldLabel>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as ProfileRole | 'all')}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Student</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <FieldLabel>Language</FieldLabel>
                  <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value as 'all' | ProfileLanguage)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">All Languages</option>
                    <option value="bn">বাংলা</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <FieldLabel>Premium</FieldLabel>
                  <select
                    value={premiumFilter}
                    onChange={(e) => setPremiumFilter(e.target.value as 'all' | 'yes' | 'no')}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">All</option>
                    <option value="yes">Premium only</option>
                    <option value="no">Free only</option>
                  </select>
                </div>

                <div>
                  <FieldLabel>Verified</FieldLabel>
                  <select
                    value={verifiedFilter}
                    onChange={(e) => setVerifiedFilter(e.target.value as 'all' | 'yes' | 'no')}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  >
                    <option value="all">All</option>
                    <option value="yes">Verified only</option>
                    <option value="no">Unverified only</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
              <p className="text-sm leading-7 text-white/70">
                Profiles are shown in leaderboard rank order. Use role and verification filters to narrow down moderation tasks.
              </p>
            </div>

            <div className="mt-6 space-y-3 rounded-[26px] border border-white/10 bg-[#08111F]/75 p-5">
              <div className="flex items-center gap-2 text-cyan-100">
                <GraduationCap className="h-4 w-4" />
                <span className="text-sm font-semibold">Summary</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <MiniStat label="Admins" value={stats.admins} />
                <MiniStat label="Average completion" value={`${stats.averageCompletion}%`} />
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-100">
                <Users className="h-4 w-4" />
                <span className="text-sm font-semibold">Profiles</span>
              </div>

              <Badge variant="secondary">{filteredProfiles.length} items</Badge>
            </div>

            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-100" />
              </div>
            ) : filteredProfiles.length > 0 ? (
              <div className="space-y-4">
                {filteredProfiles.map((profile, index) => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="rounded-[24px] border border-white/10 bg-[#08111F]/75 p-5"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="flex min-w-0 flex-1 gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
                          {profile.photoURL ? (
                            <img src={profile.photoURL} alt={profile.name} className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-7 w-7 text-white/45" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <Badge variant={roleBadgeVariant(profile.role)}>{roleLabel(profile.role)}</Badge>
                            {profile.premium ? <Badge variant="premium">Premium</Badge> : null}
                            {profile.verified ? <Badge variant="success">Verified</Badge> : null}
                            {profile.language === 'bn' ? <Badge variant="secondary">বাংলা</Badge> : <Badge variant="secondary">English</Badge>}
                          </div>

                          <h3 className="truncate text-2xl font-bold text-white">{profile.name}</h3>

                          <div className="mt-2 flex flex-wrap gap-4 text-sm text-white/55">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-cyan-100" />
                              {profile.email}
                            </div>

                            {profile.phone ? (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-emerald-100" />
                                {profile.phone}
                              </div>
                            ) : null}

                            {profile.institution ? (
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-fuchsia-100" />
                                {profile.institution}
                              </div>
                            ) : null}
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/55">
                            {profile.className ? (
                              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                                <Layers3 className="h-3.5 w-3.5" />
                                {profile.className}
                              </span>
                            ) : null}

                            {profile.educationLevel ? (
                              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                                <GraduationCap className="h-3.5 w-3.5" />
                                {profile.educationLevel}
                              </span>
                            ) : null}

                            {profile.location ? (
                              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                                <MapPin className="h-3.5 w-3.5" />
                                {profile.location}
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-4 grid gap-3 md:grid-cols-3">
                            <TinyMetric label="Points" value={profile.totalPoints} />
                            <TinyMetric label="Exams" value={profile.totalExams} />
                            <TinyMetric label="Practice" value={profile.totalPracticeCompleted} />
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/55">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                              <ShieldCheck className="h-3.5 w-3.5 text-cyan-100" />
                              Rank #{profile.leaderboardRank || '--'}
                            </span>

                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                              <Sparkles className="h-3.5 w-3.5 text-fuchsia-100" />
                              Streak {profile.streak || 0}
                            </span>

                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                              <Eye className="h-3.5 w-3.5 text-emerald-100" />
                              Active {formatRelativeTime(profile.lastActiveAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-stretch gap-2 xl:min-w-[180px]">
                        <Button variant="secondary" onClick={() => setSelectedProfile(profile)} leftIcon={<Eye className="h-4 w-4" />}>
                          View
                        </Button>
                        <Button variant="secondary" onClick={() => openEdit(profile)} leftIcon={<Edit3 className="h-4 w-4" />}>
                          Edit
                        </Button>
                        <Button onClick={() => togglePremium(profile.id)} leftIcon={<Crown className="h-4 w-4" />}>
                          {profile.premium ? 'Unset Premium' : 'Set Premium'}
                        </Button>
                        <Button variant="secondary" onClick={() => toggleVerified(profile.id)} leftIcon={<BadgeCheck className="h-4 w-4" />}>
                          {profile.verified ? 'Unverify' : 'Verify'}
                        </Button>
                        <Button variant="ghost" onClick={() => promoteRole(profile.id)} leftIcon={<Wand2 className="h-4 w-4" />}>
                          Promote
                        </Button>
                        <button
                          type="button"
                          onClick={() => removeProfile(profile.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/15 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-100 transition hover:bg-red-400/20"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10">
                <XCircle className="h-12 w-12 text-white/30" />
                <h3 className="mt-4 text-xl font-bold">No profiles found</h3>
                <p className="mt-2 text-sm text-white/55">Change the filters or add a new profile.</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Average Completion"
            value={`${stats.averageCompletion}%`}
            icon={<CheckCircle2 className="h-5 w-5" />}
            accent="emerald"
            note="Profile completeness across users"
          />
          <StatCard
            title="Leaderboard Entries"
            value={profiles.filter((item) => typeof item.leaderboardRank === 'number').length}
            icon={<Star className="h-5 w-5" />}
            accent="fuchsia"
            note="Profiles with ranking information"
          />
          <StatCard
            title="Languages"
            value={profiles.reduce((set, item) => set.add(item.language), new Set<ProfileLanguage>()).size}
            icon={<ShieldCheck className="h-5 w-5" />}
            accent="amber"
            note="Bengali and English users combined"
          />
          <StatCard
            title="Total Streak Days"
            value={profiles.reduce((sum, item) => sum + (item.streak || 0), 0)}
            icon={<Flame className="h-5 w-5" />}
            accent="cyan"
            note="Cumulative active study streaks"
          />
        </div>

        {showForm ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
            <div className="w-full max-w-4xl rounded-[32px] border border-white/10 bg-[#08111F] p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black">{editingId ? 'Edit Profile' : 'Create Profile'}</h2>
                  <p className="mt-2 text-sm text-white/60">
                    Manage profile data, ranking metrics, and access status.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-2xl border border-white/10 p-3 text-white/70 transition hover:bg-white/[0.05]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((previous) => ({ ...previous, name: e.target.value }))}
                    placeholder="Full name"
                    leftIcon={<User className="h-4 w-4" />}
                  />
                  <Input
                    value={form.username}
                    onChange={(e) => setForm((previous) => ({ ...previous, username: e.target.value }))}
                    placeholder="Username"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((previous) => ({ ...previous, email: e.target.value }))}
                    placeholder="Email"
                    leftIcon={<Mail className="h-4 w-4" />}
                  />
                  <Input
                    value={form.photoURL}
                    onChange={(e) => setForm((previous) => ({ ...previous, photoURL: e.target.value }))}
                    placeholder="Avatar URL"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <FieldLabel>Role</FieldLabel>
                    <select
                      value={form.role}
                      onChange={(e) => setForm((previous) => ({ ...previous, role: e.target.value as ProfileRole }))}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                    >
                      <option value="student">Student</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <FieldLabel>Language</FieldLabel>
                    <select
                      value={form.language}
                      onChange={(e) => setForm((previous) => ({ ...previous, language: e.target.value as ProfileLanguage }))}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                    >
                      <option value="bn">বাংলা</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <Input
                    type="number"
                    value={String(form.leaderboardRank)}
                    onChange={(e) => setForm((previous) => ({ ...previous, leaderboardRank: Number(e.target.value) || 0 }))}
                    placeholder="Leaderboard rank"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={form.institution}
                    onChange={(e) => setForm((previous) => ({ ...previous, institution: e.target.value }))}
                    placeholder="Institution"
                    leftIcon={<BookOpen className="h-4 w-4" />}
                  />
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm((previous) => ({ ...previous, phone: e.target.value }))}
                    placeholder="Phone"
                    leftIcon={<Phone className="h-4 w-4" />}
                  />
                  <Input
                    value={form.className}
                    onChange={(e) => setForm((previous) => ({ ...previous, className: e.target.value }))}
                    placeholder="Class / Batch"
                    leftIcon={<Layers3 className="h-4 w-4" />}
                  />
                  <Input
                    value={form.educationLevel}
                    onChange={(e) => setForm((previous) => ({ ...previous, educationLevel: e.target.value }))}
                    placeholder="Education level"
                    leftIcon={<GraduationCap className="h-4 w-4" />}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Input
                    value={form.location}
                    onChange={(e) => setForm((previous) => ({ ...previous, location: e.target.value }))}
                    placeholder="Location"
                    leftIcon={<MapPin className="h-4 w-4" />}
                  />
                  <Input
                    type="number"
                    value={String(form.totalPoints)}
                    onChange={(e) => setForm((previous) => ({ ...previous, totalPoints: Number(e.target.value) || 0 }))}
                    placeholder="Total points"
                  />
                  <Input
                    type="number"
                    value={String(form.totalExams)}
                    onChange={(e) => setForm((previous) => ({ ...previous, totalExams: Number(e.target.value) || 0 }))}
                    placeholder="Total exams"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Input
                    type="number"
                    value={String(form.totalPracticeCompleted)}
                    onChange={(e) =>
                      setForm((previous) => ({ ...previous, totalPracticeCompleted: Number(e.target.value) || 0 }))
                    }
                    placeholder="Practice completed"
                  />
                  <Input
                    type="number"
                    value={String(form.streak)}
                    onChange={(e) => setForm((previous) => ({ ...previous, streak: Number(e.target.value) || 0 }))}
                    placeholder="Streak"
                  />
                  <Input
                    type="number"
                    value={String(form.bookmarksCount)}
                    onChange={(e) => setForm((previous) => ({ ...previous, bookmarksCount: Number(e.target.value) || 0 }))}
                    placeholder="Bookmarks"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="text-sm">Premium</span>
                    <input
                      type="checkbox"
                      checked={form.premium}
                      onChange={(e) => setForm((previous) => ({ ...previous, premium: e.target.checked }))}
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="text-sm">Verified</span>
                    <input
                      type="checkbox"
                      checked={form.verified}
                      onChange={(e) => setForm((previous) => ({ ...previous, verified: e.target.checked }))}
                    />
                  </label>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/65">Preview badges</span>
                      <div className="flex items-center gap-2">
                        {form.premium ? <Crown className="h-4 w-4 text-fuchsia-100" /> : null}
                        {form.verified ? <BadgeCheck className="h-4 w-4 text-emerald-100" /> : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="submit"
                    disabled={saving}
                    leftIcon={saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  >
                    {saving ? 'Saving...' : editingId ? 'Update Profile' : 'Create Profile'}
                  </Button>

                  <Button type="button" variant="secondary" onClick={closeForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {selectedProfile ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
            <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-[#08111F] p-6 shadow-2xl">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant={roleBadgeVariant(selectedProfile.role)}>{roleLabel(selectedProfile.role)}</Badge>
                    {selectedProfile.premium ? <Badge variant="premium">Premium</Badge> : null}
                    {selectedProfile.verified ? <Badge variant="success">Verified</Badge> : null}
                    <Badge variant="secondary">{languageLabel(selectedProfile.language)}</Badge>
                  </div>

                  <h2 className="truncate text-3xl font-black">{selectedProfile.name}</h2>
                  <p className="mt-2 text-sm leading-7 text-white/60">{selectedProfile.email}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  className="rounded-2xl border border-white/10 p-3 text-white/70 transition hover:bg-white/[0.05]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <DetailCard label="Username" value={selectedProfile.username || '--'} icon={<User className="h-4 w-4" />} />
                <DetailCard label="Phone" value={selectedProfile.phone || '--'} icon={<Phone className="h-4 w-4" />} />
                <DetailCard label="Institution" value={selectedProfile.institution || '--'} icon={<BookOpen className="h-4 w-4" />} />
                <DetailCard label="Class" value={selectedProfile.className || '--'} icon={<Layers3 className="h-4 w-4" />} />
                <DetailCard label="Education" value={selectedProfile.educationLevel || '--'} icon={<GraduationCap className="h-4 w-4" />} />
                <DetailCard label="Location" value={selectedProfile.location || '--'} icon={<MapPin className="h-4 w-4" />} />
                <DetailCard label="Leaderboard Rank" value={selectedProfile.leaderboardRank || '--'} icon={<Star className="h-4 w-4" />} />
                <DetailCard label="Last Active" value={formatRelativeTime(selectedProfile.lastActiveAt)} icon={<ShieldCheck className="h-4 w-4" />} />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <MiniMetric label="Points" value={selectedProfile.totalPoints} />
                <MiniMetric label="Exams" value={selectedProfile.totalExams} />
                <MiniMetric label="Practice" value={selectedProfile.totalPracticeCompleted} />
                <MiniMetric label="Streak" value={selectedProfile.streak || 0} />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => openEdit(selectedProfile)} leftIcon={<Edit3 className="h-4 w-4" />}>
                  Edit Profile
                </Button>
                <Button variant="secondary" onClick={() => togglePremium(selectedProfile.id)} leftIcon={<Crown className="h-4 w-4" />}>
                  Toggle Premium
                </Button>
                <Button variant="secondary" onClick={() => toggleVerified(selectedProfile.id)} leftIcon={<BadgeCheck className="h-4 w-4" />}>
                  Toggle Verified
                </Button>
                <Button variant="ghost" onClick={() => promoteRole(selectedProfile.id)} leftIcon={<Wand2 className="h-4 w-4" />}>
                  Promote Role
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-white/40">{label}</div>
      <div className="mt-1 text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function TinyMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-white/40">{label}</div>
      <div className="mt-1 text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function DetailCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-2 text-cyan-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">{label}</p>
          <h4 className="mt-1 text-lg font-bold text-white">{value}</h4>
        </div>
      </div>
    </div>
  );
}
