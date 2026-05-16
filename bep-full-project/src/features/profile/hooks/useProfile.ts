import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { profileService } from '../services/profile.service'
import { useAuthStore } from '@/store/auth.store'
import { useProfileStore } from '@/store/profile.store'
import { storageService } from '@/services/storage.service'
import { QUERY_KEYS } from '@/lib/constants'
import type { ProfileInput, EducationInput } from '@/lib/validators'

export function useProfile() {
  const { user } = useAuthStore()
  const { profile, education, setProfile, setEducation } = useProfileStore()
  const qc = useQueryClient()

  const uid = user?.uid

  const profileQuery = useQuery({
    queryKey: [QUERY_KEYS.PROFILE, uid],
    queryFn: () => profileService.getProfile(uid!),
    enabled: !!uid,
    staleTime: 5 * 60 * 1000,
  })

  const completeProfileMutation = useMutation({
    mutationFn: async ({
      profileData,
      educationData,
    }: {
      profileData: ProfileInput
      educationData: EducationInput
    }) => {
      if (!uid) throw new Error('Not authenticated')
      await profileService.completeProfile(uid, profileData, educationData)
    },
    onSuccess: async () => {
      if (!uid) return
      const [updatedProfile, updatedEducation] = await Promise.all([
        profileService.getProfile(uid),
        profileService.getEducation(uid),
      ])
      setProfile(updatedProfile)
      setEducation(updatedEducation)
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE, uid] })
      toast.success('প্রোফাইল সম্পন্ন হয়েছে!')
    },
    onError: () => toast.error('প্রোফাইল আপডেট ব্যর্থ হয়েছে'),
  })

  const updateAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!uid) throw new Error('Not authenticated')
      const url = await storageService.uploadAvatar(uid, file)
      await profileService.updateAvatar(uid, url)
      return url
    },
    onSuccess: (url) => {
      if (profile) setProfile({ ...profile, photoURL: url })
      toast.success('ছবি আপলোড সফল')
    },
    onError: () => toast.error('ছবি আপলোড ব্যর্থ'),
  })

  return {
    profile,
    education,
    isLoading: profileQuery.isLoading,
    completeProfile: completeProfileMutation.mutateAsync,
    isCompletingProfile: completeProfileMutation.isPending,
    updateAvatar: updateAvatarMutation.mutateAsync,
    isUploadingAvatar: updateAvatarMutation.isPending,
  }
}
