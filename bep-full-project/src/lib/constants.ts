export const APP_NAME = 'BEP'
export const APP_FULL_NAME = 'Best Exam Preparation'
export const APP_TAGLINE = 'বাংলাদেশের সেরা পরীক্ষা প্রস্তুতি প্ল্যাটফর্ম'

export const ROUTES = {
  // Public
  HOME: '/',
  AUTH: '/auth',
  PRICING: '/pricing',
  // Protected
  COMPLETE_PROFILE: '/complete-profile',
  DASHBOARD: '/dashboard',
  QUESTION_BANK: '/question-bank',
  PRACTICE: '/practice',
  EXAM: '/exam',
  MOCK_TESTS: '/mock-tests',
  HISTORY: '/history',
  PROGRESS: '/progress',
  LEADERBOARD: '/leaderboard',
  COMMUNITY: '/community',
  AI_ASSISTANT: '/bep-ai',
  SETTINGS: '/settings',
  PROFILE_UPDATE: '/profile-update',
  CHANGE_PASSWORD: '/change-password',
  // Admin
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PROFILES: '/admin/profiles',
  ADMIN_SUBJECTS: '/admin/subjects',
  ADMIN_CHAPTERS: '/admin/chapters',
  ADMIN_QUESTIONS: '/admin/questions',
  ADMIN_CONTENT: '/admin/content',
  ADMIN_SETTINGS: '/admin/settings',
} as const

export const EDUCATION_LEVELS = [
  { value: 'ssc', label: 'এসএসসি / সমমান', labelEn: 'SSC' },
  { value: 'hsc', label: 'এইচএসসি / সমমান', labelEn: 'HSC' },
  { value: 'university', label: 'বিশ্ববিদ্যালয় ভর্তি', labelEn: 'University Admission' },
  { value: 'job_prep', label: 'চাকরির প্রস্তুতি', labelEn: 'Job Preparation' },
  { value: 'other', label: 'অন্যান্য', labelEn: 'Other' },
] as const

export const DISTRICTS = [
  'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট',
  'রংপুর', 'ময়মনসিংহ', 'কুমিল্লা', 'নারায়ণগঞ্জ', 'গাজীপুর',
  'টাঙ্গাইল', 'বগুড়া', 'দিনাজপুর', 'যশোর', 'পাবনা', 'নোয়াখালী',
  'ফেনী', 'ব্রাহ্মণবাড়িয়া', 'সিরাজগঞ্জ', 'কিশোরগঞ্জ', 'নেত্রকোনা',
]

export const QUERY_KEYS = {
  PROFILE: 'profile',
  EDUCATION: 'education',
  SUBJECTS: 'subjects',
  CHAPTERS: 'chapters',
  QUESTIONS: 'questions',
  ATTEMPTS: 'attempts',
  LEADERBOARD: 'leaderboard',
  COMMUNITY_POSTS: 'communityPosts',
  NOTIFICATIONS: 'notifications',
  MOCK_TESTS: 'mockTests',
} as const

export const MAX_FILE_SIZE = 5 * 1024 * 1024  // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
