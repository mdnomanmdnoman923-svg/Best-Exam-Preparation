import { useEffect } from 'react'
import { onAuthStateChanged } from '@/firebase/auth'
import { auth } from '@/firebase/auth'
import { useAuthStore } from '@/store/auth.store'
import { useProfileStore } from '@/store/profile.store'
import { profileService } from '@/features/profile/services/profile.service'
import type { AuthUser } from '@/types/auth.types'

/**
 * Bootstrap hook — call once at the App root.
 * Syncs Firebase auth state to Zustand stores.
 */
export function useAuthState() {
  const { setUser, setRole, setStatus } = useAuthStore()
  const { setProfile, setEducation } = useProfileStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          phoneNumber: firebaseUser.phoneNumber,
        }
        setUser(authUser)

        // Load profile + role in parallel
        const [profile, education, role] = await Promise.all([
          profileService.getProfile(firebaseUser.uid),
          profileService.getEducation(firebaseUser.uid),
          profileService.getRole(firebaseUser.uid),
        ])

        setProfile(profile)
        setEducation(education)
        setRole(role)
        setStatus('authenticated')
      } else {
        setUser(null)
        setProfile(null)
        setEducation(null)
        setRole(null)
        setStatus('unauthenticated')
      }
    })

    return unsubscribe
  }, [setUser, setRole, setStatus, setProfile, setEducation])
}
