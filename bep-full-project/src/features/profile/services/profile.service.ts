import { firestoreService } from '@/services/firestore.service'
import { COLLECTIONS } from '@/firebase/collections'
import { serverTimestamp } from '@/firebase/firestore'
import type { UserProfile, EducationProfile, UserRole } from '@/types/profile.types'
import type { ProfileInput, EducationInput } from '@/lib/validators'

export const profileService = {
  async getProfile(uid: string): Promise<UserProfile | null> {
    return firestoreService.getDocument<UserProfile>(COLLECTIONS.PROFILES, uid)
  },

  async getEducation(uid: string): Promise<EducationProfile | null> {
    return firestoreService.getDocument<EducationProfile>(COLLECTIONS.EDUCATION_PROFILES, uid)
  },

  async getRole(uid: string): Promise<UserRole | null> {
    return firestoreService.getDocument<UserRole>(COLLECTIONS.USER_ROLES, uid)
  },

  async createProfile(uid: string, data: Partial<UserProfile>) {
    await firestoreService.setDocument(COLLECTIONS.PROFILES, uid, {
      ...data,
      uid,
      isProfileComplete: false,
      isPremium: false,
      premiumExpiry: null,
      createdAt: serverTimestamp(),
    })
  },

  async updateProfile(uid: string, data: ProfileInput) {
    await firestoreService.updateDocument(COLLECTIONS.PROFILES, uid, data)
  },

  async completeProfile(uid: string, profileData: ProfileInput, educationData: EducationInput) {
    // Update profile
    await firestoreService.updateDocument(COLLECTIONS.PROFILES, uid, {
      ...profileData,
      isProfileComplete: true,
    })

    // Upsert education
    await firestoreService.setDocument(COLLECTIONS.EDUCATION_PROFILES, uid, {
      ...educationData,
      uid,
      createdAt: serverTimestamp(),
    })
  },

  async updateEducation(uid: string, data: EducationInput) {
    await firestoreService.setDocument(COLLECTIONS.EDUCATION_PROFILES, uid, {
      ...data,
      uid,
    })
  },

  async updateAvatar(uid: string, photoURL: string) {
    await firestoreService.updateDocument(COLLECTIONS.PROFILES, uid, { photoURL })
  },
}
