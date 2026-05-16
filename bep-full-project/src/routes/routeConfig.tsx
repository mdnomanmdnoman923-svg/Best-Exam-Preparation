// src/routes/routeConfig.tsx

import React, { lazy, Suspense } from 'react';
import {
  Navigate,
  RouteObject,
} from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

import LoadingScreen from '@/components/common/LoadingScreen';

const HomePage = lazy(
  () => import('@/pages/public/HomePage'),
);

const AboutPage = lazy(
  () => import('@/pages/public/AboutPage'),
);

const ContactPage = lazy(
  () => import('@/pages/public/ContactPage'),
);

const PrivacyPolicyPage = lazy(
  () => import('@/pages/public/PrivacyPolicyPage'),
);

const TermsPage = lazy(
  () => import('@/pages/public/TermsPage'),
);

const LoginPage = lazy(
  () => import('@/pages/auth/LoginPage'),
);

const RegisterPage = lazy(
  () => import('@/pages/auth/RegisterPage'),
);

const ForgotPasswordPage = lazy(
  () =>
    import(
      '@/pages/auth/ForgotPasswordPage'
    ),
);

const DashboardPage = lazy(
  () =>
    import(
      '@/pages/dashboard/DashboardPage'
    ),
);

const SubjectsPage = lazy(
  () =>
    import(
      '@/pages/dashboard/SubjectsPage'
    ),
);

const SubjectDetailsPage = lazy(
  () =>
    import(
      '@/pages/dashboard/SubjectDetailsPage'
    ),
);

const ChapterDetailsPage = lazy(
  () =>
    import(
      '@/pages/dashboard/ChapterDetailsPage'
    ),
);

const PracticePage = lazy(
  () =>
    import(
      '@/pages/practice/PracticePage'
    ),
);

const MockExamPage = lazy(
  () =>
    import(
      '@/pages/exams/MockExamPage'
    ),
);

const AnalyticsPage = lazy(
  () =>
    import(
      '@/pages/dashboard/AnalyticsPage'
    ),
);

const CommunityPage = lazy(
  () =>
    import(
      '@/pages/community/CommunityPage'
    ),
);

const CommunityPostPage = lazy(
  () =>
    import(
      '@/pages/community/CommunityPostPage'
    ),
);

const LeaderboardPage = lazy(
  () =>
    import(
      '@/pages/leaderboard/LeaderboardPage'
    ),
);

const ProfilePage = lazy(
  () =>
    import(
      '@/pages/profile/ProfilePage'
    ),
);

const SettingsPage = lazy(
  () =>
    import(
      '@/pages/settings/SettingsPage'
    ),
);

const PremiumPage = lazy(
  () =>
    import(
      '@/pages/premium/PremiumPage'
    ),
);

const AdminDashboardPage = lazy(
  () =>
    import(
      '@/pages/admin/AdminDashboardPage'
    ),
);

const AdminSubjectsPage = lazy(
  () =>
    import(
      '@/pages/admin/AdminSubjectsPage'
    ),
);

const AdminQuestionsPage = lazy(
  () =>
    import(
      '@/pages/admin/AdminQuestionsPage'
    ),
);

const AdminUsersPage = lazy(
  () =>
    import(
      '@/pages/admin/AdminUsersPage'
    ),
);

const AdminCMSPage = lazy(
  () =>
    import('@/pages/admin/AdminCMSPage'),
);

const NotFoundPage = lazy(
  () =>
    import('@/pages/system/NotFoundPage'),
);

function PageLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={<LoadingScreen />}
    >
      {children}
    </Suspense>
  );
}

export interface AppRouteMeta {
  title: string;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
  showInSidebar?: boolean;
  showInNavbar?: boolean;
  premium?: boolean;
}

export interface AppRouteConfig
  extends RouteObject {
  meta?: AppRouteMeta;
}

export const publicRoutes: AppRouteConfig[] =
  [
    {
      path: '/',
      element: (
        <PageLoader>
          <HomePage />
        </PageLoader>
      ),
      meta: {
        title: 'BEP Home',
        showInNavbar: true,
      },
    },

    {
      path: '/about',
      element: (
        <PageLoader>
          <AboutPage />
        </PageLoader>
      ),
      meta: {
        title: 'About BEP',
        showInNavbar: true,
      },
    },

    {
      path: '/contact',
      element: (
        <PageLoader>
          <ContactPage />
        </PageLoader>
      ),
      meta: {
        title: 'Contact',
        showInNavbar: true,
      },
    },

    {
      path: '/privacy-policy',
      element: (
        <PageLoader>
          <PrivacyPolicyPage />
        </PageLoader>
      ),
      meta: {
        title: 'Privacy Policy',
      },
    },

    {
      path: '/terms',
      element: (
        <PageLoader>
          <TermsPage />
        </PageLoader>
      ),
      meta: {
        title: 'Terms & Conditions',
      },
    },

    {
      path: '/login',
      element: (
        <PageLoader>
          <LoginPage />
        </PageLoader>
      ),
      meta: {
        title: 'Login',
      },
    },

    {
      path: '/register',
      element: (
        <PageLoader>
          <RegisterPage />
        </PageLoader>
      ),
      meta: {
        title: 'Register',
      },
    },

    {
      path: '/forgot-password',
      element: (
        <PageLoader>
          <ForgotPasswordPage />
        </PageLoader>
      ),
      meta: {
        title: 'Forgot Password',
      },
    },
  ];

export const protectedRoutes: AppRouteConfig[] =
  [
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <PageLoader>
            <DashboardPage />
          </PageLoader>
        </ProtectedRoute>
      ),
      meta: {
        title: 'Dashboard',
        requiresAuth: true,
        showInSidebar: true,
      },
    },

    {
      path: '/subjects',
      element: (
        <ProtectedRoute>
          <PageLoader>
            <SubjectsPage />
          </PageLoader>
        </ProtectedRoute>
      ),
      meta: {
        title: 'Subjects',
        requiresAuth: true,
        showInSidebar: true,
      },
    },

    {
      path: '/subjects/:subjectId',
      element: (
        <ProtectedRoute>
          <PageLoader>
            <SubjectDetailsPage />
          </PageLoader>
        </ProtectedRoute>
      ),
      meta: {
        title: 'Subject Details',
        requiresAuth: true,
      },
    },

    {
      path: '/chapters/:chapterId',
      element: (
        <ProtectedRoute>
          <PageLoader>
            <ChapterDetailsPage />
          </PageLoader>
        </ProtectedRoute>
      ),
      meta: {
        title: 'Chapter',
        requiresAuth: true,
      },
    },

    {
      path: '/practice',
      element: (
        <ProtectedRoute>
          <PageLoader>
            <PracticePage />
          </PageLoader>
        </ProtectedRoute>
      ),
      meta: {
        title: 'Practice',
        requiresAuth: true,
        showInSidebar: true,
      },
    },

    {
      path: '/mock-exams',
      element: (
        <ProtectedRoute>
          <PageLoader>
            <MockExamPage />
          </PageLoader>
        </ProtectedRoute>
      ),
      meta: {
        title: 'Mock Exams',
        requiresAuth: true,
        showInSidebar: true,
      },
    },

    {
      path: '/analytics',
      element: (
        <ProtectedRoute>
          <PageLoader>
            <AnalyticsPage />
          </PageLoader>
        </ProtectedRoute>
      ),
      meta: {
        title: 'Analytics',
        requiresAuth: true,
        showInSidebar: true,
      },
    },

    {
      path: '/community',
      element: (
        <ProtectedRoute>
          <PageLoader>
            <CommunityPage />
          </PageLoader>
        </ProtectedRoute>
      ),
      meta: {
        title: 'Community',
        requiresAuth: true,
        showInSidebar: true,
      },
    },

    {
      path: '/community/:postId',
      element: (
        <ProtectedRoute>
          <PageLoader>
            <CommunityPostPage />
          </PageLoader>
        </ProtectedRoute>
      ),
      meta: {
        title: 'Community Post',
        requiresAuth: true,
      },
    },

    {
      path: '/leaderboard',
      element: (
        <ProtectedRoute>
          <PageLoader>
            <LeaderboardPage />
          </PageLoader>
        </ProtectedRoute>
      ),
      meta: {
        title: 'Leaderboard',
        requiresAuth: true,
        showInSidebar: true,
      },
    },

    {
      path: '/profile',
      element: (
        <ProtectedRoute>
          <PageLoader>
            <ProfilePage />
          </PageLoader>
        </ProtectedRoute>
      ),
      meta: {
        title: 'Profile',
        requiresAuth: true,
      },
    },

    {
      path: '/settings',
      element: (
        <ProtectedRoute>
          <PageLoader>
            <SettingsPage />
          </PageLoader>
        </ProtectedRoute>
      ),
      meta: {
        title: 'Settings',
        requiresAuth: true,
      },
    },

    {
      path: '/premium',
      element: (
        <ProtectedRoute>
          <PageLoader>
            <PremiumPage />
          </PageLoader>
        </ProtectedRoute>
      ),
      meta: {
        title: 'Premium',
        requiresAuth: true,
        premium: true,
      },
    },
  ];

export const adminRoutes: AppRouteConfig[] =
  [
    {
      path: '/admin',
      element: (
        <AdminRoute>
          <PageLoader>
            <AdminDashboardPage />
          </PageLoader>
        </AdminRoute>
      ),
      meta: {
        title: 'Admin Dashboard',
        requiresAuth: true,
        requiresAdmin: true,
      },
    },

    {
      path: '/admin/subjects',
      element: (
        <AdminRoute>
          <PageLoader>
            <AdminSubjectsPage />
          </PageLoader>
        </AdminRoute>
      ),
      meta: {
        title: 'Manage Subjects',
        requiresAuth: true,
        requiresAdmin: true,
      },
    },

    {
      path: '/admin/questions',
      element: (
        <AdminRoute>
          <PageLoader>
            <AdminQuestionsPage />
          </PageLoader>
        </AdminRoute>
      ),
      meta: {
        title: 'Manage Questions',
        requiresAuth: true,
        requiresAdmin: true,
      },
    },

    {
      path: '/admin/users',
      element: (
        <AdminRoute>
          <PageLoader>
            <AdminUsersPage />
          </PageLoader>
        </AdminRoute>
      ),
      meta: {
        title: 'Manage Users',
        requiresAuth: true,
        requiresAdmin: true,
      },
    },

    {
      path: '/admin/cms',
      element: (
        <AdminRoute>
          <PageLoader>
            <AdminCMSPage />
          </PageLoader>
        </AdminRoute>
      ),
      meta: {
        title: 'CMS',
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
  ];

export const systemRoutes: AppRouteConfig[] =
  [
    {
      path: '/404',
      element: (
        <PageLoader>
          <NotFoundPage />
        </PageLoader>
      ),
      meta: {
        title: 'Not Found',
      },
    },

    {
      path: '*',
      element: (
        <Navigate
          to="/404"
          replace
        />
      ),
    },
  ];

export const routeConfig: AppRouteConfig[] =
  [
    ...publicRoutes,
    ...protectedRoutes,
    ...adminRoutes,
    ...systemRoutes,
  ];

export default routeConfig;
