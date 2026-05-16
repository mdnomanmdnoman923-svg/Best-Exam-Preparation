// src/features/auth/components/AuthStateListener.tsx

import { useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { auth, db } from '@/firebase/config';
import { collectionNames } from '@/firebase/collections';
import { useAuthStore } from '@/store/auth.store';

type ProfileDocument = {
  id?: string;
  uid: string;
  name?: string;
  email?: string;
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
};

function buildFallbackProfile(user: FirebaseUser): ProfileDocument {
  return {
    uid: user.uid,
    name: user.displayName || 'BEP User',
    email: user.email || '',
    photoURL: user.photoURL,
    role: 'student',
    premium: false,
    premiumExpiresAt: null,
    institution: '',
    phone: '',
    bio: '',
  };
}

async function ensureUserProfile(user: FirebaseUser): Promise<ProfileDocument> {
  const profileRef = doc(db, collectionNames.users, user.uid);
  const snap = await getDoc(profileRef);

  if (!snap.exists()) {
    const profile = buildFallbackProfile(user);

    await setDoc(profileRef, {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });

    return profile;
  }

  const data = snap.data() as Omit<ProfileDocument, 'id'>;

  const mergedProfile: ProfileDocument = {
    id: snap.id,
    uid: user.uid,
    name: data.name || user.displayName || 'BEP User',
    email: data.email || user.email || '',
    photoURL: data.photoURL ?? user.photoURL,
    role: data.role || 'student',
    premium: Boolean(data.premium),
    premiumExpiresAt: data.premiumExpiresAt ?? null,
    institution: data.institution || '',
    phone: data.phone || '',
    bio: data.bio || '',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    lastLoginAt: serverTimestamp(),
  };

  await setDoc(
    profileRef,
    {
      ...mergedProfile,
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    },
    { merge: true },
  );

  return mergedProfile;
}

export default function AuthStateListener() {
  const setUser = useAuthStore((state) => state.setUser);
  const setProfile = useAuthStore((state) => state.setProfile);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setError = useAuthStore((state) => state.setError);
  const resetAuth = useAuthStore((state) => state.resetAuth);
  const initialized = useAuthStore((state) => state.initialized);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);
        setError(null);

        if (!firebaseUser) {
          resetAuth();
          setLoading(false);
          setAuthenticated(false);
          setInitialized(true);
          return;
        }

        const profile = await ensureUserProfile(firebaseUser);

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
          phone: profile.phone || '',
          bio: profile.bio || '',
          lastLoginAt: new Date().toISOString(),
        };

        setUser(authUser);
        setProfile(profile);
        setAuthenticated(true);
        setInitialized(true);
      } catch (error) {
        console.error('Auth state listener error:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'Authentication sync failed',
        );
        setAuthenticated(false);
        setInitialized(true);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [
    resetAuth,
    setAuthenticated,
    setError,
    setInitialized,
    setLoading,
    setProfile,
    setUser,
  ]);

  if (!initialized) return null;
  return null;
}
