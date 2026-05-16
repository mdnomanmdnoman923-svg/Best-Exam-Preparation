// bep-full-project/src/firebase/auth.ts

import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  GithubAuthProvider,
  onAuthStateChanged,
  PhoneAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInAnonymously,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
  User,
  verifyBeforeUpdateEmail,
  ConfirmationResult,
} from 'firebase/auth';

import { app } from './config';

export const auth = getAuth(app);

export const googleProvider =
  new GoogleAuthProvider();

export const githubProvider =
  new GithubAuthProvider();

export const facebookProvider =
  new FacebookAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

facebookProvider.setCustomParameters({
  display: 'popup',
});

githubProvider.setCustomParameters({
  allow_signup: 'true',
});

export type AuthProviderType =
  | 'google'
  | 'github'
  | 'facebook'
  | 'phone'
  | 'email'
  | 'anonymous';

export interface AuthUserProfile {
  uid: string;

  email: string | null;

  displayName: string | null;

  photoURL: string | null;

  phoneNumber: string | null;

  emailVerified: boolean;

  isAnonymous: boolean;

  providerId?: string | null;
}

export interface EmailRegisterPayload {
  email: string;

  password: string;

  displayName?: string;
}

export interface EmailLoginPayload {
  email: string;

  password: string;
}

export interface PhoneOtpPayload {
  phoneNumber: string;

  appVerifier: RecaptchaVerifier;
}

export interface VerifyPhoneOtpPayload {
  verificationId: string;

  otp: string;
}

export interface AuthStateListener {
  unsubscribe: () => void;
}

export function mapAuthUser(
  user: User | null,
): AuthUserProfile | null {
  if (!user) {
    return null;
  }

  return {
    uid: user.uid,
    email: user.email,
    displayName:
      user.displayName,
    photoURL:
      user.photoURL,
    phoneNumber:
      user.phoneNumber,
    emailVerified:
      user.emailVerified,
    isAnonymous:
      user.isAnonymous,
    providerId:
      user.providerData?.[0]
        ?.providerId || null,
  };
}

export async function setRememberSession(
  remember = true,
) {
  await setPersistence(
    auth,
    remember
      ? browserLocalPersistence
      : browserSessionPersistence,
  );
}

export async function registerWithEmail(
  payload: EmailRegisterPayload,
) {
  const credential =
    await createUserWithEmailAndPassword(
      auth,
      payload.email,
      payload.password,
    );

  if (
    payload.displayName?.trim()
  ) {
    await updateProfile(
      credential.user,
      {
        displayName:
          payload.displayName.trim(),
      },
    );
  }

  await sendEmailVerification(
    credential.user,
  );

  return mapAuthUser(
    credential.user,
  );
}

export async function loginWithEmail(
  payload: EmailLoginPayload,
) {
  const credential =
    await signInWithEmailAndPassword(
      auth,
      payload.email,
      payload.password,
    );

  return mapAuthUser(
    credential.user,
  );
}

export async function loginWithGoogle() {
  const credential =
    await signInWithPopup(
      auth,
      googleProvider,
    );

  return mapAuthUser(
    credential.user,
  );
}

export async function loginWithGithub() {
  const credential =
    await signInWithPopup(
      auth,
      githubProvider,
    );

  return mapAuthUser(
    credential.user,
  );
}

export async function loginWithFacebook() {
  const credential =
    await signInWithPopup(
      auth,
      facebookProvider,
    );

  return mapAuthUser(
    credential.user,
  );
}

export async function loginAnonymously() {
  const credential =
    await signInAnonymously(
      auth,
    );

  return mapAuthUser(
    credential.user,
  );
}

export async function sendPhoneOtp(
  payload: PhoneOtpPayload,
): Promise<ConfirmationResult> {
  return signInWithPhoneNumber(
    auth,
    payload.phoneNumber,
    payload.appVerifier,
  );
}

export async function verifyPhoneOtp(
  payload: VerifyPhoneOtpPayload,
) {
  const credential =
    PhoneAuthProvider.credential(
      payload.verificationId,
      payload.otp,
    );

  const result =
    await signInWithCredential(
      auth,
      credential,
    );

  return mapAuthUser(
    result.user,
  );
}

export async function forgotPassword(
  email: string,
) {
  return sendPasswordResetEmail(
    auth,
    email,
  );
}

export async function resendVerificationEmail() {
  if (!auth.currentUser) {
    throw new Error(
      'No authenticated user found.',
    );
  }

  return sendEmailVerification(
    auth.currentUser,
  );
}

export async function changeEmail(
  newEmail: string,
) {
  if (!auth.currentUser) {
    throw new Error(
      'No authenticated user found.',
    );
  }

  return verifyBeforeUpdateEmail(
    auth.currentUser,
    newEmail,
  );
}

export async function changePassword(
  newPassword: string,
) {
  if (!auth.currentUser) {
    throw new Error(
      'No authenticated user found.',
    );
  }

  return updatePassword(
    auth.currentUser,
    newPassword,
  );
}

export async function updateUserProfile(
  payload: {
    displayName?: string;
    photoURL?: string;
  },
) {
  if (!auth.currentUser) {
    throw new Error(
      'No authenticated user found.',
    );
  }

  await updateProfile(
    auth.currentUser,
    payload,
  );

  return mapAuthUser(
    auth.currentUser,
  );
}

export async function logout() {
  await signOut(auth);
}

export function getCurrentUser() {
  return mapAuthUser(
    auth.currentUser,
  );
}

export function onUserChanged(
  callback: (
    user: AuthUserProfile | null,
  ) => void,
): AuthStateListener {
  const unsubscribe =
    onAuthStateChanged(
      auth,
      (user) => {
        callback(
          mapAuthUser(user),
        );
      },
    );

  return {
    unsubscribe,
  };
}

export function createRecaptcha(
  containerId: string,
  size:
    | 'normal'
    | 'compact'
    | 'invisible' = 'invisible',
) {
  return new RecaptchaVerifier(
    auth,
    containerId,
    {
      size,
      callback: () => {
        console.log(
          'reCAPTCHA solved',
        );
      },
    },
  );
}

export function isLoggedIn() {
  return Boolean(
    auth.currentUser,
  );
}

export default auth;
