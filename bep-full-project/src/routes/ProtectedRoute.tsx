import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { useProfileStore } from '@/store/profile.store'
import { ROUTES } from '@/lib/constants'
import { LoadingScreen } from '@/components/common/LoadingScreen'

/**
 * Requires authentication.
 * If authenticated but profile incomplete → redirect to /complete-profile
 * (except when already on /complete-profile)
 */
export function ProtectedRoute() {
  const { status } = useAuthStore()
  const { profile } = useProfileStore()
  const location = useLocation()

  if (status === 'idle' || status === 'loading') {
    return <LoadingScreen />
  }

  if (status === 'unauthenticated') {
    return <Navigate to={ROUTES.AUTH} state={{ from: location }} replace />
  }

  const isOnCompleteProfile = location.pathname === ROUTES.COMPLETE_PROFILE

  if (!profile?.isProfileComplete && !isOnCompleteProfile) {
    return <Navigate to={ROUTES.COMPLETE_PROFILE} replace />
  }

  return <Outlet />
}
