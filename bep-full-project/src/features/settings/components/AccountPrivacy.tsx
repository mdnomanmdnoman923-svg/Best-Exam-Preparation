// bep-full-project/src/features/settings/components/AccountPrivacy.tsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  BadgeCheck,
  BrainCircuit,
  Eye,
  EyeOff,
  Globe2,
  Lock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export type PrivacyVisibility = 'public' | 'followers' | 'private';
export type ActivityVisibility = 'public' | 'limited' | 'private';

export interface PrivacySettingsValue {
  profileVisibility: PrivacyVisibility;
  showLeaderboardRank: boolean;
  showStudyActivity: boolean;
  showBookmarks: boolean;
  allowSearchEngineIndexing: boolean;
  allowAiPersonalization: boolean;
  allowCommunityMessages: boolean;
  showOnlineStatus: boolean;
  shareProgressWithTeachers: boolean;
  dataAnalyticsOptIn: boolean;
  twoFactorEnabled: boolean;
  loginAlertsEnabled: boolean;
}

export interface PrivacySettingsMeta {
  label: string;
  description: string;
}

export interface AccountPrivacyProps {
  title?: string;
  subtitle?: string;
  value: PrivacySettingsValue;
  loading?: boolean;
  saving?: boolean;
  compact?: boolean;
  onChange: (value: PrivacySettingsValue) => void;
  onSave?: () => void;
  onReset?: () => void;
  onDeleteAccount?: () => void;
  className?: string;
}

const defaultValue: PrivacySettingsValue = {
  profileVisibility: 'private',
  showLeaderboardRank: false,
  showStudyActivity: false,
  showBookmarks: false,
  allowSearchEngineIndexing: false,
  allowAiPersonalization: true,
  allowCommunityMessages: true,
  showOnlineStatus: false,
  shareProgressWithTeachers: false,
  dataAnalyticsOptIn: true,
  twoFactorEnabled: false,
  loginAlertsEnabled: true,
};

function getVisibilityMeta(value: PrivacyVisibility): PrivacySettingsMeta {
  switch (value) {
    case 'public':
      return {
        label: 'Public',
        description: 'Anyone can see your profile and basic activity.',
      };
    case 'followers':
      return {
        label: 'Followers',
        description: 'Only connected users can view your profile.',
      };
    case 'private':
    default:
      return {
        label: 'Private',
        description: 'Only you can see your profile details.',
      };
  }
}

function getActivityMeta(value: ActivityVisibility): PrivacySettingsMeta {
  switch (value) {
    case 'public':
      return {
        label: 'Public',
        description: 'Your learning activity is visible to everyone.',
      };
    case 'limited':
      return {
        label: 'Limited',
        description: 'Only summary stats are visible publicly.',
      };
    case 'private':
    default:
      return {
        label: 'Private',
        description: 'No activity is shown publicly.',
      };
  }
}

function ToggleRow({
  title,
  description,
  icon,
  checked,
  onToggle,
  disabled,
  danger = false,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  onToggle: (next: boolean) => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <div
      className={[
        'rounded-[26px] border p-5 backdrop-blur-xl transition-all duration-300',
        checked
          ? danger
            ? 'border-red-400/20 bg-red-400/10'
            : 'border-cyan-400/20 bg-cyan-400/10'
          : 'border-white/10 bg-white/[0.04]',
        disabled ? 'opacity-60' : '',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <div
            className={[
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border',
              checked
                ? danger
                  ? 'border-red-400/20 bg-red-400/10 text-red-100'
                  : 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
                : 'border-white/10 bg-white/[0.05] text-white/70',
            ].join(' ')}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-white/60">{description}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggle(!checked)}
          disabled={disabled}
          className={[
            'relative inline-flex h-7 w-14 shrink-0 items-center rounded-full border transition-all duration-300',
            checked
              ? danger
                ? 'border-red-400/20 bg-red-400/20'
                : 'border-cyan-400/20 bg-cyan-400/20'
              : 'border-white/10 bg-white/[0.04]',
            disabled ? 'cursor-not-allowed' : 'hover:scale-[1.02]',
          ].join(' ')}
          aria-pressed={checked}
          aria-label={title}
        >
          <span
            className={[
              'inline-block h-5 w-5 transform rounded-full shadow-lg transition-transform duration-300',
              checked
                ? 'translate-x-8 bg-white'
                : 'translate-x-1 bg-white/65',
            ].join(' ')}
          />
        </button>
      </div>
    </div>
  );
}

function SelectionButton({
  label,
  description,
  active,
  onClick,
}: {
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-[24px] border p-4 text-left transition-all duration-300',
        active
          ? 'border-cyan-400/20 bg-cyan-400/10 shadow-[0_10px_35px_rgba(6,182,212,0.14)]'
          : 'border-white/10 bg-white/[0.04] hover:border-cyan-400/15 hover:bg-white/[0.06]',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-white">{label}</h4>
          <p className="mt-1 text-xs leading-5 text-white/55">{description}</p>
        </div>

        <div
          className={[
            'flex h-5 w-5 items-center justify-center rounded-full border',
            active
              ? 'border-cyan-400/30 bg-cyan-400/20'
              : 'border-white/10 bg-white/[0.04]',
          ].join(' ')}
        >
          <div
            className={[
              'h-2.5 w-2.5 rounded-full transition-all duration-300',
              active ? 'bg-cyan-100' : 'bg-transparent',
            ].join(' ')}
          />
        </div>
      </div>
    </button>
  );
}

export default function AccountPrivacy({
  title = 'Account Privacy',
  subtitle = 'আপনার profile, activity, এবং community visibility control করুন',
  value,
  loading = false,
  saving = false,
  compact
