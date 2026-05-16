// bep-full-project/src/features/profile/services/profile.service.ts

import {
  User,
  updateProfile as updateFirebaseAuthProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { auth, db } from '@/firebase/config';
import { collectionNames } from '@/firebase/collections';

export type ProfileRole = 'student' | 'moderator' | 'admin';

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

export interface SaveProfileOptions {
  merge?: boolean;
  syncAuthProfile?: boolean;
}

export interface CompletionField {
  id: string;
  label: string;
  value?: string | null;
  required?: boolean;
  completed?: boolean;
}

export interface ProfileCompletionSummary {
  completion: number;
  completionCount: number;
  totalFields: number;
  fields: CompletionField[];
}

const FALLBACK_COLLECTION = 'users';

function getUserCollectionName(): string {
  const names = (collectionNames ?? {}) as Record<string, string>;
  return names.users || names.userProfiles || FALLBACK_COLLECTION;
}

function asString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (value == null) return fallback;
  return String(value);
}

function asNullableString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
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

function buildCompletionFields(profile: ProfileDocument): CompletionField[] {
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

class ProfileService {
  private getProfileRef(uid: string) {
    return doc(db, getUserCollectionName(), uid);
  }

  private getCurrentUid(): string | null {
    return auth.currentUser?.uid ?? null;
  }

  async getProfile(
    uid: string = this.getCurrentUid() || '',
  ): Promise<ProfileDocument | null> {
    if (!uid) return null;

    const snapshot = await getDoc(this.getProfileRef(uid));

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data() as Partial<ProfileDocument>;

    return normalizeProfile(
      {
        ...data,
        id: snapshot.id,
      },
      uid,
      data.email || auth.currentUser?.email || '',
    );
  }

  async createDefaultProfile(
    user: User,
    extra: Partial<ProfileDocument> = {},
  ): Promise<ProfileDocument> {
    const profileRef = this.getProfileRef(user.uid);

    const profile = normalizeProfile(
      {
        uid: user.uid,
        name: extra.name || user.displayName || 'BEP User',
        email: extra.email || user.email || '',
        photoURL: extra.photoURL ?? user.photoURL ?? null,
        role: extra.role || 'student',
        premium: Boolean(extra.premium),
        premiumExpiresAt: extra.premiumExpiresAt ?? null,
        institution: extra.institution || '',
        phone: extra.phone || user.phoneNumber || '',
        bio: extra.bio || '',
        batchId: extra.batchId || '',
        batchName: extra.batchName || '',
        classId: extra.classId || '',
        className: extra.className || '',
        educationLevelId: extra.educationLevelId || '',
        educationLevelName: extra.educationLevelName || '',
        location: extra.location || '',
        gender: extra.gender || '',
        dateOfBirth: extra.dateOfBirth || '',
        language: extra.language || 'bn',
        avatar: extra.avatar ?? user.photoURL ?? null,
      },
      user.uid,
      user.email || extra.email || '',
    );

    await setDoc(profileRef, {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });

    return profile;
  }

  async ensureProfile(
    user: User,
    extra: Partial<ProfileDocument> = {},
  ): Promise<ProfileDocument> {
    const existing = await this.getProfile(user.uid);

    if (!existing) {
      return this.createDefaultProfile(user, extra);
    }

    const merged: ProfileDocument = normalizeProfile(
      {
        ...existing,
        ...extra,
        uid: user.uid,
        email: extra.email || existing.email || user.email || '',
        photoURL: extra.photoURL ?? extra.avatar ?? existing.photoURL ?? user.photoURL ?? null,
      },
      user.uid,
      user.email || existing.email || '',
    );

    await setDoc(
      this.getProfileRef(user.uid),
      {
        ...merged,
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      },
      { merge: true },
    );

    return merged;
  }

  async saveProfile(
    uid: string,
    data: Partial<ProfileDocument>,
    options: SaveProfileOptions = {},
  ): Promise<ProfileDocument> {
    if (!uid) {
      throw new Error('uid is required');
    }

    const { merge = true, syncAuthProfile = true } = options;
    const profileRef = this.getProfileRef(uid);
    const current = (await this.getProfile(uid)) ?? normalizeProfile({ uid }, uid);

    const nextProfile = normalizeProfile(
      {
        ...(merge ? current : { uid }),
        ...data,
        uid,
        email: data.email || current.email || auth.currentUser?.email || '',
        photoURL:
          data.photoURL ??
          data.avatar ??
          current.photoURL ??
          auth.currentUser?.photoURL ??
          null,
      },
      uid,
      auth.currentUser?.email || current.email || '',
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

    if (
      syncAuthProfile &&
      auth.currentUser &&
      auth.currentUser.uid === uid &&
      (data.name || data.photoURL || data.avatar)
    ) {
      await updateFirebaseAuthProfile(auth.currentUser, {
        displayName: data.name?.trim() || nextProfile.name,
        photoURL:
          data.photoURL ??
          data.avatar ??
          nextProfile.photoURL ??
          undefined,
      });
    }

    return nextProfile;
  }

  async patchProfile(
    uid: string,
    data: Partial<ProfileDocument>,
  ): Promise<ProfileDocument> {
    return this.saveProfile(uid, data, { merge: true, syncAuthProfile: true });
  }

  async updateFields(
    uid: string,
    data: Partial<ProfileDocument>,
  ): Promise<void> {
    if (!uid) {
      throw new Error('uid is required');
    }

    await updateDoc(this.getProfileRef(uid), {
      ...data,
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
  }

  async updateDisplayName(
    uid: string,
    name: string,
  ): Promise<ProfileDocument> {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('name is required');
    }

    const profile = await this.patchProfile(uid, { name: trimmedName });

    if (auth.currentUser?.uid === uid) {
      await updateFirebaseAuthProfile(auth.currentUser, {
        displayName: trimmedName,
        photoURL: profile.photoURL ?? undefined,
      });
    }

    return profile;
  }

  async updateAvatar(
    uid: string,
    avatarUrl: string,
  ): Promise<ProfileDocument> {
    const url = avatarUrl.trim();
    if (!url) {
      throw new Error('avatarUrl is required');
    }

    const profile = await this.patchProfile(uid, {
      avatar: url,
      photoURL: url,
    });

    if (auth.currentUser?.uid === uid) {
      await updateFirebaseAuthProfile(auth.currentUser, {
        photoURL: url,
        displayName: profile.name,
      });
    }

    return profile;
  }

  async setPremium(
    uid: string,
    premium: boolean,
    premiumExpiresAt: string | null = null,
  ): Promise<ProfileDocument> {
    return this.patchProfile(uid, {
      premium,
      premiumExpiresAt,
    });
  }

  async setRole(
    uid: string,
    role: ProfileRole,
  ): Promise<ProfileDocument> {
    return this.patchProfile(uid, { role });
  }

  async setClassInfo(
    uid: string,
    data: {
      classId?: string;
      className?: string;
      batchId?: string;
      batchName?: string;
      educationLevelId?: string;
      educationLevelName?: string;
    },
  ): Promise<ProfileDocument> {
    return this.patchProfile(uid, data);
  }

  async setContactInfo(
    uid: string,
    data: {
      phone?: string;
      institution?: string;
      location?: string;
      gender?: string;
      dateOfBirth?: string;
      bio?: string;
    },
  ): Promise<ProfileDocument> {
    return this.patchProfile(uid, data);
  }

  getCompletionSummary(
    profile: ProfileDocument | null,
  ): ProfileCompletionSummary {
    if (!profile) {
      return {
        completion: 0,
        completionCount: 0,
        totalFields: 0,
        fields: [],
      };
    }

    const fields = buildCompletionFields(profile);
    const completionCount = fields.filter((item) => item.completed).length;
    const totalFields = fields.length;

    return {
      completion: totalFields > 0 ? Math.round((completionCount / totalFields) * 100) : 0,
      completionCount,
      totalFields,
      fields,
    };
  }

  async refreshCurrentProfile(): Promise<ProfileDocument | null> {
    const uid = this.getCurrentUid();
    if (!uid) return null;
    return this.getProfile(uid);
  }

  async deleteProfile(uid: string): Promise<void> {
    if (!uid) {
      throw new Error('uid is required');
    }

    await setDoc(this.getProfileRef(uid), {
      deleted: true,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  sanitizeProfileInput(data: Partial<ProfileDocument>): Partial<ProfileDocument> {
    return {
      ...data,
      name: data.name?.trim(),
      email: data.email?.trim(),
      photoURL: asNullableString(data.photoURL),
      avatar: asNullableString(data.avatar),
      institution: asString(data.institution).trim(),
      phone: asString(data.phone).trim(),
      bio: asString(data.bio).trim(),
      batchId: asString(data.batchId).trim(),
      batchName: asString(data.batchName).trim(),
      classId: asString(data.classId).trim(),
      className: asString(data.className).trim(),
      educationLevelId: asString(data.educationLevelId).trim(),
      educationLevelName: asString(data.educationLevelName).trim(),
      location: asString(data.location).trim(),
      gender: asString(data.gender).trim(),
      dateOfBirth: asString(data.dateOfBirth).trim(),
    };
  }
}

export const profileService = new ProfileService();

export {
  buildCompletionFields,
  normalizeProfile,
  getUserCollectionName,
};

export default profileService;
