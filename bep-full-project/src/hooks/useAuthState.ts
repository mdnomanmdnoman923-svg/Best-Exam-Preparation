import { useEffect } from 'react'
import { auth, onAuthStateChanged } from '@/firebase/auth'
import { useAuthStore } from '@/store/auth.store'
import { useProfileStore } from '@/store/profile.store'
import { profileService } from '@/features/profile/services/profile.service'
import { authService } from '@/services/auth.service'

/**
 * Bootstraps Firebase auth state into Zustand.
 * Called once at app root via AuthStateListener component.
 */
export function useAuthState() {
  const { setUser, setRole, setStatus } = useAuthStore()
  const { setProfile, setEducation, reset: resetProfile } = useProfileStore()

  useEffect(() => {
    setStatus('loading')

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setRole(null)
        setStatus('unauthenticated')
        resetProfile()
        return
      }

      // Hydrate auth user
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
        phoneNumber: firebaseUser.phoneNumber,
      })

      // Load Firestore profile, education, role in parallel
      try {
        const [profile, education, role] = await Promise.all([
          profileService.getProfile(firebaseUser.uid),
          profileService.getEducation(firebaseUser.uid),
          profileService.getRole(firebaseUser.uid),
        ])

        if (!profile) {
          // First-time user — create a minimal profile
          await profileService.createProfile(firebaseUser.uid, {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName ?? '',
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            phoneNumber: firebaseUser.phoneNumber,
          })
          const fresh = await profileService.getProfile(firebaseUser.uid)
          setProfile(fresh)
        } else {
          setProfile(profile)
        }

        setEducation(education)
        setRole(role)
        setStatus('authenticated')
      } catch (err) {
        console.error('[AuthState] profile load failed:', err)
        setStatus('authenticated') // still authenticated, just no profile yet
      }
    })

    return unsub
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
