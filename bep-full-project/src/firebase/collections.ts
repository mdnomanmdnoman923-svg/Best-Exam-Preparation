// bep-full-project/src/firebase/collections.ts

export const collectionNames = {
  users: 'users',

  profiles: 'profiles',

  subjects: 'subjects',

  chapters: 'chapters',

  questions: 'questions',

  questionAttempts:
    'questionAttempts',

  practiceSessions:
    'practiceSessions',

  exams: 'exams',

  examAttempts:
    'examAttempts',

  bookmarks: 'bookmarks',

  weakTopics:
    'weakTopics',

  progress: 'progress',

  leaderboard:
    'leaderboard',

  notifications:
    'notifications',

  aiChats: 'aiChats',

  aiMessages:
    'aiMessages',

  communityPosts:
    'communityPosts',

  communityReplies:
    'communityReplies',

  reports: 'reports',

  analytics:
    'analytics',

  settings: 'settings',

  subscriptions:
    'subscriptions',

  payments: 'payments',

  coupons: 'coupons',

  batches: 'batches',

  classes: 'classes',

  studyPlans:
    'studyPlans',

  studyStreaks:
    'studyStreaks',

  achievements:
    'achievements',

  badges: 'badges',

  activityLogs:
    'activityLogs',

  supportTickets:
    'supportTickets',

  adminLogs:
    'adminLogs',

  appConfigs:
    'appConfigs',

  featureFlags:
    'featureFlags',

  uploads: 'uploads',
} as const;

export type CollectionName =
  keyof typeof collectionNames;

export type CollectionValue =
  (typeof collectionNames)[CollectionName];

export function getCollectionName(
  key: CollectionName,
): CollectionValue {
  return collectionNames[key];
}

export default collectionNames;
