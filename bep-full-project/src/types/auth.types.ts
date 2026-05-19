// bep-full-project/src/types/auth.types.ts

import type { User } from 'firebase/auth';

/* -------------------------------------------------------------------------- */
/*                                   Roles                                    */
/* -------------------------------------------------------------------------- */

export type UserRole =
  | 'student'
  | 'moderator'
  | 'admin'
  | 'super_admin';

export type AuthProvider =
  | 'email'
  | 'google'
  | 'facebook'
  | 'github'
  | 'anonymous';

/* -------------------------------------------------------------------------- */
/*                                Auth User                                   */
/* -------------------------------------------------------------------------- */

export interface AuthUser {
  uid: string;

  email: string | null;
  phoneNumber?: string | null;

  displayName: string | null;
  photoURL?: string | null;

  role: UserRole;

  provider?: AuthProvider;

  emailVerified?: boolean;

  disabled?: boolean;
  banned?: boolean;

  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

/* -------------------------------------------------------------------------- */
/*                               User Profile                                 */
/* -------------------------------------------------------------------------- */

export interface UserProfile {
  uid: string;

  fullName?: string;
  username?: string;

  email?: string | null;
  phone?: string;

  avatarUrl?: string;
  coverUrl?: string;

  bio?: string;
  gender?: string;

  className?: string;
  batch?: string;
  institution?: string;
  subject?: string;

  language?: 'bn' | 'en';

  location?: string;

  role?: UserRole;

  premium?: boolean;
  verified?: boolean;

  streakDays?: number;
  xp?: number;
  level?: number;

  createdAt?: string;
  updatedAt?: string;
}

/* -------------------------------------------------------------------------- */
/*                               Auth Session                                 */
/* -------------------------------------------------------------------------- */

export interface AuthSession {
  user: AuthUser | null;

  accessToken?: string | null;
  refreshToken?: string | null;

  expiresAt?: number;

  authenticated: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              Login Payload                                 */
/* -------------------------------------------------------------------------- */

export interface LoginPayload {
  email: string;
  password: string;

  rememberMe?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                             Register Payload                               */
/* -------------------------------------------------------------------------- */

export interface RegisterPayload {
  fullName: string;

  email: string;
  password: string;

  confirmPassword?: string;

  role?: UserRole;
}

/* -------------------------------------------------------------------------- */
/*                         Password Reset Payload                             */
/* -------------------------------------------------------------------------- */

export interface ResetPasswordPayload {
  email: string;
}

/* -------------------------------------------------------------------------- */
/*                         Change Password Payload                            */
/* -------------------------------------------------------------------------- */

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

/* -------------------------------------------------------------------------- */
/*                          Complete Profile Payload                          */
/* -------------------------------------------------------------------------- */

export interface CompleteProfilePayload {
  fullName?: string;
  username?: string;

  phone?: string;

  className?: string;
  batch?: string;

  institution?: string;
  subject?: string;

  bio?: string;

  language?: 'bn' | 'en';
}

/* -------------------------------------------------------------------------- */
/*                               Auth Errors                                  */
/* -------------------------------------------------------------------------- */

export interface AuthError {
  code: string;
  message: string;
}

/* -------------------------------------------------------------------------- */
/*                              Auth Response                                 */
/* -------------------------------------------------------------------------- */

export interface AuthResponse<T = unknown> {
  success: boolean;

  data?: T;

  message?: string;
  error?: string;
}

/* -------------------------------------------------------------------------- */
/*                           Auth Store State                                 */
/* -------------------------------------------------------------------------- */

export interface AuthStoreState {
  user: AuthUser | null;
  profile: UserProfile | null;

  loading: boolean;
  initialized: boolean;

  accessToken?: string | null;

  error?: string | null;
}

/* -------------------------------------------------------------------------- */
/*                            Firebase Helpers                                */
/* -------------------------------------------------------------------------- */

export interface FirebaseAuthState {
  firebaseUser: User | null;

  loading: boolean;
  initialized: boolean;
}

/* -------------------------------------------------------------------------- */
/*                            Social Providers                                */
/* -------------------------------------------------------------------------- */

export interface SocialAuthProvider {
  id: AuthProvider;

  label: string;
  enabled?: boolean;

  icon?: string;
  color?: string;
}

/* -------------------------------------------------------------------------- */
/*                             Permissions                                    */
/* -------------------------------------------------------------------------- */

export type UserPermission =
  | 'read_questions'
  | 'practice_questions'
  | 'take_mock_tests'
  | 'join_community'
  | 'use_ai_assistant'
  | 'manage_content'
  | 'manage_users'
  | 'manage_settings'
  | 'full_access';

export interface RolePermissionMap {
  role: UserRole;
  permissions: UserPermission[];
}

/* -------------------------------------------------------------------------- */
/*                            Security Settings                               */
/* -------------------------------------------------------------------------- */

export interface SecuritySettings {
  twoFactorEnabled?: boolean;

  emailLoginAlerts?: boolean;
  deviceTracking?: boolean;

  lastPasswordChange?: string;
}

/* -------------------------------------------------------------------------- */
/*                            Notification Settings                           */
/* -------------------------------------------------------------------------- */

export interface NotificationSettings {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;

  marketingEmails?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                             Default Constants                              */
/* -------------------------------------------------------------------------- */

export const DEFAULT_USER_ROLE: UserRole = 'student';

export const AUTH_STORAGE_KEY = 'bep-auth-storage';

export const SUPPORTED_AUTH_PROVIDERS: SocialAuthProvider[] = [
  {
    id: 'google',
    label: 'Google',
    enabled: true,
    color: '#EA4335',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    enabled: false,
    color: '#1877F2',
  },
  {
    id: 'github',
    label: 'GitHub',
    enabled: false,
    color: '#111827',
  },
  {
    id: 'email',
    label: 'Email',
    enabled: true,
    color: '#22D3EE',
  },
];
