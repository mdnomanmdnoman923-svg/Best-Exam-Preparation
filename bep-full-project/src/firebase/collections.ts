/**
 * Firestore collection names — single source of truth.
 * Never hard-code collection strings in services.
 */
export const COLLECTIONS = {
  PROFILES: 'profiles',
  EDUCATION_PROFILES: 'educationProfiles',
  PROFILE_BATCHES: 'profileBatches',
  USER_ROLES: 'userRoles',
  SUBJECTS: 'subjects',
  CHAPTERS: 'chapters',
  QUESTIONS: 'questions',
  ATTEMPTS: 'attempts',
  BOOKMARKS: 'bookmarks',
  MOCK_TESTS: 'mockTests',
  COMMUNITY_POSTS: 'communityPosts',
  REPLIES: 'replies',
  ANNOUNCEMENTS: 'announcements',
  CHAT_HISTORY: 'chatHistory',
  NOTIFICATIONS: 'notifications',
  SITE_CONTENT: 'siteContent',
  SITE_SETTINGS: 'siteSettings',
} as const

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS]
