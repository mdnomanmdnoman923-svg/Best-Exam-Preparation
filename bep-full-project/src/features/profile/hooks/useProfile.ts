// bep-full-project/src/features/profile/hooks/useProfile.ts

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { updateProfile as updateFirebaseAuthProfile } from 'firebase/auth';

import { auth, db } from '@/firebase/config';
import { collectionNames } from '@/firebase/collections';

export type ProfileRole =
  | 'student'
  | 'moderator'
  | 'admin';

export interface ProfileDocument {
  id?: string;
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;
  role?: ProfileRole;
  premium?: boolean;
  premiumExpiresAt?: string | null;
  institution?: string;
  phone?: string;
  bio?: string;
  batchId?: string;
  batchName?: string;
  classId?: string;
  className?: string;
  educationLevelId?: string;
  educationLevelName?: string;
  location?: string;
  gender?: string;
  dateOfBirth?: string;
  language?: 'bn' | 'en';
  avatar?: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
  lastLoginAt?: unknown;
}

export interface ProfileCompletionField {
  id: string;
  label: string;
  value?: string | null;
  required?: boolean;
  completed?: boolean;
}

export interface UseProfileOptions {
  userId?: string;
  autoLoad?: boolean;
  includeAuthUser?: boolean;
  onError?: (error: Error) => void;
}

export interface UseProfileReturn {
  profile: ProfileDocument | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  completion: number;
  completionCount: number;
  totalFields: number;
  fields: ProfileCompletionField[];
  refreshProfile: () => Promise<ProfileDocument | null>;
  updateProfile: (
    data: Partial<ProfileDocument>,
  ) => Promise<ProfileDocument>;
  patchProfile: (
    data: Partial<ProfileDocument>,
  ) => Promise<ProfileDocument>;
  clearError: () => void;
  resetProfileCache: () => void;
}

const FALLBACK_USER_COLLECTION = 'users';

function getUserCollectionName() {
  const names = (collectionNames ?? {}) as Record<string, string>;
  return (
    names.users ||
    names.userProfiles ||
    FALLBACK_USER_COLLECTION
  );
}

function toStringValue(value: unknown) {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  return String(value);
}

function asNullableString(value: unknown) {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  return null;
}

function normalizeProfile(
  data: Partial<ProfileDocument>,
  uid: string,
  fallbackEmail = '',
): ProfileDocument {
  return {
    id: data.id,
    uid,
    name: data.name?.trim() || 'BEP User',
    email: data.email?.trim() || fallbackEmail || '',
    photoURL: data.photoURL ?? data.avatar ?? null,
    role: data.role || 'student',
    premium: Boolean(data.premium),
    premiumExpiresAt: data.premiumExpiresAt ?? null,
    institution: data.institution || '',
    phone: data.phone || '',
    bio: data.bio || '',
    batchId: data.batchId || '',
    batchName: data.batchName || '',
    classId: data.classId || '',
    className: data.className || '',
    educationLevelId: data.educationLevelId || '',
    educationLevelName: data.educationLevelName || '',
    location: data.location || '',
    gender: data.gender || '',
    dateOfBirth: data.dateOfBirth || '',
    language: data.language || 'bn',
    avatar: data.avatar ?? data.photoURL ?? null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    lastLoginAt: data.lastLoginAt,
  };
}

function buildCompletionFields(profile: ProfileDocument): ProfileCompletionField[] {
  return [
    {
      id: 'name',
      label: 'Full name',
      value: profile.name,
      required: true,
      completed: profile.name.trim().length > 0,
    },
    {
      id: 'email',
      label: 'Email',
      value: profile.email,
      required: true,
      completed: profile.email.trim().length > 0,
    },
    {
      id: 'phone',
      label: 'Phone',
      value: profile.phone,
      completed: profile.phone.trim().length > 0,
    },
    {
      id: 'institution',
      label: 'Institution',
      value: profile.institution,
      completed: profile.institution.trim().length > 0,
    },
    {
      id: 'batch',
      label: 'Batch',
      value: profile.batchName || profile.batchId,
      completed: Boolean(profile.batchName?.trim() || profile.batchId?.trim()),
    },
    {
      id: 'class',
      label: 'Class',
      value: profile.className || profile.classId,
      completed: Boolean(profile.className?.trim() || profile.classId?.trim()),
    },
    {
      id: 'educationLevel',
      label: 'Education level',
      value: profile.educationLevelName || profile.educationLevelId,
      completed: Boolean(
        profile.educationLevelName?.trim() || profile.educationLevelId?.trim(),
      ),
    },
    {
      id: 'location',
      label: 'Location',
      value: profile.location,
      completed: profile.location.trim().length > 0,
    },
    {
      id: 'bio',
      label: 'Bio',
      value: profile.bio,
      completed: profile.bio.trim().length > 0,
    },
  ];
}

export function useProfile(options: UseProfileOptions = {}): UseProfileReturn {
  const {
    userId: providedUserId,
    autoLoad = true,
    includeAuthUser = true,
    onError,
  } = options;

  const [profile, setProfile] = useState<ProfileDocument | null>(null);
  const [loading, setLoading] = useState(Boolean(autoLoad));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const didLoadRef = useRef(false);
  const userCollectionName = getUserCollectionName();

  const resolvedUserId =
    providedUserId || auth.currentUser?.uid || null;

  const refreshProfile = useCallback(async (): Promise<ProfileDocument | null> => {
    const uid = providedUserId || auth.currentUser?.uid || null;

    if (!uid) {
      setProfile(null);
      setLoading(false);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const profileRef = doc(db, userCollectionName, uid);
      const snapshot = await getDoc(profileRef);

      let nextProfile: ProfileDocument;

      if (!snapshot.exists()) {
        const currentUser = auth.currentUser;
        const fallbackEmail =
          currentUser?.email || '';

        nextProfile = normalizeProfile(
          {
            uid,
            name: currentUser?.displayName || 'BEP User',
            email: fallbackEmail,
            photoURL: currentUser?.photoURL ?? null,
            role: 'student',
            premium: false,
            premiumExpiresAt: null,
            institution: '',
            phone: currentUser?.phoneNumber || '',
            bio: '',
            batchId: '',
            batchName: '',
            classId: '',
            className: '',
            educationLevelId: '',
            educationLevelName: '',
            location: '',
            gender: '',
            dateOfBirth: '',
            language: 'bn',
            avatar: currentUser?.photoURL ?? null,
          },
          uid,
          fallbackEmail,
        );

        await setDoc(profileRef, {
          ...nextProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
      } else {
        const data = snapshot.data() as Partial<ProfileDocument>;
        const currentUser = auth.currentUser;
        const fallbackEmail =
          currentUser?.email || data.email || '';

        nextProfile = normalizeProfile(
          {
            ...data,
            id: snapshot.id,
          },
          uid,
          fallbackEmail,
        );

        await updateDoc(profileRef, {
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setProfile(nextProfile);
      didLoadRef.current = true;

      if (
        includeAuthUser &&
        auth.currentUser &&
        nextProfile.name &&
        nextProfile.name !== auth.currentUser.displayName
      ) {
        await updateFirebaseAuthProfile(auth.currentUser, {
          displayName: nextProfile.name,
          photoURL: nextProfile.photoURL ?? undefined,
        });
      }

      return nextProfile;
    } catch (err) {
      const nextError =
        err instanceof Error
          ? err
          : new Error('Failed to load profile');

      setError(nextError.message);
      onError?.(nextError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [includeAuthUser, onError, providedUserId, userCollectionName]);

  const saveProfile = useCallback(
    async (
      data: Partial<ProfileDocument>,
      mergeMode: 'merge' | 'replace' = 'merge',
    ): Promise<ProfileDocument> => {
      const uid = providedUserId || auth.currentUser?.uid || null;

      if (!uid) {
        throw new Error('No authenticated user found');
      }

      setSaving(true);
      setError(null);

      try {
        const profileRef = doc(db, userCollectionName, uid);
        const current = profile || (await refreshProfile());
        const nextProfile = normalizeProfile(
          {
            ...(mergeMode === 'merge' ? current || {} : {}),
            ...data,
            uid,
          },
          uid,
          auth.currentUser?.email || current?.email || '',
        );

        await setDoc(
          profileRef,
          {
            ...nextProfile,
            updatedAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          },
          { merge: true },
        );

        setProfile(nextProfile);

        if (
          includeAuthUser &&
          auth.currentUser &&
          (toStringValue(data.name) ||
            asNullableString(data.photoURL) ||
            asNullableString(data.avatar))
        ) {
          await updateFirebaseAuthProfile(auth.currentUser, {
            displayName:
              data.name?.trim() || nextProfile.name,
            photoURL:
              data.photoURL ??
              data.avatar ??
              nextProfile.photoURL ??
              undefined,
          });
        }

        return nextProfile;
      } catch (err) {
        const nextError =
          err instanceof Error
            ? err
            : new Error('Failed to save profile');

        setError(nextError.message);
        onError?.(nextError);
        throw nextError;
      } finally {
        setSaving(false);
      }
    },
    [includeAuthUser, onError, profile, providedUserId, refreshProfile, userCollectionName],
  );

  const updateProfileData = useCallback(
    async (data: Partial<ProfileDocument>) => saveProfile(data, 'replace'),
    [saveProfile],
  );

  const patchProfile = useCallback(
    async (data: Partial<ProfileDocument>) => saveProfile(data, 'merge'),
    [saveProfile],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetProfileCache = useCallback(() => {
    setProfile(null);
    setError(null);
    didLoadRef.current = false;
  }, []);

  useEffect(() => {
    if (!autoLoad) return;
    if (didLoadRef.current && resolvedUserId === profile?.uid) return;

    void refreshProfile();
  }, [autoLoad, profile?.uid, refreshProfile, resolvedUserId]);

  const fields = useMemo(() => {
    if (!profile) return [];
    return buildCompletionFields(profile);
  }, [profile]);

  const completionCount = useMemo(() => {
    return fields.filter((item) => item.completed).length;
  }, [fields]);

  const totalFields = fields.length;

  const completion = useMemo(() => {
    if (totalFields === 0) return 0;
    return Math.round((completionCount / totalFields) * 100);
  }, [completionCount, totalFields]);

  return {
    profile,
    loading,
    saving,
    error,
    completion,
    completionCount,
    totalFields,
    fields,
    refreshProfile,
    updateProfile: updateProfileData,
    patchProfile,
    clearError,
    resetProfileCache,
  };
}

export default useProfile;
