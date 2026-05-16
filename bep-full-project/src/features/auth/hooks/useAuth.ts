// src/features/auth/hooks/useAuth.ts

import { useCallback, useMemo, useState } from 'react';
import {
  GoogleAuthProvider,
  User,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  updateProfile,
  ConfirmationResult,
  RecaptchaVerifier,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { auth, db } from '@/firebase/config';
import { collectionNames } from '@/firebase/collections';
import { useAuthStore } from '@/store/auth.store';

export type AuthMode = 'login' | 'register';

export interface AuthProfile {
  id?: string;
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;
  role?: 'student' | 'moderator' | 'admin';
  premium?: boolean;
  premiumExpiresAt?: string | null;
  institution?: string;
  phone?: string;
  bio?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  lastLoginAt?: unknown;
}

export interface EmailAuthPayload {
  email: string;
  password: string;
  name?: string;
  rememberMe?: boolean;
}

export interface UseAuthReturn {
  user: ReturnType<typeof useAuthStore>['user'];
  profile: ReturnType<typeof useAuthStore>['profile'];
  loading: boolean;
  initialized: boolean;
  authenticated: boolean;
  error: string | null;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  signInWithEmail: (payload: EmailAuthPayload) => Promise<void>;
  signUpWithEmail: (payload: EmailAuthPayload) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendPhoneOtp: (phoneNumber: string, containerId?: string) => Promise<void>;
  verifyPhoneOtp: (otp: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshProfile: () => Promise<AuthProfile | null>;
  recaptchaReady: boolean;
  phoneVerificationPending: boolean;
}

type AuthStoreShape = {
  user: ReturnType<typeof useAuthStore>['user'];
  profile: ReturnType<typeof useAuthStore>['profile'];
  loading: boolean;
  initialized: boolean;
  authenticated: boolean;
  error: string | null;
  setUser: (user: any) => void;
  setProfile: (profile: any) => void;
  setLoading: (value: boolean) => void;
  setAuthenticated: (value: boolean) => void;
  setError: (value: string | null) => void;
  resetAuth: () => void;
};

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

async function ensureProfile(user: User, name?: string): Promise<AuthProfile> {
  const profileRef = doc(db, collectionNames.users, user.uid);
  const snap = await getDoc(profileRef);

  if (!snap.exists()) {
    const profile: AuthProfile = {
      uid: user.uid,
      name: name || user.displayName || 'BEP User',
      email: user.email || '',
      photoURL: user.photoURL,
      role: 'student',
      premium: false,
      premiumExpiresAt: null,
      institution: '',
      phone: user.phoneNumber || '',
      bio: '',
    };

    await setDoc(profileRef, {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });

    return profile;
  }

  const data = snap.data() as Partial<AuthProfile>;
  const merged: AuthProfile = {
    id: snap.id,
    uid: user.uid,
    name: data.name || name || user.displayName || 'BEP User',
    email: data.email || user.email || '',
    photoURL: data.photoURL ?? user.photoURL ?? null,
    role: data.role || 'student',
    premium: Boolean(data.premium),
    premiumExpiresAt: data.premiumExpiresAt ?? null,
    institution: data.institution || '',
    phone: data.phone || user.phoneNumber || '',
    bio: data.bio || '',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    lastLoginAt: serverTimestamp(),
  };

  await setDoc(
    profileRef,
    {
      ...merged,
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    },
    { merge: true },
  );

  return merged;
}

function getRecaptcha(containerId = 'recaptcha-container') {
  const verifier = window.recaptchaVerifier;
  if (verifier) return verifier;

  const el = document.getElementById(containerId);
  if (!el) {
    throw new Error(
      `reCAPTCHA container not found. Add a div with id="${containerId}".`,
    );
  }

  const newVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => undefined,
  });

  window.recaptchaVerifier = newVerifier;
  return newVerifier;
}

export function useAuth(): UseAuthReturn {
  const store = useAuthStore() as unknown as AuthStoreShape;
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [phoneVerificationPending, setPhoneVerificationPending] = useState(false);

  const syncAuthUser = useCallback(
    async (firebaseUser: User, displayName?: string) => {
      const profile = await ensureProfile(firebaseUser, displayName);

      const authUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: profile.name || firebaseUser.displayName || 'BEP User',
        photoURL: profile.photoURL ?? firebaseUser.photoURL ?? null,
        emailVerified: firebaseUser.emailVerified,
        role: profile.role || 'student',
        premium: Boolean(profile.premium),
        premiumExpiresAt: profile.premiumExpiresAt ?? null,
        institution: profile.institution || '',
        phone: profile.phone || firebaseUser.phoneNumber || '',
        bio: profile.bio || '',
        lastLoginAt: new Date().toISOString(),
      };

      store.setUser(authUser);
      store.setProfile(profile);
      store.setAuthenticated(true);
      store.setError(null);

      return profile;
    },
    [store],
  );

  const signInWithEmail = useCallback(
    async ({ email, password, rememberMe }: EmailAuthPayload) => {
      try {
        store.setLoading(true);
        store.setError(null);

        if (rememberMe) {
          await setPersistence(auth, browserLocalPersistence);
        }

        const result = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );

        await syncAuthUser(result.user);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Login failed';
        store.setError(message);
        throw error;
      } finally {
        store.setLoading(false);
      }
    },
    [store, syncAuthUser],
  );

  const signUpWithEmail = useCallback(
    async ({ email, password, name, rememberMe }: EmailAuthPayload) => {
      try {
        store.setLoading(true);
        store.setError(null);

        if (rememberMe) {
          await setPersistence(auth, browserLocalPersistence);
        }

        const result = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );

        if (name) {
          await updateProfile(result.user, { displayName: name });
        }

        await ensureProfile(result.user, name);
        await syncAuthUser(result.user, name);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Registration failed';
        store.setError(message);
        throw error;
      } finally {
        store.setLoading(false);
      }
    },
    [store, syncAuthUser],
  );

  const signInWithGoogle = useCallback(async () => {
    try {
      store.setLoading(true);
      store.setError(null);

      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      await syncAuthUser(result.user);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Google sign-in failed';
      store.setError(message);
      throw error;
    } finally {
      store.setLoading(false);
    }
  }, [store, syncAuthUser]);

  const sendPhoneOtp = useCallback(
    async (phoneNumber: string, containerId = 'recaptcha-container') => {
      try {
        store.setLoading(true);
        store.setError(null);

        const verifier = getRecaptcha(containerId);
        const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);

        window.confirmationResult = confirmation;
        setPhoneVerificationPending(true);
        setRecaptchaReady(true);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'OTP send failed';
        store.setError(message);
        throw error;
      } finally {
        store.setLoading(false);
      }
    },
    [store],
  );

  const verifyPhoneOtp = useCallback(
    async (otp: string) => {
      try {
        store.setLoading(true);
        store.setError(null);

        const confirmation = window.confirmationResult;
        if (!confirmation) {
          throw new Error('OTP verification session not found');
        }

        const credential = await confirmation.confirm(otp);
        await syncAuthUser(
          credential.user,
          credential.user.displayName || undefined,
        );
        setPhoneVerificationPending(false);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'OTP verification failed';
        store.setError(message);
        throw error;
      } finally {
        store.setLoading(false);
      }
    },
    [store, syncAuthUser],
  );

  const resetPassword = useCallback(
    async (email: string) => {
      try {
        store.setLoading(true);
        store.setError(null);
        await sendPasswordResetEmail(auth, email.trim());
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Password reset failed';
        store.setError(message);
        throw error;
      } finally {
        store.setLoading(false);
      }
    },
    [store],
  );

  const logout = useCallback(async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      await signOut(auth);
      store.resetAuth();
      store.setAuthenticated(false);
      setPhoneVerificationPending(false);
      window.confirmationResult = undefined;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Logout failed';
      store.setError(message);
      throw error;
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  const clearError = useCallback(() => {
    store.setError(null);
  }, [store]);

  const refreshProfile = useCallback(async (): Promise<AuthProfile | null> => {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    const profile = await ensureProfile(currentUser);
    store.setProfile(profile);
    return profile;
  }, [store]);

  return {
    user: store.user,
    profile: store.profile,
    loading: store.loading,
    initialized: store.initialized,
    authenticated: store.authenticated,
    error: store.error,
    authMode,
    setAuthMode,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    sendPhoneOtp,
    verifyPhoneOtp,
    resetPassword,
    logout,
    clearError,
    refreshProfile,
    recaptchaReady,
    phoneVerificationPending,
  };
}

export default useAuth;
