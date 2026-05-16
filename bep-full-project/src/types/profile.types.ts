import type { Timestamp } from 'firebase/firestore'

export type EducationLevel = 'ssc' | 'hsc' | 'university' | 'job_prep' | 'other'
export type Gender = 'male' | 'female' | 'other'

export interface UserProfile {
  uid: string
  displayName: string
  email: string | null
  photoURL: string | null
  phoneNumber: string | null
  gender: Gender | null
  dateOfBirth: string | null
  district: string | null
  institution: string | null
  isProfileComplete: boolean
  isPremium: boolean
  premiumExpiry: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface EducationProfile {
  uid: string
  level: EducationLevel
  classYear: string | null   // e.g. "Class 10", "1st Year"
  group: string | null       // Science / Commerce / Arts
  examYear: string | null    // "2025"
  institution: string | null
  batchId: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ProfileBatch {
  id: string
  name: string              // e.g. "HSC 2025 Science"
  level: EducationLevel
  description: string | null
  isActive: boolean
  memberCount: number
  createdAt: Timestamp
}

export interface UserRole {
  uid: string
  role: 'student' | 'teacher' | 'admin' | 'superadmin'
  permissions: string[]
  grantedAt: Timestamp
  grantedBy: string
}

// Combined profile for app use
export interface FullProfile {
  user: UserProfile
  education: EducationProfile | null
  role: UserRole | null
}
