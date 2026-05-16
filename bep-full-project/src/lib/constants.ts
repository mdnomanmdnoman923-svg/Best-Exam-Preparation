// bep-full-project/src/lib/constants.ts

export const APP_NAME =
  'BEP';

export const APP_FULL_NAME =
  'Bengali Education Platform';

export const APP_TAGLINE =
  'বাংলাদেশি শিক্ষার্থীদের জন্য আধুনিক AI-powered learning platform';

export const APP_DESCRIPTION =
  'BEP হলো একটি modern Bengali-first EdTech SaaS platform যেখানে practice, mock exam, AI assistant, analytics এবং leaderboard একসাথে পাওয়া যায়।';

export const APP_VERSION =
  '1.0.0';

export const APP_AUTHOR =
  'BEP Team';

export const APP_EMAIL =
  'support@bep.top';

export const APP_WEBSITE =
  'https://bep.top';

export const APP_SUPPORT_URL =
  'https://bep.top/contact';

export const APP_PRIVACY_URL =
  'https://bep.top/privacy-policy';

export const APP_TERMS_URL =
  'https://bep.top/terms';

export const APP_ABOUT_URL =
  'https://bep.top/about';

export const DEFAULT_LANGUAGE =
  'bn';

export const DEFAULT_TIMEZONE =
  'Asia/Dhaka';

export const DEFAULT_CURRENCY =
  'BDT';

export const STORAGE_KEYS = {
  authToken:
    'bep-auth-token',

  refreshToken:
    'bep-refresh-token',

  theme:
    'bep-theme',

  locale:
    'bep-locale',

  onboarding:
    'bep-onboarding',

  settings:
    'bep-settings',

  practiceDraft:
    'bep-practice-draft',

  examDraft:
    'bep-exam-draft',

  aiChatDraft:
    'bep-ai-chat-draft',

  leaderboardFilter:
    'bep-leaderboard-filter',
} as const;

export const ROUTES = {
  home: '/',

  login: '/login',

  register:
    '/register',

  forgotPassword:
    '/forgot-password',

  dashboard:
    '/dashboard',

  subjects:
    '/subjects',

  chapters:
    '/chapters',

  practice:
    '/practice',

  exams: '/exams',

  leaderboard:
    '/leaderboard',

  progress:
    '/progress',

  profile:
    '/profile',

  settings:
    '/settings',

  notifications:
    '/notifications',

  community:
    '/community',

  aiAssistant:
    '/ai-assistant',

  premium:
    '/premium',

  admin: '/admin',

  about:
    '/about',

  contact:
    '/contact',

  privacyPolicy:
    '/privacy-policy',

  terms:
    '/terms',
} as const;

export const USER_ROLES = {
  student:
    'student',

  moderator:
    'moderator',

  admin: 'admin',

  superAdmin:
    'super_admin',
} as const;

export const EDUCATION_LEVELS = [
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'SSC',
  'HSC',
  'Admission',
  'Honours',
  'Masters',
] as const;

export const SUBJECT_LEVELS = [
  'school',
  'college',
  'university',
  'admission',
] as const;

export const SUBJECT_STATUS = [
  'active',
  'draft',
  'archived',
] as const;

export const EXAM_STATUS = [
  'upcoming',
  'running',
  'completed',
  'cancelled',
] as const;

export const QUESTION_TYPES = [
  'mcq',
  'written',
  'boolean',
  'creative',
] as const;

export const NOTIFICATION_TYPES = [
  'practice',
  'exam',
  'leaderboard',
  'community',
  'system',
  'payment',
] as const;

export const THEME_OPTIONS = [
  'light',
  'dark',
  'system',
] as const;

export const AI_MODELS = {
  basic:
    'gpt-basic',

  smart:
    'gpt-smart',

  premium:
    'gpt-premium',
} as const;

export const PREMIUM_FEATURES = [
  'Unlimited AI assistance',
  'Advanced analytics',
  'Premium mock exams',
  'Weak topic detection',
  'Smart recommendations',
  'Leaderboard boosts',
] as const;

export const API_LIMITS = {
  freeAiMessages:
    20,

  premiumAiMessages:
    9999,

  maxPracticeQuestions:
    200,

  maxExamDuration:
    180,

  maxUploadSizeMb:
    10,
} as const;

export const LEADERBOARD_LIMITS = {
  topUsers:
    100,

  weeklyWinners:
    10,
} as const;

export const PAGINATION = {
  defaultPage:
    1,

  defaultLimit:
    20,

  maxLimit:
    100,
} as const;

export const DATE_FORMATS = {
  short:
    'dd MMM yyyy',

  long:
    'dd MMMM yyyy',

  time:
    'hh:mm a',

  full:
    'dd MMM yyyy, hh:mm a',
} as const;

export const SOCIAL_LINKS = {
  facebook:
    'https://facebook.com/bep.top',

  youtube:
    'https://youtube.com/@bep.top',

  linkedin:
    'https://linkedin.com/company/bep-top',

  instagram:
    'https://instagram.com/bep.top',
} as const;

export const EMPTY_STATES = {
  noSubjects:
    'কোনো subject পাওয়া যায়নি।',

  noQuestions:
    'কোনো question available নেই।',

  noNotifications:
    'নতুন notification নেই।',

  noLeaderboard:
    'Leaderboard data পাওয়া যায়নি।',

  noCommunityPosts:
    'এখনও কোনো community post নেই।',
} as const;

export const SUCCESS_MESSAGES = {
  profileUpdated:
    'Profile successfully updated.',

  passwordChanged:
    'Password successfully changed.',

  practiceCompleted:
    'Practice completed successfully.',

  examSubmitted:
    'Exam submitted successfully.',

  paymentSuccess:
    'Payment completed successfully.',
} as const;

export const ERROR_MESSAGES = {
  somethingWentWrong:
    'Something went wrong.',

  unauthorized:
    'Unauthorized access.',

  networkError:
    'Network error detected.',

  invalidCredentials:
    'Invalid email or password.',

  accessDenied:
    'Access denied.',

  uploadFailed:
    'File upload failed.',
} as const;

export const ANIMATION_DURATION = {
  fast: 0.15,

  normal: 0.25,

  slow: 0.4,
} as const;

export const Z_INDEX = {
  dropdown:
    1000,

  sticky:
    1020,

  fixed:
    1030,

  modalBackdrop:
    1040,

  modal:
    1050,

  toast:
    1100,
} as const;

export default {
  APP_NAME,
  APP_FULL_NAME,
  APP_TAGLINE,
  APP_DESCRIPTION,
  APP_VERSION,
  ROUTES,
  STORAGE_KEYS,
};
