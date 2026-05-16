import type { Timestamp } from 'firebase/firestore'
import type { EducationLevel } from './profile.types'

export interface Subject {
  id: string
  name: string              // Bengali name
  nameEn: string            // English name
  icon: string              // emoji or icon key
  color: string             // hex color for UI
  level: EducationLevel[]
  order: number
  isActive: boolean
  questionCount: number
  chapterCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Chapter {
  id: string
  subjectId: string
  name: string
  nameEn: string
  order: number
  isActive: boolean
  questionCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
}
