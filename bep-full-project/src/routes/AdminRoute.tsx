import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore, selectIsAdmin } from '@/store/auth.store'
import { ROUTES } from '@/lib/constants'
import { LoadingScreen } from '@/components/common/LoadingScreen'

/**
 * Requires admin or superadmin role.
 * Non-admins are redirected to dashboard.
 */
export function AdminRoute() {
  const { status } = useAuthStore()
  const isAdmin = useAuthStore(selectIsAdmin)

  if (status === 'idle' || status === 'loading') {
    return <LoadingScreen />
  }

  if (status === 'unauthenticated') {
    return <Navigate to={ROUTES.AUTH} replace />
  }

  if (!isAdmin) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <Outlet />
}
