// bep-full-project/src/features/auth/services/auth.service.ts

import {
  GoogleAuthProvider,
  User,
  browserLocalPersistence,
  browserSessionPersistence,
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

export type AuthMode = 'login' | 'register';

export type AuthRole = 'student' | 'moderator' | 'admin';

export interface AuthProfile {
  id?: string;
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;
  role?: AuthRole;
  premium?: boolean;
  premiumExpiresAt?: string | null;
  institution?: string;
  phone?: string;
  bio?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  lastLoginAt?: unknown;
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  emailVerified: boolean;
  role: AuthRole;
  premium: boolean;
  premiumExpiresAt?: string | null;
  institution?: string;
  phone?: string;
  bio?: string;
  lastLoginAt?: string;
}

export interface EmailAuthPayload {
  email: string;
  password: string;
  name?: string;
  rememberMe?: boolean;
}

export interface PhoneOtpPayload {
  phoneNumber: string;
  containerId?: string;
}

export interface AuthSignInResult {
  user: AuthUser;
  profile: AuthProfile;
}

export interface AuthServiceOptions {
  rememberMe?: boolean;
  containerId?: string;
}

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

function cleanPhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/[^\d+]/g, '').trim();
}

function normalizePhoneNumber(
  phoneNumber: string,
  countryCode = '+880',
): string {
  const cleaned = cleanPhoneNumber(phoneNumber);

  if (cleaned.startsWith('+')) return cleaned;

  const withoutLeadingZeros = cleaned.replace(/^0+/, '');
  return `${countryCode}${withoutLeadingZeros}`;
}

function getRecaptchaVerifier(containerId = 'recaptcha-container') {
  const existing = window.recaptchaVerifier;
  if (existing) return existing;

  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(
      `reCAPTCHA container not found. Add a div with id="${containerId}".`,
    );
  }

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => undefined,
  });

  window.recaptchaVerifier = verifier;
  return verifier;
}

function mapAuthUser(user: User, profile: AuthProfile): AuthUser {
  return {
    uid: user.uid,
    email: user.email || profile.email || '',
    displayName: profile.name || user.displayName || 'BEP User',
    photoURL: profile.photoURL ?? user.photoURL ?? null,
    emailVerified: user.emailVerified,
    role: profile.role || 'student',
    premium: Boolean(profile.premium),
    premiumExpiresAt: profile.premiumExpiresAt ?? null,
    institution: profile.institution || '',
    phone: profile.phone || user.phoneNumber || '',
    bio: profile.bio || '',
    lastLoginAt: new Date().toISOString(),
  };
}

async function ensureUserProfile(
  user: User,
  name?: string,
): Promise<AuthProfile> {
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

class AuthService {
  async setRememberMe(rememberMe = false): Promise<void> {
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence,
    );
  }

  async signInWithEmail({
    email,
    password,
    rememberMe = false,
  }: EmailAuthPayload): Promise<AuthSignInResult> {
    await this.setRememberMe(rememberMe);

    const result = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    );

    const profile = await ensureUserProfile(result.user);

    return {
      user: mapAuthUser(result.user, profile),
      profile,
    };
  }

  async signUpWithEmail({
    email,
    password,
    name,
    rememberMe = false,
  }: EmailAuthPayload): Promise<AuthSignInResult> {
    await this.setRememberMe(rememberMe);

    const result = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    );

    if (name) {
      await updateProfile(result.user, { displayName: name });
    }

    const profile = await ensureUserProfile(result.user, name);

    return {
      user: mapAuthUser(result.user, profile),
      profile,
    };
  }

  async signInWithGoogle(
    rememberMe = true,
  ): Promise<AuthSignInResult> {
    await this.setRememberMe(rememberMe);

    const result = await signInWithPopup(auth, googleProvider);
    const profile = await ensureUserProfile(result.user);

    return {
      user: mapAuthUser(result.user, profile),
      profile,
    };
  }

  async signOut(): Promise<void> {
    await signOut(auth);
    window.confirmationResult = undefined;
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email.trim());
  }

  async refreshProfile(
    user: User | null = auth.currentUser,
  ): Promise<AuthProfile | null> {
    if (!user) return null;
    return ensureUserProfile(user);
  }

  async getCurrentAuthUser(): Promise<AuthUser | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    const profile = await ensureUserProfile(currentUser);
    return mapAuthUser(currentUser, profile);
  }

  async getCurrentProfile(): Promise<AuthProfile | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    return ensureUserProfile(currentUser);
  }

  async sendPhoneOtp({
    phoneNumber,
    containerId = 'recaptcha-container',
  }: PhoneOtpPayload): Promise<ConfirmationResult> {
    const verifier = getRecaptchaVerifier(containerId);
    const normalized = normalizePhoneNumber(phoneNumber);

    const confirmation = await signInWithPhoneNumber(
      auth,
      normalized,
      verifier,
    );

    window.confirmationResult = confirmation;
    return confirmation;
  }

  async verifyPhoneOtp(otp: string): Promise<AuthSignInResult> {
    const confirmation = window.confirmationResult;

    if (!confirmation) {
      throw new Error('OTP verification session not found');
    }

    const credential = await confirmation.confirm(otp);
    const profile = await ensureUserProfile(
      credential.user,
      credential.user.displayName || undefined,
    );

    return {
      user: mapAuthUser(credential.user, profile),
      profile,
    };
  }

  async resendPhoneOtp(
    phoneNumber: string,
    containerId = 'recaptcha-container',
  ): Promise<ConfirmationResult> {
    return this.sendPhoneOtp({
      phoneNumber,
      containerId,
    });
  }

  async updateCurrentUserProfile(
    data: Partial<
      Pick<
        AuthProfile,
        | 'name'
        | 'photoURL'
        | 'role'
        | 'premium'
        | 'premiumExpiresAt'
        | 'institution'
        | 'phone'
        | 'bio'
      >
    >,
  ): Promise<AuthProfile> {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    const profileRef = doc(db, collectionNames.users, currentUser.uid);
    const currentProfile = await ensureUserProfile(currentUser);

    const nextProfile: AuthProfile = {
      ...currentProfile,
      ...data,
      uid: currentUser.uid,
      email: currentProfile.email || currentUser.email || '',
      updatedAt: serverTimestamp(),
      lastLoginAt: currentProfile.lastLoginAt,
    };

    await setDoc(
      profileRef,
      {
        ...nextProfile,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    if (data.name && data.name !== currentUser.displayName) {
      await updateProfile(currentUser, { displayName: data.name });
    }

    return nextProfile;
  }

  clearPhoneVerificationSession(): void {
    window.confirmationResult = undefined;
  }

  clearRecaptchaVerifier(): void {
    window.recaptchaVerifier = undefined;
  }
}

export const authService = new AuthService();

export {
  googleProvider,
  getRecaptchaVerifier,
  normalizePhoneNumber,
  ensureUserProfile,
};

export default authService;
