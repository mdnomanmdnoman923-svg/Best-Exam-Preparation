// bep-full-project/src/features/auth/index.ts

export { default as AuthStateListener } from './components/AuthStateListener';
export { default as EmailPasswordForm } from './components/EmailPasswordForm';
export { default as GoogleAuthButton } from './components/GoogleAuthButton';
export { default as PhoneOtpForm } from './components/PhoneOtpForm';

export {
  default as useAuth,
  type AuthMode,
  type AuthProfile,
  type EmailAuthPayload,
  type UseAuthReturn,
} from './hooks/useAuth';

export {
  authService,
  default as authServiceDefault,
  googleProvider,
  getRecaptchaVerifier,
  normalizePhoneNumber,
  ensureUserProfile,
} from './services/auth.service';

export type {
  AuthRole,
  AuthUser,
  AuthSignInResult,
  AuthServiceOptions,
  PhoneOtpPayload,
} from './services/auth.service';
