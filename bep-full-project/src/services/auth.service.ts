import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  type User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type DocumentData,
} from 'firebase/firestore';

import { auth } from '@/firebase/auth';
import { db } from '@/firebase/firestore';

export type AuthRole = 'student' | 'moderator' | 'admin' | 'super_admin';

export interface AuthProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;

  role: AuthRole;

  username?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  location?: string;

  className?: string;
  batch?: string;
  institution?: string;
  subject?: string;
  language?: 'bn' | 'en';

  premium?: boolean;
  verified?: boolean;
  streakDays?: number;
  xp?: number;
  level?: number;

  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface SignInPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpPayload {
  fullName: string;
  email: string;
  password: string;
  role?: AuthRole;
}

export interface UpdateProfilePayload {
  displayName?: string;
  photoURL?: string;
  className?: string;
  batch?: string;
  institution?: string;
  subject?: string;
  language?: 'bn' | 'en';
}

const PROFILES_COLLECTION = 'profiles';

function profileRef(uid: string) {
  return doc(db, PROFILES_COLLECTION, uid);
}

function normalizeDisplayName(fullName: string) {
  return fullName.trim().replace(/\s+/g, ' ');
}

export function getFriendlyAuthError(error: unknown): string {
  if (typeof error !== 'object' || error === null) {
    return 'Something went wrong. Please try again.';
  }

  const maybeFirebaseError = error as { code?: string; message?: string };
  const code = maybeFirebaseError.code ?? '';
  const message = maybeFirebaseError.message ?? 'Something went wrong. Please try again.';

  const map: Record<string, string> = {
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/email-already-in-use': 'An account already exists with this email.',
    'auth/weak-password': 'Password is too weak. Use at least 8 characters.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/requires-recent-login': 'Please sign in again and retry this action.',
    'permission-denied': 'You do not have permission to perform this action.',
    'unavailable': 'Service is temporarily unavailable. Please try again.',
  };

  return map[code] || message;
}

export function isAuthenticated(user: User | null | undefined): user is User {
  return Boolean(user);
}

export async function signIn(payload: SignInPayload) {
  const credential = await signInWithEmailAndPassword(
    auth,
    payload.email.trim(),
    payload.password,
  );

  return credential.user;
}

export async function signUp(payload: SignUpPayload) {
  const { fullName, email, password, role = 'student' } = payload;

  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  const displayName = normalizeDisplayName(fullName);

  await updateProfile(credential.user, {
    displayName,
  });

  const profile: AuthProfile = {
    uid: credential.user.uid,
    email: credential.user.email,
    displayName,
    photoURL: credential.user.photoURL,
    role,
    username: '',
    bio: '',
    avatarUrl: credential.user.photoURL ?? '',
    coverUrl: '',
    location: '',
    className: '',
    batch: '',
    institution: '',
    subject: '',
    language: 'bn',
    premium: false,
    verified: false,
    streakDays: 0,
    xp: 0,
    level: 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(profileRef(credential.user.uid), profile, { merge: true });

  return credential.user;
}

export async function signOutUser() {
  await signOut(auth);
}

export async function sendResetPassword(email: string) {
  await sendPasswordResetEmail(auth, email.trim());
}

export async function sendVerificationEmail() {
  if (!auth.currentUser) {
    throw new Error('No authenticated user.');
  }

  await sendEmailVerification(auth.currentUser);
}

export async function refreshAuthProfile(user: User, payload: UpdateProfilePayload) {
  const displayName = payload.displayName?.trim() || user.displayName || null;
  const photoURL = payload.photoURL?.trim() || user.photoURL || null;

  await updateProfile(user, {
    displayName,
    photoURL,
  });

  await setDoc(
    profileRef(user.uid),
    {
      uid: user.uid,
      email: user.email,
      displayName,
      photoURL,
      className: payload.className,
      batch: payload.batch,
      institution: payload.institution,
      subject: payload.subject,
      language: payload.language,
      updatedAt: serverTimestamp(),
    } satisfies Partial<AuthProfile> as DocumentData,
    { merge: true },
  );
}

export async function getAuthProfile(uid: string): Promise<AuthProfile | null> {
  const snapshot = await getDoc(profileRef(uid));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as AuthProfile;
}

export async function updateAuthProfile(
  uid: string,
  payload: Partial<AuthProfile>,
) {
  await setDoc(
    profileRef(uid),
    {
      ...payload,
      updatedAt: serverTimestamp(),
    } as DocumentData,
    { merge: true },
  );
}

export async function changeUserPassword(currentPassword: string, newPassword: string) {
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error('No authenticated user.');
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}

export function getCurrentUser() {
  return auth.currentUser;
}
