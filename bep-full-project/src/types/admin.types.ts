import type { Timestamp } from 'firebase/firestore'

export interface SiteContent {
  id: string               // e.g. 'hero', 'features', 'faq'
  title: string
  body: string
  imageURL: string | null
  isVisible: boolean
  order: number
  updatedAt: Timestamp
  updatedBy: string
}

export interface SiteSettings {
  id: 'global'
  siteName: string
  maintenanceMode: boolean
  allowNewRegistrations: boolean
  defaultRole: string
  premiumPrice: number
  contactEmail: string
  socialLinks: Record<string, string>
  updatedAt: Timestamp
}

export interface Announcement {
  id: string
  title: string
  body: string
  type: 'info' | 'warning' | 'success' | 'danger'
  isActive: boolean
  targetRole: 'all' | 'premium' | 'admin'
  expiresAt: Timestamp | null
  createdAt: Timestamp
  createdBy: string
}
