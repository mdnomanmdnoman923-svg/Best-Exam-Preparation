// bep-full-project/src/pages/admin/AdminSettingsPage.tsx

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Cloud,
  Crown,
  Database,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  LayoutDashboard,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  Palette,
  Radio,
  Save,
  Server,
  ShieldCheck,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Upload,
  Wand2,
  Wifi,
  X,
  XCircle,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type SettingsSection =
  | 'general'
  | 'security'
  | 'notifications'
  | 'appearance'
  | 'system';

interface AppSettingsState {
  appName: string;
  appTagline: string;
  appWebsite: string;
  supportEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  allowGuestMode: boolean;
  enableAiAssistant: boolean;
  enableLeaderboard: boolean;
  enableCommunity: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  darkModeDefault: boolean;
  accentColor: string;
  maxUploadSizeMb: number;
  freeAiMessageLimit: number;
  premiumAiMessageLimit: number;
  storageQuotaGb: number;
  timezone: string;
  locale: string;
  loginOtpRequired: boolean;
  twoFactorRequiredForAdmins: boolean;
  passwordMinLength: number;
  sessionTimeoutMinutes: number;
}

interface AdminAuditItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'premium';
}

const seedAudit: AdminAuditItem[] = [
  {
    id: 'audit-1',
    title: 'Security policy updated',
    description: 'Admin password minimum length changed to 10 characters.',
    time: '5 min ago',
    type: 'success',
  },
  {
    id: 'audit-2',
    title: 'AI quota threshold reached',
    description: 'Free AI messages consumed 92% of monthly limit.',
    time: '15 min ago',
    type: 'warning',
  },
  {
    id: 'audit-3',
    title: 'Database backup completed',
    description: 'Nightly Firestore backup was completed successfully.',
    time: '1 hour ago',
    type: 'info',
  },
  {
    id: 'audit-4',
    title: 'Premium feature toggled',
    description: 'Leaderboard boosts enabled for premium members.',
    time: '3 hours ago',
    type: 'premium',
  },
];

const initialState: AppSettingsState = {
  appName: 'BEP',
  appTagline: 'বাংলাদেশি শিক্ষার্থীদের জন্য আধুনিক AI-powered learning platform',
  appWebsite: 'https://bep.top',
  supportEmail: 'support@bep.top',
  maintenanceMode: false,
  allowRegistration: true,
  allowGuestMode: false,
  enableAiAssistant: true,
  enableLeaderboard: true,
  enableCommunity: true,
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  darkModeDefault: true,
  accentColor: '#22D3EE',
  maxUploadSizeMb: 10,
  freeAiMessageLimit: 20,
  premiumAiMessageLimit: 9999,
  storageQuotaGb: 100,
  timezone: 'Asia/Dhaka',
  locale: 'bn-BD',
  loginOtpRequired: true,
  twoFactorRequiredForAdmins: true,
  passwordMinLength: 10,
  sessionTimeoutMinutes: 120,
};

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

function SectionHeader({
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
      <div className="min-w-0">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-1 text-sm leading-7 text-white/55">{description}</p>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-white">{label}</h4>
          {checked ? (
            <Badge variant="success">On</Badge>
          ) : (
            <Badge variant="secondary">Off</Badge>
          )}
        </div>
        <p className="mt-1 text-sm leading-6 text-white/55">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={[
          'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition',
          checked
            ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
            : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.06] hover:text-white',
        ].join(' ')}
      >
        {checked ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
        {checked ? 'Enabled' : 'Disabled'}
      </button>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 block text-sm text-white/60">{children}</label>;
}

function ActivityBadge({ type }: { type: AdminAuditItem['type'] }) {
  const map = {
    success: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-100',
    info: 'border-cyan-400/15 bg-cyan-400/10 text-cyan-100',
    warning: 'border-amber-400/15 bg-amber-400/10 text-amber-100',
    premium: 'border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-100',
  } as const;

  const label = {
    success: 'Success',
    info: 'Info',
    warning: 'Warning',
    premium: 'Premium',
  } as const;

  return (
    <span className={['inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold', map[type]].join(' ')}>
      {label[type]}
    </span>
  );
}

export default function AdminSettingsPage() {
  const [section, setSection] = useState<SettingsSection>('general');
  const [saving, setSaving] = useState(false);
  const [audit] = useState(seedAudit);
  const [settings, setSettings] = useState<AppSettingsState>(initialState);

  const stats = useMemo(() => {
    const enabledFeatures = [
      settings.allowRegistration,
      settings.allowGuestMode,
      settings.enableAiAssistant,
      settings.enableLeaderboard,
      settings.enableCommunity,
    ].filter(Boolean).length;

    return {
      enabledFeatures,
      securityScore: Math.min(
        100,
        55 +
          (settings.loginOtpRequired ? 15 : 0) +
          (settings.twoFactorRequiredForAdmins ? 15 : 0) +
          (settings.passwordMinLength >= 10 ? 10 : 0) +
          (settings.sessionTimeoutMinutes <= 120 ? 5 : 0),
      ),
      notificationCoverage: [
        settings.emailNotifications,
        settings.pushNotifications,
        settings.smsNotifications,
      ].filter(Boolean).length,
      aiLimit: settings.freeAiMessageLimit,
    };
  }, [settings]);

  const updateField = <K extends keyof AppSettingsState>(field: K, value: AppSettingsState[K]) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setSaving(false);
    }
  };

  const tabList: Array<{ id: SettingsSection; label: string; icon: React.ReactNode }> = [
    { id: 'general', label: 'General', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="h-4 w-4" /> },
    { id: 'system', label: 'System', icon: <Server className="h-4 w-4" /> },
  ];

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
                  Settings
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                  App configuration, security policies, notifications, appearance, and platform toggles এক জায়গায় manage করুন।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Live Config
                </Badge>
                <Badge variant="premium">
                  <Crown className="mr-1 h-3.5 w-3.5" />
                  Admin Control
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Enabled Features"
            value={stats.enabledFeatures}
            icon={<Wand2 className="h-5 w-5" />}
            accent="cyan"
            note="Core features currently active"
          />
          <StatCard
            title="Security Score"
            value={`${stats.securityScore}%`}
            icon={<ShieldCheck className="h-5 w-5" />}
            accent="emerald"
            note="Based on current policy strength"
          />
          <StatCard
            title="Notification Channels"
            value={stats.notificationCoverage}
            icon={<Mail className="h-5 w-5" />}
            accent="amber"
            note="Email, push, and SMS"
          />
          <StatCard
            title="Free AI Quota"
            value={settings.freeAiMessageLimit}
            icon={<Sparkles className="h-5 w-5" />}
            accent="fuchsia"
            note="Monthly free messages"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <SectionHeader
              icon={<Filter className="h-4 w-4" />}
              title="Settings sections"
              description="একটি section নির্বাচন করে specific settings দ্রুত edit করুন।"
            />

            <div className="space-y-2">
              {tabList.map((item) => {
                const active = section === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSection(item.id)}
                    className={[
                      'flex w-full items-center justify-between rounded-[24px] border px-4 py-4 text-left transition',
                      active
                        ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
                        : 'border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.06] hover:text-white',
                    ].join(' ')}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[28px] border border-cyan-400/15 bg-cyan-400/10 p-4">
              <p className="text-sm leading-7 text-white/70">
                Settings change করার আগে audit trail carefully check করুন, বিশেষ করে login, privacy, and security policies।
              </p>
            </div>

            <div className="mt-6 rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5">
              <div className="mb-4 flex items-center gap-2 text-cyan-100">
                <Database className="h-4 w-4" />
                <span className="text-sm font-semibold">Platform status</span>
              </div>

              <div className="space-y-3">
                <InfoRow label="Database" value="Healthy" icon={<Database className="h-4 w-4" />} />
                <InfoRow label="Storage" value={`${settings.storageQuotaGb}% quota`} icon={<Cloud className="h-4 w-4" />} />
                <InfoRow label="Network" value="Stable" icon={<Wifi className="h-4 w-4" />} />
                <InfoRow label="Deployments" value="Latest release active" icon={<Radio className="h-4 w-4" />} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                {section === 'general' ? (
                  <>
                    <SectionHeader
                      icon={<LayoutDashboard className="h-4 w-4" />}
                      title="General settings"
                      description="Branding, visibility, and platform-wide feature toggles."
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        value={settings.appName}
                        onChange={(e) => updateField('appName', e.target.value)}
                        placeholder="App name"
                        leftIcon={<BookOpen className="h-4 w-4" />}
                      />
                      <Input
                        value={settings.appWebsite}
                        onChange={(e) => updateField('appWebsite', e.target.value)}
                        placeholder="Website"
                        leftIcon={<Globe className="h-4 w-4" />}
                      />
                      <Input
                        value={settings.supportEmail}
                        onChange={(e) => updateField('supportEmail', e.target.value)}
                        placeholder="Support email"
                        leftIcon={<Mail className="h-4 w-4" />}
                      />
                      <Input
                        value={settings.appTagline}
                        onChange={(e) => updateField('appTagline', e.target.value)}
                        placeholder="Tagline"
                        leftIcon={<Sparkles className="h-4 w-4" />}
                      />
                    </div>

                    <div className="mt-5 space-y-3">
                      <ToggleRow
                        label="Maintenance mode"
                        description="Enable maintenance screen for all public users."
                        checked={settings.maintenanceMode}
                        onChange={(next) => updateField('maintenanceMode', next)}
                      />
                      <ToggleRow
                        label="Allow registration"
                        description="Let new users create accounts from the landing page."
                        checked={settings.allowRegistration}
                        onChange={(next) => updateField('allowRegistration', next)}
                      />
                      <ToggleRow
                        label="Guest mode"
                        description="Allow temporary access without sign up."
                        checked={settings.allowGuestMode}
                        onChange={(next) => updateField('allowGuestMode', next)}
                      />
                    </div>
                  </>
                ) : null}

                {section === 'security' ? (
                  <>
                    <SectionHeader
                      icon={<Lock className="h-4 w-4" />}
                      title="Security settings"
                      description="Login, session, password, and 2FA policy management."
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        type="number"
                        value={String(settings.passwordMinLength)}
                        onChange={(e) => updateField('passwordMinLength', Number(e.target.value) || 8)}
                        placeholder="Password min length"
                        leftIcon={<KeyRound className="h-4 w-4" />}
                      />
                      <Input
                        type="number"
                        value={String(settings.sessionTimeoutMinutes)}
                        onChange={(e) => updateField('sessionTimeoutMinutes', Number(e.target.value) || 120)}
                        placeholder="Session timeout (minutes)"
                        leftIcon={<ClockIcon />}
                      />
                    </div>

                    <div className="mt-5 space-y-3">
                      <ToggleRow
                        label="Login OTP required"
                        description="Require OTP for email/password login."
                        checked={settings.loginOtpRequired}
                        onChange={(next) => updateField('loginOtpRequired', next)}
                      />
                      <ToggleRow
                        label="2FA required for admins"
                        description="Force extra verification for admin accounts."
                        checked={settings.twoFactorRequiredForAdmins}
                        onChange={(next) => updateField('twoFactorRequiredForAdmins', next)}
                      />
                      <ToggleRow
                        label="Auto-logout inactive sessions"
                        description="Reduce risk by expiring long-running sessions."
                        checked={settings.sessionTimeoutMinutes <= 120}
                        onChange={(next) => updateField('sessionTimeoutMinutes', next ? 120 : 360)}
                      />
                    </div>

                    <div className="mt-5 rounded-[28px] border border-amber-400/15 bg-amber-400/10 p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-100" />
                        <p className="text-sm leading-7 text-white/75">
                          Admin actions are logged automatically. Keep security settings strict to protect student data.
                        </p>
                      </div>
                    </div>
                  </>
                ) : null}

                {section === 'notifications' ? (
                  <>
                    <SectionHeader
                      icon={<Bell className="h-4 w-4" />}
                      title="Notification settings"
                      description="Choose which channels receive alerts and reports."
                    />

                    <div className="space-y-3">
                      <ToggleRow
                        label="Email notifications"
                        description="Send account, payment, and system updates through email."
                        checked={settings.emailNotifications}
                        onChange={(next) => updateField('emailNotifications', next)}
                      />
                      <ToggleRow
                        label="Push notifications"
                        description="Send real-time browser or device push alerts."
                        checked={settings.pushNotifications}
                        onChange={(next) => updateField('pushNotifications', next)}
                      />
                      <ToggleRow
                        label="SMS notifications"
                        description="Send critical notifications via SMS."
                        checked={settings.smsNotifications}
                        onChange={(next) => updateField('smsNotifications', next)}
                      />
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div>
                        <FieldLabel>Support mailbox</FieldLabel>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
                          {settings.supportEmail}
                        </div>
                      </div>

                      <div>
                        <FieldLabel>Notification coverage</FieldLabel>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
                          {stats.notificationCoverage} channels active
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-[28px] border border-cyan-400/15 bg-cyan-400/10 p-4">
                      <p className="text-sm leading-7 text-white/75">
                        Use email for reports, push for instant alerts, and SMS for urgent security notifications.
                      </p>
                    </div>
                  </>
                ) : null}

                {section === 'appearance' ? (
                  <>
                    <SectionHeader
                      icon={<Palette className="h-4 w-4" />}
                      title="Appearance settings"
                      description="Default theme, locale, and brand accent control."
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        value={settings.accentColor}
                        onChange={(e) => updateField('accentColor', e.target.value)}
                        placeholder="Accent color"
                        leftIcon={<Palette className="h-4 w-4" />}
                      />
                      <Input
                        value={settings.locale}
                        onChange={(e) => updateField('locale', e.target.value)}
                        placeholder="Locale"
                        leftIcon={<Globe className="h-4 w-4" />}
                      />
                      <Input
                        value={settings.timezone}
                        onChange={(e) => updateField('timezone', e.target.value)}
                        placeholder="Timezone"
                        leftIcon={<Cloud className="h-4 w-4" />}
                      />
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-white/70">Dark mode default</div>
                            <div className="mt-1 text-xs text-white/45">Apply dark theme to new users.</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => updateField('darkModeDefault', !settings.darkModeDefault)}
                            className={[
                              'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition',
                              settings.darkModeDefault
                                ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                                : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.06] hover:text-white',
                            ].join(' ')}
                          >
                            {settings.darkModeDefault ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            {settings.darkModeDefault ? 'Dark' : 'Light'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-[28px] border border-white/10 bg-[#08111F]/75 p-5">
                      <div className="mb-4 flex items-center gap-2 text-cyan-100">
                        <Palette className="h-4 w-4" />
                        <span className="text-sm font-semibold">Brand preview</span>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                          <div className="text-xs font-semibold uppercase tracking-wider text-white/40">Accent</div>
                          <div className="mt-2 text-lg font-bold text-white">{settings.accentColor}</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                          <div className="text-xs font-semibold uppercase tracking-wider text-white/40">Locale</div>
                          <div className="mt-2 text-lg font-bold text-white">{settings.locale}</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                          <div className="text-xs font-semibold uppercase tracking-wider text-white/40">Timezone</div>
                          <div className="mt-2 text-lg font-bold text-white">{settings.timezone}</div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}

                {section === 'system' ? (
                  <>
                    <SectionHeader
                      icon={<Server className="h-4 w-4" />}
                      title="System settings"
                      description="Storage, AI quotas, and operational limits."
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        type="number"
                        value={String(settings.maxUploadSizeMb)}
                        onChange={(e) => updateField('maxUploadSizeMb', Number(e.target.value) || 10)}
                        placeholder="Max upload size (MB)"
                        leftIcon={<Upload className="h-4 w-4" />}
                      />
                      <Input
                        type="number"
                        value={String(settings.storageQuotaGb)}
                        onChange={(e) => updateField('storageQuotaGb', Number(e.target.value) || 100)}
                        placeholder="Storage quota (GB)"
                        leftIcon={<Database className="h-4 w-4" />}
                      />
                      <Input
                        type="number"
                        value={String(settings.freeAiMessageLimit)}
                        onChange={(e) => updateField('freeAiMessageLimit', Number(e.target.value) || 20)}
                        placeholder="Free AI limit"
                        leftIcon={<MessageSquare className="h-4 w-4" />}
                      />
                      <Input
                        type="number"
                        value={String(settings.premiumAiMessageLimit)}
                        onChange={(e) => updateField('premiumAiMessageLimit', Number(e.target.value) || 9999)}
                        placeholder="Premium AI limit"
                        leftIcon={<Sparkles className="h-4 w-4" />}
                      />
                    </div>

                    <div className="mt-5 space-y-3">
                      <ToggleRow
                        label="AI assistant enabled"
                        description="Allow learners to ask questions to the BEP AI assistant."
                        checked={settings.enableAiAssistant}
                        onChange={(next) => updateField('enableAiAssistant', next)}
                      />
                      <ToggleRow
                        label="Leaderboard enabled"
                        description="Show rankings and weekly scoreboards."
                        checked={settings.enableLeaderboard}
                        onChange={(next) => updateField('enableLeaderboard', next)}
                      />
                      <ToggleRow
                        label="Community enabled"
                        description="Allow posts and replies in the study community."
                        checked={settings.enableCommunity}
                        onChange={(next) => updateField('enableCommunity', next)}
                      />
                    </div>

                    <div className="mt-5 rounded-[28px] border border-amber-400/15 bg-amber-400/10 p-4">
                      <div className="flex items-start gap-3">
                        <CircleAlert className="mt-0.5 h-4 w-4 text-amber-100" />
                        <p className="text-sm leading-7 text-white/75">
                          Raising quotas increases infrastructure cost. Use premium plans to offset AI and storage usage.
                        </p>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>

              <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-fuchsia-100">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="text-sm font-semibold">Save changes</span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-white/55">
                      Save করলে current admin settings update হবে এবং audit log-এ record থাকবে।
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="submit"
                      disabled={saving}
                      leftIcon={saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    >
                      {saving ? 'Saving...' : 'Save Settings'}
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setSettings(initialState)}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Session Timeout"
            value={`${settings.sessionTimeoutMinutes}m`}
            icon={<ClockIcon />}
            accent="cyan"
            note="User inactivity expiration"
          />
          <StatCard
            title="Password Min"
            value={settings.passwordMinLength}
            icon={<KeyRound className="h-5 w-5" />}
            accent="emerald"
            note="Minimum password length"
          />
          <StatCard
            title="Storage Quota"
            value={`${settings.storageQuotaGb} GB`}
            icon={<Cloud className="h-5 w-5" />}
            accent="amber"
            note="Planned Firestore/Storage quota"
          />
          <StatCard
            title="Upload Limit"
            value={`${settings.maxUploadSizeMb} MB`}
            icon={<Upload className="h-5 w-5" />}
            accent="fuchsia"
            note="Maximum allowed upload size"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-2 text-cyan-100">
              <Database className="h-4 w-4" />
              <span className="text-sm font-semibold">Operational checklist</span>
            </div>

            <div className="space-y-3">
              <ChecklistRow title="Backup schedule enabled" checked />
              <ChecklistRow title="Admin audit logging active" checked />
              <ChecklistRow title="Password policy enforced" checked={settings.passwordMinLength >= 10} />
              <ChecklistRow title="OTP flow active" checked={settings.loginOtpRequired} />
              <ChecklistRow title="2FA for admins active" checked={settings.twoFactorRequiredForAdmins} />
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
              <p className="text-sm leading-7 text-white/75">
                Routine system checks help keep the platform stable before exams, events, and traffic spikes.
              </p>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-cyan-100">
                  <Server className="h-4 w-4" />
                  <span className="text-sm font-semibold">Audit log</span>
                </div>
                <p className="mt-2 text-sm leading-7 text-white/55">
                  Recent admin activity and critical system changes.
                </p>
              </div>

              <Badge variant="secondary">{audit.length} events</Badge>
            </div>

            <div className="space-y-3">
              {audit.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[22px] border border-white/10 bg-[#08111F]/75 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                        <ActivityBadge type={item.type} />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/55">{item.description}</p>
                    </div>

                    <span className="shrink-0 text-xs text-white/40">{item.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-fuchsia-100">
                <Crown className="h-4 w-4" />
                <span className="text-sm font-semibold">Premium governance</span>
              </div>
              <p className="mt-2 text-sm leading-7 text-white/55">
                Premium feature access, AI quota, এবং member experience controls এখান থেকেই পরিচালনা করুন।
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="premium">AI Ready</Badge>
              <Badge variant="success">Secure</Badge>
              <Badge variant="secondary">Moderated</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistRow({
  title,
  checked,
}: {
  title: string;
  checked: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="text-sm text-white/65">{title}</span>
      {checked ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-100" />
      ) : (
        <XCircle className="h-4 w-4 text-red-100" />
      )}
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="flex items-center gap-2 text-sm text-white/60">
        <span className="text-cyan-100">{icon}</span>
        {label}
      </span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function ClockIcon() {
  return <Radio className="h-5 w-5" />;
}
