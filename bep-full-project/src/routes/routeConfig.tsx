// bep-full-project/src/routes/routeConfig.tsx

import React, { lazy } from 'react';
import {
  BookOpen,
  Brain,
  Crown,
  Gauge,
  GraduationCap,
  History,
  LayoutDashboard,
  Layers3,
  LineChart,
  Lock,
  MessageCircle,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  Wand2,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */

/**
 * Public Pages
 */
const HomePage = lazy(() => import('@/pages/public/HomePage'));
const AuthPage = lazy(() => import('@/pages/public/AuthPage'));
const PricingPage = lazy(() => import('@/pages/public/PricingPage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const PrivacyPolicyPage = lazy(
  () => import('@/pages/public/PrivacyPolicyPage'),
);
const TermsPage = lazy(() => import('@/pages/public/TermsPage'));

/**
 * Protected Pages
 */
const DashboardPage = lazy(
  () => import('@/pages/protected/DashboardPage'),
);

const QuestionBankPage = lazy(
  () => import('@/pages/protected/QuestionBankPage'),
);

const PracticePage = lazy(
  () => import('@/pages/protected/PracticePage'),
);

const MockTestsPage = lazy(
  () => import('@/pages/protected/MockTestsPage'),
);

const ProgressPage = lazy(
  () => import('@/pages/protected/ProgressPage'),
);

const HistoryPage = lazy(
  () => import('@/pages/protected/HistoryPage'),
);

const LeaderboardPage = lazy(
  () => import('@/pages/protected/LeaderboardPage'),
);

const CommunityPage = lazy(
  () => import('@/pages/protected/CommunityPage'),
);

const AiAssistantPage = lazy(
  () => import('@/pages/protected/AiAssistantPage'),
);

const SettingsPage = lazy(
  () => import('@/pages/protected/SettingsPage'),
);

const ProfileUpdatePage = lazy(
  () => import('@/pages/protected/ProfileUpdatePage'),
);

const CompleteProfilePage = lazy(
  () => import('@/pages/protected/CompleteProfilePage'),
);

const ChangePasswordPage = lazy(
  () => import('@/pages/protected/ChangePasswordPage'),
);

const ExamPage = lazy(
  () => import('@/pages/protected/ExamPage'),
);

/**
 * Admin Pages
 */
const AdminDashboardPage = lazy(
  () => import('@/pages/admin/AdminDashboardPage'),
);

const AdminProfilesPage = lazy(
  () => import('@/pages/admin/AdminProfilesPage'),
);

const AdminQuestionsPage = lazy(
  () => import('@/pages/admin/AdminQuestionsPage'),
);

const AdminSubjectsPage = lazy(
  () => import('@/pages/admin/AdminSubjectsPage'),
);

const AdminChaptersPage = lazy(
  () => import('@/pages/admin/AdminChaptersPage'),
);

const AdminContentPage = lazy(
  () => import('@/pages/admin/AdminContentPage'),
);

const AdminSettingsPage = lazy(
  () => import('@/pages/admin/AdminSettingsPage'),
);

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface AppRoute {
  path: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  element: React.LazyExoticComponent<() => JSX.Element>;
  protected?: boolean;
  admin?: boolean;
  showInSidebar?: boolean;
  showInNavbar?: boolean;
  badge?: string;
}

/* -------------------------------------------------------------------------- */
/*                               Public Routes                                */
/* -------------------------------------------------------------------------- */

export const publicRoutes: AppRoute[] = [
  {
    path: '/',
    title: 'Home',
    description: 'Landing page for the BEP learning platform.',
    icon: <Sparkles className="h-4 w-4" />,
    element: HomePage,
    showInNavbar: true,
  },
  {
    path: '/auth',
    title: 'Authentication',
    description: 'Login and register page.',
    icon: <Lock className="h-4 w-4" />,
    element: AuthPage,
  },
  {
    path: '/pricing',
    title: 'Pricing',
    description: 'Subscription and premium plans.',
    icon: <Crown className="h-4 w-4" />,
    element: PricingPage,
    showInNavbar: true,
  },
  {
    path: '/about',
    title: 'About',
    description: 'Learn more about the BEP platform.',
    icon: <Users className="h-4 w-4" />,
    element: AboutPage,
    showInNavbar: true,
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy',
    description: 'Privacy and user data information.',
    icon: <ShieldCheck className="h-4 w-4" />,
    element: PrivacyPolicyPage,
  },
  {
    path: '/terms',
    title: 'Terms of Service',
    description: 'Terms, rules, and conditions.',
    icon: <BookOpen className="h-4 w-4" />,
    element: TermsPage,
  },
];

/* -------------------------------------------------------------------------- */
/*                              Protected Routes                              */
/* -------------------------------------------------------------------------- */

export const protectedRoutes: AppRoute[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    description: 'Overview of progress and activity.',
    icon: <LayoutDashboard className="h-4 w-4" />,
    element: DashboardPage,
    protected: true,
    showInSidebar: true,
  },
  {
    path: '/question-bank',
    title: 'Question Bank',
    description: 'Browse and practice questions.',
    icon: <BookOpen className="h-4 w-4" />,
    element: QuestionBankPage,
    protected: true,
    showInSidebar: true,
  },
  {
    path: '/practice',
    title: 'Practice',
    description: 'Topic-based practice sessions.',
    icon: <Target className="h-4 w-4" />,
    element: PracticePage,
    protected: true,
    showInSidebar: true,
  },
  {
    path: '/mock-tests',
    title: 'Mock Tests',
    description: 'Timed mock examinations.',
    icon: <GraduationCap className="h-4 w-4" />,
    element: MockTestsPage,
    protected: true,
    showInSidebar: true,
    badge: 'Popular',
  },
  {
    path: '/progress',
    title: 'Progress',
    description: 'Track learning analytics.',
    icon: <LineChart className="h-4 w-4" />,
    element: ProgressPage,
    protected: true,
    showInSidebar: true,
  },
  {
    path: '/history',
    title: 'History',
    description: 'Review past attempts and activity.',
    icon: <History className="h-4 w-4" />,
    element: HistoryPage,
    protected: true,
    showInSidebar: true,
  },
  {
    path: '/leaderboard',
    title: 'Leaderboard',
    description: 'Compare ranks and achievements.',
    icon: <Trophy className="h-4 w-4" />,
    element: LeaderboardPage,
    protected: true,
    showInSidebar: true,
  },
  {
    path: '/community',
    title: 'Community',
    description: 'Discuss and interact with learners.',
    icon: <MessageCircle className="h-4 w-4" />,
    element: CommunityPage,
    protected: true,
    showInSidebar: true,
  },
  {
    path: '/ai-assistant',
    title: 'AI Assistant',
    description: 'AI-powered study support.',
    icon: <Brain className="h-4 w-4" />,
    element: AiAssistantPage,
    protected: true,
    showInSidebar: true,
    badge: 'AI',
  },
  {
    path: '/exam/:examId',
    title: 'Exam',
    description: 'Take a live exam or mock test.',
    icon: <GraduationCap className="h-4 w-4" />,
    element: ExamPage,
    protected: true,
  },
  {
    path: '/settings',
    title: 'Settings',
    description: 'Manage account preferences.',
    icon: <Settings className="h-4 w-4" />,
    element: SettingsPage,
    protected: true,
    showInSidebar: true,
  },
  {
    path: '/profile/update',
    title: 'Update Profile',
    description: 'Edit account and profile information.',
    icon: <Users className="h-4 w-4" />,
    element: ProfileUpdatePage,
    protected: true,
  },
  {
    path: '/profile/complete',
    title: 'Complete Profile',
    description: 'Finish setting up your profile.',
    icon: <CheckCircleIcon />,
    element: CompleteProfilePage,
    protected: true,
  },
  {
    path: '/change-password',
    title: 'Change Password',
    description: 'Update account password.',
    icon: <Lock className="h-4 w-4" />,
    element: ChangePasswordPage,
    protected: true,
  },
];

/* -------------------------------------------------------------------------- */
/*                                Admin Routes                                */
/* -------------------------------------------------------------------------- */

export const adminRoutes: AppRoute[] = [
  {
    path: '/admin',
    title: 'Admin Dashboard',
    description: 'Admin overview and analytics.',
    icon: <Gauge className="h-4 w-4" />,
    element: AdminDashboardPage,
    protected: true,
    admin: true,
    showInSidebar: true,
  },
  {
    path: '/admin/profiles',
    title: 'Profiles',
    description: 'Manage user accounts and roles.',
    icon: <Users className="h-4 w-4" />,
    element: AdminProfilesPage,
    protected: true,
    admin: true,
    showInSidebar: true,
  },
  {
    path: '/admin/questions',
    title: 'Questions',
    description: 'Manage question bank content.',
    icon: <BookOpen className="h-4 w-4" />,
    element: AdminQuestionsPage,
    protected: true,
    admin: true,
    showInSidebar: true,
  },
  {
    path: '/admin/subjects',
    title: 'Subjects',
    description: 'Manage subjects and organization.',
    icon: <Layers3 className="h-4 w-4" />,
    element: AdminSubjectsPage,
    protected: true,
    admin: true,
    showInSidebar: true,
  },
  {
    path: '/admin/chapters',
    title: 'Chapters',
    description: 'Manage chapter structures.',
    icon: <BookOpen className="h-4 w-4" />,
    element: AdminChaptersPage,
    protected: true,
    admin: true,
    showInSidebar: true,
  },
  {
    path: '/admin/content',
    title: 'Content',
    description: 'Manage lessons and uploads.',
    icon: <FileContentIcon />,
    element: AdminContentPage,
    protected: true,
    admin: true,
    showInSidebar: true,
  },
  {
    path: '/admin/settings',
    title: 'Admin Settings',
    description: 'Control system configurations.',
    icon: <Settings className="h-4 w-4" />,
    element: AdminSettingsPage,
    protected: true,
    admin: true,
    showInSidebar: true,
  },
];

/* -------------------------------------------------------------------------- */
/*                              Combined Exports                              */
/* -------------------------------------------------------------------------- */

export const allRoutes: AppRoute[] = [
  ...publicRoutes,
  ...protectedRoutes,
  ...adminRoutes,
];

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

export function getSidebarRoutes() {
  return allRoutes.filter((route) => route.showInSidebar);
}

export function getNavbarRoutes() {
  return allRoutes.filter((route) => route.showInNavbar);
}

export function findRouteByPath(path: string) {
  return allRoutes.find((route) => route.path === path);
}

/* -------------------------------------------------------------------------- */
/*                              Internal Icons                                */
/* -------------------------------------------------------------------------- */

function CheckCircleIcon() {
  return <CheckCircle2 className="h-4 w-4" />;
}

function FileContentIcon() {
  return <FileTextIcon />;
}

function FileTextIcon() {
  return <BookOpen className="h-4 w-4" />;
}
