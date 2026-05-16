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
  async signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  },

  async signInWithEmail({ email, password }: LoginCredentials) {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  },

  async registerWithEmail({ email, password, displayName }: RegisterCredentials) {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName })
    return result.user
  },

  async signOut() {
    await signOut(auth)
  },

  async sendPasswordReset(email: string) {
    await sendPasswordResetEmail(auth, email)
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const user = auth.currentUser
    if (!user || !user.email) throw new Error('ব্যবহারকারী পাওয়া যায়নি')
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    await reauthenticateWithCredential(user, credential)
    await updatePassword(user, newPassword)
  },

  getCurrentUser() {
    return auth.currentUser
  },
}
