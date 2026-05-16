import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { AdminRoute } from '@/routes/AdminRoute'
import { AppShell } from '@/components/layout/AppShell'
import { PublicShell } from '@/components/layout/PublicShell'
import { ROUTES } from '@/lib/constants'

// Lazy-load pages for code splitting
const HomePage             = lazy(() => import('@/pages/public/HomePage'))
const AuthPage             = lazy(() => import('@/pages/public/AuthPage'))
const PricingPage          = lazy(() => import('@/pages/public/PricingPage'))
const CompleteProfilePage  = lazy(() => import('@/pages/protected/CompleteProfilePage'))
const DashboardPage        = lazy(() => import('@/pages/protected/DashboardPage'))
const QuestionBankPage     = lazy(() => import('@/pages/protected/QuestionBankPage'))
const PracticePage         = lazy(() => import('@/pages/protected/PracticePage'))
const ExamPage             = lazy(() => import('@/pages/protected/ExamPage'))
const MockTestsPage        = lazy(() => import('@/pages/protected/MockTestsPage'))
const HistoryPage          = lazy(() => import('@/pages/protected/HistoryPage'))
const ProgressPage         = lazy(() => import('@/pages/protected/ProgressPage'))
const LeaderboardPage      = lazy(() => import('@/pages/protected/LeaderboardPage'))
const CommunityPage        = lazy(() => import('@/pages/protected/CommunityPage'))
const AiAssistantPage      = lazy(() => import('@/pages/protected/AiAssistantPage'))
const SettingsPage         = lazy(() => import('@/pages/protected/SettingsPage'))
const ProfileUpdatePage    = lazy(() => import('@/pages/protected/ProfileUpdatePage'))
const ChangePasswordPage   = lazy(() => import('@/pages/protected/ChangePasswordPage'))
const AdminDashboardPage   = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminProfilesPage    = lazy(() => import('@/pages/admin/AdminProfilesPage'))
const AdminSubjectsPage    = lazy(() => import('@/pages/admin/AdminSubjectsPage'))
const AdminChaptersPage    = lazy(() => import('@/pages/admin/AdminChaptersPage'))
const AdminQuestionsPage   = lazy(() => import('@/pages/admin/AdminQuestionsPage'))
const AdminContentPage     = lazy(() => import('@/pages/admin/AdminContentPage'))
const AdminSettingsPage    = lazy(() => import('@/pages/admin/AdminSettingsPage'))

const S = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
)

const router = createBrowserRouter([
  {
    element: <PublicShell />,
    children: [
      { path: ROUTES.HOME,    element: <S><HomePage /></S> },
      { path: ROUTES.AUTH,    element: <S><AuthPage /></S> },
      { path: ROUTES.PRICING, element: <S><PricingPage /></S> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: ROUTES.COMPLETE_PROFILE, element: <S><CompleteProfilePage /></S> },
      {
        element: <AppShell />,
        children: [
          { path: ROUTES.DASHBOARD,    element: <S><DashboardPage /></S> },
          { path: ROUTES.QUESTION_BANK,element: <S><QuestionBankPage /></S> },
          { path: ROUTES.PRACTICE,     element: <S><PracticePage /></S> },
          { path: ROUTES.EXAM,         element: <S><ExamPage /></S> },
          { path: ROUTES.MOCK_TESTS,   element: <S><MockTestsPage /></S> },
          { path: ROUTES.HISTORY,      element: <S><HistoryPage /></S> },
          { path: ROUTES.PROGRESS,     element: <S><ProgressPage /></S> },
          { path: ROUTES.LEADERBOARD,  element: <S><LeaderboardPage /></S> },
          { path: ROUTES.COMMUNITY,    element: <S><CommunityPage /></S> },
          { path: ROUTES.AI_ASSISTANT, element: <S><AiAssistantPage /></S> },
          { path: ROUTES.SETTINGS,     element: <S><SettingsPage /></S> },
          { path: ROUTES.PROFILE_UPDATE,   element: <S><ProfileUpdatePage /></S> },
          { path: ROUTES.CHANGE_PASSWORD,  element: <S><ChangePasswordPage /></S> },
          {
            element: <AdminRoute />,
            children: [
              { path: ROUTES.ADMIN_DASHBOARD, element: <S><AdminDashboardPage /></S> },
              { path: ROUTES.ADMIN_PROFILES,  element: <S><AdminProfilesPage /></S> },
              { path: ROUTES.ADMIN_SUBJECTS,  element: <S><AdminSubjectsPage /></S> },
              { path: ROUTES.ADMIN_CHAPTERS,  element: <S><AdminChaptersPage /></S> },
              { path: ROUTES.ADMIN_QUESTIONS, element: <S><AdminQuestionsPage /></S> },
              { path: ROUTES.ADMIN_CONTENT,   element: <S><AdminContentPage /></S> },
              { path: ROUTES.ADMIN_SETTINGS,  element: <S><AdminSettingsPage /></S> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <S><HomePage /></S> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
