import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { profileService } from '../services/profile.service'
import { useProfileStore } from '@/store/profile.store'
import { useAuthStore } from '@/store/auth.store'
import { QUERY_KEYS } from '@/lib/constants'
import type { ProfileInput, EducationInput } from '@/lib/validators'

export function useProfile(uid?: string) {
  const currentUid = useAuthStore((s) => s.user?.uid)
  const targetUid = uid ?? currentUid

  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE, targetUid],
    queryFn: () => profileService.getProfile(targetUid!),
    enabled: !!targetUid,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  const uid = useAuthStore((s) => s.user?.uid)
  const { patchProfile } = useProfileStore()

  return useMutation({
    mutationFn: (data: ProfileInput) => profileService.updateProfile(uid!, data),
    onSuccess: (_, vars) => {
      patchProfile(vars as any)
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE, uid] })
      toast.success('প্রোফাইল আপডেট হয়েছে')
    },
    onError: () => toast.error('আপডেট ব্যর্থ হয়েছে'),
  })
}

export function useCompleteProfile() {
  const qc = useQueryClient()
  const uid = useAuthStore((s) => s.user?.uid)
  const { patchProfile, setEducation } = useProfileStore()

  return useMutation({
    mutationFn: ({ profile, education }: { profile: ProfileInput; education: EducationInput }) =>
      profileService.completeProfile(uid!, profile, education),
    onSuccess: (_, { profile, education }) => {
      patchProfile({ ...profile as any, isProfileComplete: true })
      setEducation({ ...education, uid: uid! } as any)
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] })
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.EDUCATION] })
      toast.success('প্রোফাইল সম্পন্ন হয়েছে!')
    },
    onError: () => toast.error('প্রোফাইল সংরক্ষণ ব্যর্থ'),
  })
}
