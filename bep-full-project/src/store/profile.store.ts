import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { UserProfile, EducationProfile } from '@/types/profile.types'

interface ProfileState {
  profile: UserProfile | null
  education: EducationProfile | null
  isLoading: boolean
  // Actions
  setProfile: (profile: UserProfile | null) => void
  setEducation: (education: EducationProfile | null) => void
  setLoading: (loading: boolean) => void
  patchProfile: (patch: Partial<UserProfile>) => void
  reset: () => void
}

export const useProfileStore = create<ProfileState>()(
  devtools(
    (set, get) => ({
      profile: null,
      education: null,
      isLoading: false,

      setProfile: (profile) => set({ profile }, false, 'profile/setProfile'),
      setEducation: (education) => set({ education }, false, 'profile/setEducation'),
      setLoading: (isLoading) => set({ isLoading }, false, 'profile/setLoading'),
      patchProfile: (patch) => {
        const current = get().profile
        if (current) {
          set({ profile: { ...current, ...patch } }, false, 'profile/patch')
        }
      },
      reset: () => set({ profile: null, education: null, isLoading: false }, false, 'profile/reset'),
    }),
    { name: 'ProfileStore' }
  )
)
