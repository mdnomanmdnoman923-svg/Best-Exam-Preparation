import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { User } from 'firebase/auth';
import type { AuthProfile } from '@/services/auth.service';

interface AuthState {
  user: User | null;
  profile: AuthProfile | null;

  loading: boolean;
  initialized: boolean;

  accessToken: string | null;

  setUser: (user: User | null) => void;
  setProfile: (profile: AuthProfile | null) => void;

  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;

  setAccessToken: (token: string | null) => void;

  clearAuth: () => void;

  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

const initialState = {
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  accessToken: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => {
        set({ user });
      },

      setProfile: (profile) => {
        set({ profile });
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setInitialized: (initialized) => {
        set({ initialized });
      },

      setAccessToken: (token) => {
        set({ accessToken: token });
      },

      clearAuth: () => {
        set({
          ...initialState,
          loading: false,
          initialized: true,
        });
      },

      isAuthenticated: () => Boolean(get().user),

      isAdmin: () => {
        const role = get().profile?.role;
        return role === 'admin' || role === 'super_admin';
      },
    }),
    {
      name: 'bep-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profile: state.profile,
        accessToken: state.accessToken,
      }),
    },
  ),
);

export const authSelectors = {
  user: (state: AuthState) => state.user,
  profile: (state: AuthState) => state.profile,
  loading: (state: AuthState) => state.loading,
  initialized: (state: AuthState) => state.initialized,
  accessToken: (state: AuthState) => state.accessToken,
  isAuthenticated: (state: AuthState) => Boolean(state.user),
  isAdmin: (state: AuthState) =>
    state.profile?.role === 'admin' || state.profile?.role === 'super_admin',
};
