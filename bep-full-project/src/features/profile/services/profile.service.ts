import { firestoreService } from '@/services/firestore.service'
import { COLLECTIONS } from '@/firebase/collections'
import { serverTimestamp } from '@/firebase/firestore'
import type { UserProfile, EducationProfile, UserRole } from '@/types/profile.types'
import type { ProfileInput, EducationInput } from '@/lib/validators'

export const profileService = {
  /** Fetch a user's main profile document */
  async getProfile(uid: string): Promise<UserProfile | null> {
    return firestoreService.getDocument<UserProfile>(COLLECTIONS.PROFILES, uid)
  },

  /** Fetch a user's education profile */
  async getEducation(uid: string): Promise<EducationProfile | null> {
    return firestoreService.getDocument<EducationProfile>(COLLECTIONS.EDUCATION_PROFILES, uid)
  },

  /** Fetch a user's role document */
  async getRole(uid: string): Promise<UserRole | null> {
    return firestoreService.getDocument<UserRole>(COLLECTIONS.USER_ROLES, uid)
  },

  /** Create a minimal profile stub for newly registered users */
  async createProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    await firestoreService.setDocument(
      COLLECTIONS.PROFILES,
      uid,
      {
        uid,
        displayName: data.displayName ?? '',
        email: data.email ?? null,
        photoURL: data.photoURL ?? null,
        phoneNumber: data.phoneNumber ?? null,
        gender: null,
        dateOfBirth: null,
        district: null,
        institution: null,
        isProfileComplete: false,
        isPremium: false,
        premiumExpiry: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...data,
      },
      false // do not merge — create fresh
    )
  },

  /** Update the main profile fields (partial update) */
  async updateProfile(uid: string, data: ProfileInput): Promise<void> {
    await firestoreService.updateDocument(COLLECTIONS.PROFILES, uid, {
      ...data,
    })
  },

  /**
   * Mark profile as complete and upsert education data.
   * Called from the CompleteProfile page flow.
   */
  async completeProfile(
    uid: string,
    profileData: ProfileInput,
    educationData: EducationInput
  ): Promise<void> {
    // Update profile and mark complete
    await firestoreService.updateDocument(COLLECTIONS.PROFILES, uid, {
      ...profileData,
      isProfileComplete: true,
    })

    // Upsert education profile
    await firestoreService.setDocument(
      COLLECTIONS.EDUCATION_PROFILES,
      uid,
      {
        uid,
        ...educationData,
        updatedAt: serverTimestamp(),
      },
      true // merge
    )
  },

  /** Update only the education portion */
  async updateEducation(uid: string, data: EducationInput): Promise<void> {
    await firestoreService.setDocument(
      COLLECTIONS.EDUCATION_PROFILES,
      uid,
      {
        uid,
        ...data,
        updatedAt: serverTimestamp(),
      },
      true
    )
  },

  /** Persist new avatar URL to Firestore profile */
  async updateAvatar(uid: string, photoURL: string): Promise<void> {
    await firestoreService.updateDocument(COLLECTIONS.PROFILES, uid, { photoURL })
  },

  /** Grant or update a user's role — admin only */
  async setRole(
    uid: string,
    role: UserRole['role'],
    grantedBy: string,
    permissions: string[] = []
  ): Promise<void> {
    await firestoreService.setDocument(
      COLLECTIONS.USER_ROLES,
      uid,
      {
        uid,
        role,
        permissions,
        grantedAt: serverTimestamp(),
        grantedBy,
      },
      true
    )
  },

  /** Toggle premium status */
  async setPremium(uid: string, isPremium: boolean, expiryDate: Date | null): Promise<void> {
    await firestoreService.updateDocument(COLLECTIONS.PROFILES, uid, {
      isPremium,
      premiumExpiry: expiryDate
        ? { toDate: () => expiryDate, seconds: Math.floor(expiryDate.getTime() / 1000), nanoseconds: 0 }
        : null,
    })
  },
}
