import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from '@/firebase/auth'
import { updateProfile } from 'firebase/auth'
import type { LoginCredentials, RegisterCredentials } from '@/types/auth.types'

export const authService = {
  /**
   * Sign in with Google OAuth popup.
   * Returns the Firebase User on success.
   */
  async signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  },

  /**
   * Sign in with email + password.
   */
  async signInWithEmail({ email, password }: LoginCredentials) {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  },

  /**
   * Create a new account with email + password.
   * Also sets displayName on the Firebase Auth profile.
   */
  async registerWithEmail({ email, password, displayName }: RegisterCredentials) {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName })
    return result.user
  },

  /**
   * Sign out the current user.
   */
  async signOut() {
    await signOut(auth)
  },

  /**
   * Send a password reset email.
   */
  async sendPasswordReset(email: string) {
    await sendPasswordResetEmail(auth, email)
  },

  /**
   * Change the current user's password.
   * Re-authenticates first to satisfy Firebase security requirements.
   */
  async changePassword(currentPassword: string, newPassword: string) {
    const user = auth.currentUser
    if (!user || !user.email) {
      throw new Error('ব্যবহারকারী খুঁজে পাওয়া যায়নি')
    }
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    await reauthenticateWithCredential(user, credential)
    await updatePassword(user, newPassword)
  },

  /**
   * Update the Firebase Auth displayName and/or photoURL.
   */
  async updateAuthProfile(data: { displayName?: string; photoURL?: string }) {
    const user = auth.currentUser
    if (!user) throw new Error('ব্যবহারকারী খুঁজে পাওয়া যায়নি')
    await updateProfile(user, data)
  },

  /**
   * Get the currently signed-in Firebase Auth user (synchronous snapshot).
   */
  getCurrentUser() {
    return auth.currentUser
  },

  /**
   * Get the current user's ID token (for API calls / Cloud Functions).
   */
  async getIdToken(forceRefresh = false): Promise<string | null> {
    const user = auth.currentUser
    if (!user) return null
    return user.getIdToken(forceRefresh)
  },
}
