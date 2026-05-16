// bep-full-project/src/features/auth/types.ts

import type {
  ConfirmationResult,
  RecaptchaVerifier,
  User,
} from 'firebase/auth';

export type AuthMode =
  | 'login'
  | 'register';

export type AuthProvider =
  | 'email'
  | 'google'
  | 'phone';

export type AuthRole =
  | 'student'
  | 'moderator'
  | 'admin';

export type AuthStatus =
  | 'authenticated'
  | 'unauthenticated'
  | 'loading';

export interface AuthProfile {
  id?: string;
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;
  role: AuthRole;
  premium: boolean;
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

export interface RegisterPayload
  extends EmailAuthPayload {
  confirmPassword?: string;
}

export interface PhoneOtpPayload {
  phoneNumber: string;
  containerId?: string;
  countryCode?: string;
}

export interface PhoneVerificationState {
  verificationPending: boolean;
  confirmationResult?: ConfirmationResult | null;
  recaptchaVerifier?: RecaptchaVerifier | null;
}

export interface AuthSignInResult {
  user: AuthUser;
  profile: AuthProfile;
}

export interface AuthSession {
  accessToken?: string;
  refreshToken?: string;
  provider: AuthProvider;
  createdAt: string;
}

export interface AuthStoreState {
  user: AuthUser | null;
  profile: AuthProfile | null;
  loading: boolean;
  initialized: boolean;
  authenticated: boolean;
  error: string | null;
}

export interface AuthStoreActions {
  setUser: (
    user: AuthUser | null,
  ) => void;

  setProfile: (
    profile: AuthProfile | null,
  ) => void;

  setLoading: (
    value: boolean,
  ) => void;

  setAuthenticated: (
    value: boolean,
  ) => void;

  setInitialized: (
    value: boolean,
  ) => void;

  setError: (
    value: string | null,
  ) => void;

  resetAuth: () => void;
}

export interface AuthContextValue
  extends AuthStoreState,
    AuthStoreActions {
  authMode: AuthMode;

  setAuthMode: (
    mode: AuthMode,
  ) => void;

  signInWithEmail: (
    payload: EmailAuthPayload,
  ) => Promise<void>;

  signUpWithEmail: (
    payload: RegisterPayload,
  ) => Promise<void>;

  signInWithGoogle: () => Promise<void>;

  sendPhoneOtp: (
    phoneNumber: string,
    containerId?: string,
  ) => Promise<void>;

  verifyPhoneOtp: (
    otp: string,
  ) => Promise<void>;

  resetPassword: (
    email: string,
  ) => Promise<void>;

  logout: () => Promise<void>;

  clearError: () => void;
}

export interface FirebaseAuthError {
  code: string;
  message: string;
}

export interface SocialAuthButton {
  id: AuthProvider;
  label: string;
  icon?: string;
  enabled: boolean;
}

export interface AuthGuardOptions {
  requireAuth?: boolean;
  allowedRoles?: AuthRole[];
  redirectTo?: string;
}

export interface UserMetadata {
  joinedAt?: string;
  streak?: number;
  examsCompleted?: number;
  totalPoints?: number;
}

export interface ExtendedAuthUser
  extends AuthUser {
  metadata?: UserMetadata;
  firebaseUser?: User | null;
}
