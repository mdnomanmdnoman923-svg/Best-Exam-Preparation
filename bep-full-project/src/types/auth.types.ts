import type { User } from 'firebase/auth'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  phoneNumber: string | null
}

export type AuthProvider = 'google' | 'email' | 'phone'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  displayName: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

export { type User as FirebaseUser }
