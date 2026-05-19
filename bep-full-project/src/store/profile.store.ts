// bep-full-project/src/store/profile.store.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { AuthProfile } from '@/services/auth.service';

export type ProfileLanguage = 'bn' | 'en';

export interface ProfilePreferences {
  darkModeDefault: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  publicProfile: boolean;
  showActivity: boolean;
  shareProgressStats: boolean;
  allowCommunityMentions: boolean;
  enableLeaderboard?: boolean;
  enableAI?: boolean;
}

export interface ProfileStateData extends Partial<AuthProfile> {
  fullName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  institution?: string;
  educationLevel?: string;
  className?: string;
  batch?: string;
  subject?: string;
  language?: ProfileLanguage;
  preferences?: Partial<ProfilePreferences>;
}

interface ProfileState {
  profile: ProfileStateData | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  initialized: boolean;

  completion: number;
  preferences: ProfilePreferences;

  setProfile: (profile: ProfileStateData | null) => void;
  patchProfile: (patch: Partial<ProfileStateData>) => void;
  clearProfile: () => void;

  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;

  setCompletion: (completion: number) => void;
  recalculateCompletion: () => number;

  setPreferences: (preferences: Partial<ProfilePreferences>) => void;
  patchPreferences: (patch: Partial<ProfilePreferences>) => void;

  isComplete: () => boolean;
  hasAvatar: () => boolean;
  hasBio: () => boolean;
  hasEducationInfo: () => boolean;
}

const DEFAULT_PREFERENCES: ProfilePreferences = {
  darkModeDefault: true,
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  publicProfile: true,
  showActivity: true,
  shareProgressStats: true,
  allowCommunityMentions: true,
  enableLeaderboard: true,
  enableAI: true,
};

const initialState = {
  profile: null,
  loading: true,
  saving: false,
  error: null,
  initialized: false,
  completion: 0,
  preferences: DEFAULT_PREFERENCES,
};

function normalizeString(value?: string | null) {
  return (value ?? '').trim();
}

function calculateCompletion(profile: ProfileStateData | null) {
  if (!profile) return 0;

  const fields = [
    profile.fullName,
    profile.username,
    profile.email,
    profile.bio,
    profile.avatarUrl,
    profile.location,
    profile.institution,
    profile.educationLevel,
    profile.className,
    profile.batch,
    profile.subject,
    profile.language,
  ];

  const filled = fields.filter((item) => normalizeString(String(item)).length > 0).length;
  return Math.round((filled / fields.length) * 100);
}

function mergePreferences(
  base: ProfilePreferences,
  patch?: Partial<ProfilePreferences>,
): ProfilePreferences {
  return {
    ...base,
    ...patch,
  };
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setProfile: (profile) => {
        const nextProfile = profile
          ? {
              ...profile,
              fullName: profile.fullName ?? profile.displayName ?? '',
              username: profile.username ?? '',
              bio: profile.bio ?? '',
              avatarUrl: profile.avatarUrl ?? profile.photoURL ?? '',
              location: profile.location ?? '',
              institution: profile.institution ?? '',
              educationLevel: profile.educationLevel ?? '',
              className: profile.className ?? '',
              batch: profile.batch ?? '',
              subject: profile.subject ?? '',
              language: profile.language ?? 'bn',
            }
          : null;

        set({
          profile: nextProfile,
          completion: calculateCompletion(nextProfile),
          preferences: mergePreferences(
            DEFAULT_PREFERENCES,
            nextProfile?.preferences as Partial<ProfilePreferences> | undefined,
          ),
        });
      },

      patchProfile: (patch) => {
        set((state) => {
          const nextProfile = {
            ...(state.profile ?? {}),
            ...patch,
          } as ProfileStateData;

          const nextPreferences = patch.preferences
            ? mergePreferences(state.preferences, patch.preferences)
            : state.preferences;

          return {
            profile: nextProfile,
            completion: calculateCompletion(nextProfile),
            preferences: nextPreferences,
          };
        });
      },

      clearProfile: () => {
        set({
          profile: null,
          completion: 0,
          preferences: DEFAULT_PREFERENCES,
          error: null,
          loading: false,
          saving: false,
          initialized: true,
        });
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setSaving: (saving) => {
        set({ saving });
      },

      setError: (error) => {
        set({ error });
      },

      setInitialized: (initialized) => {
        set({ initialized });
      },

      setCompletion: (completion) => {
        set({ completion: Math.max(0, Math.min(100, completion)) });
      },

      recalculateCompletion: () => {
        const completion = calculateCompletion(get().profile);
        set({ completion });
        return completion;
      },

      setPreferences: (preferences) => {
        set({
          preferences: mergePreferences(DEFAULT_PREFERENCES, preferences),
        });
      },

      patchPreferences: (patch) => {
        set((state) => ({
          preferences: mergePreferences(state.preferences, patch),
        }));
      },

      isComplete: () => {
        return get().completion >= 70;
      },

      hasAvatar: () => {
        const profile = get().profile;
        return Boolean(normalizeString(profile?.avatarUrl ?? profile?.photoURL).length);
      },

      hasBio: () => {
        return Boolean(normalizeString(get().profile?.bio).length);
      },

      hasEducationInfo: () => {
        const profile = get().profile;
        return Boolean(
          normalizeString(profile?.institution).length ||
            normalizeString(profile?.educationLevel).length ||
            normalizeString(profile?.className).length ||
            normalizeString(profile?.batch).length,
        );
      },
    }),
    {
      name: 'bep-profile-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profile: state.profile,
        completion: state.completion,
        preferences: state.preferences,
      }),
    },
  ),
);

/* -------------------------------------------------------------------------- */
/*                               Helper Selectors                             */
/* -------------------------------------------------------------------------- */

export const profileSelectors = {
  profile: (state: ProfileState) => state.profile,
  loading: (state: ProfileState) => state.loading,
  saving: (state: ProfileState) => state.saving,
  error: (state: ProfileState) => state.error,
  initialized: (state: ProfileState) => state.initialized,
  completion: (state: ProfileState) => state.completion,
  preferences: (state: ProfileState) => state.preferences,
  isComplete: (state: ProfileState) => state.completion >= 70,
  hasAvatar: (state: ProfileState) =>
    Boolean(normalizeString(state.profile?.avatarUrl ?? state.profile?.photoURL).length),
  hasBio: (state: ProfileState) => Boolean(normalizeString(state.profile?.bio).length),
  hasEducationInfo: (state: ProfileState) =>
    Boolean(
      normalizeString(state.profile?.institution).length ||
        normalizeString(state.profile?.educationLevel).length ||
        normalizeString(state.profile?.className).length ||
        normalizeString(state.profile?.batch).length,
    ),
};
