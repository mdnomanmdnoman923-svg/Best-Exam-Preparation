// bep-full-project/src/features/settings/types.ts

import type { ReactNode } from 'react';

export type ThemeMode =
  | 'light'
  | 'dark'
  | 'system';

export type NotificationChannel =
  | 'email'
  | 'push'
  | 'sms'
  | 'in_app';

export type PrivacyLevel =
  | 'public'
  | 'friends'
  | 'private';

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

export interface AccountPrivacyValues {
  profileVisibility: PrivacyLevel;

  showEmail: boolean;

  showPhone: boolean;

  showInstitution: boolean;

  showLeaderboardProfile: boolean;

  showCommunityActivity: boolean;

  searchableProfile: boolean;

  allowFriendRequests: boolean;

  allowDirectMessages: boolean;

  analyticsTracking: boolean;
}

export interface AccountPrivacyProps {
  values: AccountPrivacyValues;

  loading?: boolean;

  disabled?: boolean;

  onChange: (
    values: AccountPrivacyValues,
  ) => void;

  onSave?: (
    values: AccountPrivacyValues,
  ) => Promise<void> | void;

  className?: string;
}

export interface NotificationPreferenceItem {
  id: string;

  title: string;

  description?: string;

  enabled: boolean;

  channels?: NotificationChannel[];

  icon?: ReactNode;
}

export interface NotificationSettingsValues {
  examReminders: boolean;

  leaderboardUpdates: boolean;

  communityReplies: boolean;

  aiStudySuggestions: boolean;

  streakAlerts: boolean;

  marketingEmails: boolean;

  weeklyReports: boolean;

  pushNotifications: boolean;

  emailNotifications: boolean;

  smsNotifications: boolean;
}

export interface NotificationSettingsProps {
  values: NotificationSettingsValues;

  loading?: boolean;

  disabled?: boolean;

  onChange: (
    values: NotificationSettingsValues,
  ) => void;

  onSave?: (
    values: NotificationSettingsValues,
  ) => Promise<void> | void;

  className?: string;
}

export interface AppearanceSettingsValues {
  theme: ThemeMode;

  compactMode: boolean;

  reduceAnimations: boolean;

  highContrast: boolean;

  fontScale?: number;

  accentColor?: string;
}

export interface AppearanceSettingsProps {
  values: AppearanceSettingsValues;

  loading?: boolean;

  disabled?: boolean;

  onChange: (
    values: AppearanceSettingsValues,
  ) => void;

  onSave?: (
    values: AppearanceSettingsValues,
  ) => Promise<void> | void;

  className?: string;
}

export interface ConnectedDevice {
  id: string;

  deviceName: string;

  platform?: string;

  browser?: string;

  ipAddress?: string;

  location?: string;

  current?: boolean;

  lastActiveAt?: string;
}

export interface SecuritySessionProps {
  devices: ConnectedDevice[];

  loading?: boolean;

  disabled?: boolean;

  onLogoutDevice?: (
    deviceId: string,
  ) => Promise<void> | void;

  onLogoutAll?: () => Promise<void> | void;

  className?: string;
}

export interface SettingsSectionItem {
  id: string;

  label: string;

  description?: string;

  icon?: ReactNode;

  badge?: string;

  premium?: boolean;
}

export interface SettingsSidebarProps {
  sections: SettingsSectionItem[];

  activeSection: string;

  onSelect: (
    sectionId: string,
  ) => void;

  className?: string;
}

export interface SettingsOverviewStats {
  profileCompletion: number;

  activeDevices: number;

  securityScore: number;

  enabledNotifications: number;
}

export interface SettingsOverviewProps {
  stats: SettingsOverviewStats;

  premium?: boolean;

  verified?: boolean;

  className?: string;
}

export interface SettingsStoreState {
  loading: boolean;

  error: string | null;

  profile:
    | ProfileSettingsValues
    | null;

  privacy:
    | AccountPrivacyValues
    | null;

  notifications:
    | NotificationSettingsValues
    | null;

  appearance:
    | AppearanceSettingsValues
    | null;

  devices: ConnectedDevice[];

  lastUpdated?: string | null;
}

export interface SettingsStoreActions {
  setLoading: (
    value: boolean,
  ) => void;

  setError: (
    value: string | null,
  ) => void;

  setProfile: (
    value: ProfileSettingsValues | null,
  ) => void;

  setPrivacy: (
    value: AccountPrivacyValues | null,
  ) => void;

  setNotifications: (
    value:
      | NotificationSettingsValues
      | null,
  ) => void;

  setAppearance: (
    value:
      | AppearanceSettingsValues
      | null,
  ) => void;

  setDevices: (
    value: ConnectedDevice[],
  ) => void;

  reset: () => void;
}
