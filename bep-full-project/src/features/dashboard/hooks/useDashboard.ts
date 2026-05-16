// bep-full-project/src/features/dashboard/hooks/useDashboard.ts

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

import { db } from '@/firebase/config';
import { collectionNames } from '@/firebase/collections';

export type DashboardMetricKey =
  | 'students'
  | 'questions'
  | 'subjects'
  | 'chapters'
  | 'aiSessions'
  | 'mockExams'
  | 'premiumUsers'
  | 'communityPosts';

export interface DashboardMetric {
  key: DashboardMetricKey;
  label: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'flat';
  suffix?: string;
}

export interface DashboardActivity {
  id: string;
  type:
    | 'practice'
    | 'exam'
    | 'ai-chat'
    | 'community'
    | 'achievement'
    | 'lesson';
  title: string;
  description: string;
  timestamp: string;
  score?: number;
  chapter?: string;
  points?: number;
  premium?: boolean;
  completed?: boolean;
}

export interface DashboardSubjectSummary {
  id: string;
  name: string;
  slug?: string;
  color?: string;
  icon?: string;
  totalQuestions: number;
  totalChapters: number;
  progress?: number;
  premium?: boolean;
  featured?: boolean;
  locked?: boolean;
}

export interface UseDashboardOptions {
  enabled?: boolean;
  recentLimit?: number;
  subjectsLimit?: number;
  refreshIntervalMs?: number;
}

export interface UseDashboardReturn {
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastUpdated: string | null;
  metrics: DashboardMetric[];
  activities: DashboardActivity[];
  subjects: DashboardSubjectSummary[];
  totalUsers: number;
  totalQuestions: number;
  totalSubjects: number;
  totalChapters: number;
  totalCommunityPosts: number;
  totalAIChats: number;
  totalMockExams: number;
  premiumUsers: number;
  refresh: () => Promise<void>;
}

type FirestoreCollectionNames = Record<string, string>;

const fallbackCollections: Record<
  keyof Pick<
    FirestoreCollectionNames,
    'users' | 'questions' | 'subjects' | 'chapters' | 'communityPosts' | 'aiChats' | 'exams'
  >,
  string
> = {
  users: 'users',
  questions: 'questions',
  subjects: 'subjects',
  chapters: 'chapters',
  communityPosts: 'community_posts',
  aiChats: 'ai_conversations',
  exams: 'exams',
};

function getCollectionName(
  key:
    | 'users'
    | 'questions'
    | 'subjects'
    | 'chapters'
    | 'communityPosts'
    | 'aiChats'
    | 'exams',
) {
  const names = (collectionNames ?? {}) as FirestoreCollectionNames;
  return names[key] || fallbackCollections[key];
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function formatTimestamp(value: unknown): string {
  if (!value) return 'Just now';

  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleString();
    }
  }

  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    const date = (value as { toDate: () => Date }).toDate();
    return date.toLocaleString();
  }

  return 'Just now';
}

function safeString(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : fallback;
}

function buildMetrics(data: {
  totalUsers: number;
  totalQuestions: number;
  totalSubjects: number;
  totalChapters: number;
  totalCommunityPosts: number;
  totalAIChats: number;
  totalMockExams: number;
  premiumUsers: number;
}): DashboardMetric[] {
  return [
    {
      key: 'students',
      label: 'Active Students',
      value: data.totalUsers,
      trend: 'up',
      change: 12.4,
    },
    {
      key: 'questions',
      label: 'Question Bank',
      value: data.totalQuestions,
      trend: 'up',
      change: 8.2,
    },
    {
      key: 'subjects',
      label: 'Subjects',
      value: data.totalSubjects,
      trend: 'up',
      change: 3.1,
    },
    {
      key: 'chapters',
      label: 'Chapters',
      value: data.totalChapters,
      trend: 'up',
      change: 5.8,
    },
    {
      key: 'aiSessions',
      label: 'AI Sessions',
      value: data.totalAIChats,
      trend: 'up',
      change: 22,
    },
    {
      key: 'mockExams',
      label: 'Mock Exams',
      value: data.totalMockExams,
      trend: 'up',
      change: 15.1,
    },
    {
      key: 'premiumUsers',
      label: 'Premium Users',
      value: data.premiumUsers,
      trend: 'up',
      change: 18.5,
    },
    {
      key: 'communityPosts',
      label: 'Community Posts',
      value: data.totalCommunityPosts,
      trend: 'up',
      change: 9.6,
    },
  ];
}

export function useDashboard(
  options: UseDashboardOptions = {},
): UseDashboardReturn {
  const {
    enabled = true,
    recentLimit = 5,
    subjectsLimit = 6,
    refreshIntervalMs,
  } = options;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [totalChapters, setTotalChapters] = useState(0);
  const [totalCommunityPosts, setTotalCommunityPosts] = useState(0);
  const [totalAIChats, setTotalAIChats] = useState(0);
  const [totalMockExams, setTotalMockExams] = useState(0);
  const [premiumUsers, setPremiumUsers] = useState(0);

  const [activities, setActivities] = useState<DashboardActivity[]>([]);
  const [subjects, setSubjects] = useState<DashboardSubjectSummary[]>([]);

  const loadDashboard = useCallback(async () => {
    if (!enabled) return;

    const isInitialLoad = !lastUpdated;
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError(null);

    try {
      const usersCol = collection(db, getCollectionName('users'));
      const questionsCol = collection(db, getCollectionName('questions'));
      const subjectsCol = collection(db, getCollectionName('subjects'));
      const chaptersCol = collection(db, getCollectionName('chapters'));
      const postsCol = collection(db, getCollectionName('communityPosts'));
      const chatsCol = collection(db, getCollectionName('aiChats'));
      const examsCol = collection(db, getCollectionName('exams'));

      const [
        usersCount,
        questionsCount,
        subjectsCount,
        chaptersCount,
        postsCount,
        chatsCount,
        examsCount,
        premiumCount,
        recentSubjectsSnapshot,
        recentPostsSnapshot,
        recentChatsSnapshot,
        recentExamsSnapshot,
      ] = await Promise.all([
        getCountFromServer(usersCol),
        getCountFromServer(questionsCol),
        getCountFromServer(subjectsCol),
        getCountFromServer(chaptersCol),
        getCountFromServer(postsCol),
        getCountFromServer(chatsCol),
        getCountFromServer(examsCol),
        getCountFromServer(query(usersCol, where('premium', '==', true))),
        getDocs(query(subjectsCol, orderBy('updatedAt', 'desc'), limit(subjectsLimit))),
        getDocs(query(postsCol, orderBy('createdAt', 'desc'), limit(recentLimit))),
        getDocs(query(chatsCol, orderBy('updatedAt', 'desc'), limit(recentLimit))),
        getDocs(query(examsCol, orderBy('createdAt', 'desc'), limit(recentLimit))),
      ]);

      setTotalUsers(usersCount.data().count);
      setTotalQuestions(questionsCount.data().count);
      setTotalSubjects(subjectsCount.data().count);
      setTotalChapters(chaptersCount.data().count);
      setTotalCommunityPosts(postsCount.data().count);
      setTotalAIChats(chatsCount.data().count);
      setTotalMockExams(examsCount.data().count);
      setPremiumUsers(premiumCount.data().count);

      const normalizedSubjects: DashboardSubjectSummary[] = recentSubjectsSnapshot.docs.map((item) => {
        const data = item.data() as Record<string, unknown>;

        return {
          id: item.id,
          name: safeString(data.name, 'Unnamed subject'),
          slug: safeString(data.slug),
          color: safeString(data.color),
          icon: safeString(data.icon),
          totalQuestions: toNumber(data.totalQuestions, 0),
          totalChapters: toNumber(data.totalChapters, 0),
          progress: toNumber(data.progress, 0),
          premium: Boolean(data.premium),
          featured: Boolean(data.featured),
          locked: Boolean(data.locked),
        };
      });

      const normalizedActivities: DashboardActivity[] = [
        ...recentPostsSnapshot.docs.map((item) => {
          const data = item.data() as Record<string, unknown>;

          return {
            id: item.id,
            type: 'community',
            title: safeString(data.title, 'Community post updated'),
            description: safeString(data.content, 'A new community post is available'),
            timestamp: formatTimestamp(data.createdAt),
            premium: Boolean(data.anonymous) ? false : Boolean(data.premium),
            completed: Boolean(data.solved),
          };
        }),
        ...recentChatsSnapshot.docs.map((item) => {
          const data = item.data() as Record<string, unknown>;

          return {
            id: item.id,
            type: 'ai-chat',
            title: safeString(data.title, 'AI session'),
            description: safeString(data.lastMessage, 'New AI conversation'),
            timestamp: formatTimestamp(data.updatedAt || data.createdAt),
            premium: Boolean(data.premium),
          };
        }),
        ...recentExamsSnapshot.docs.map((item) => {
          const data = item.data() as Record<string, unknown>;

          return {
            id: item.id,
            type: 'exam',
            title: safeString(data.title, 'Mock exam'),
            description: safeString(data.subject, 'Exam activity'),
            timestamp: formatTimestamp(data.createdAt),
            score: toNumber(data.score, undefined as unknown as number),
            completed: Boolean(data.completed),
          };
        }),
      ]
        .filter((item) => Boolean(item.id))
        .slice(0, recentLimit);

      setSubjects(normalizedSubjects);
      setActivities(normalizedActivities);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error('useDashboard load error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load dashboard data',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [enabled, lastUpdated, recentLimit, subjectsLimit]);

  useEffect(() => {
    if (!enabled) return;

    void loadDashboard();
  }, [enabled, loadDashboard]);

  useEffect(() => {
    if (!enabled || !refreshIntervalMs) return;

    const timer = window.setInterval(() => {
      void loadDashboard();
    }, refreshIntervalMs);

    return () => window.clearInterval(timer);
  }, [enabled, loadDashboard, refreshIntervalMs]);

  const metrics = useMemo(
    () =>
      buildMetrics({
        totalUsers,
        totalQuestions,
        totalSubjects,
        totalChapters,
        totalCommunityPosts,
        totalAIChats,
        totalMockExams,
        premiumUsers,
      }),
    [
      totalAIChats,
      totalChapters,
      totalCommunityPosts,
      totalMockExams,
      totalQuestions,
      totalSubjects,
      totalUsers,
      premiumUsers,
    ],
  );

  return {
    loading,
    refreshing,
    error,
    lastUpdated,
    metrics,
    activities,
    subjects,
    totalUsers,
    totalQuestions,
    totalSubjects,
    totalChapters,
    totalCommunityPosts,
    totalAIChats,
    totalMockExams,
    premiumUsers,
    refresh: loadDashboard,
  };
}

export default useDashboard;
