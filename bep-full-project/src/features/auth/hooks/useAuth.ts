import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore, selectIsAdmin, selectIsAuthenticated } from '@/store/auth.store'
import { useProfileStore } from '@/store/profile.store'
import { authService } from '@/services/auth.service'
import { ROUTES } from '@/lib/constants'

export function useAuth() {
  const { user, role, status } = useAuthStore()
  const { profile, education } = useProfileStore()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const isAdmin = useAuthStore(selectIsAdmin)
  const navigate = useNavigate()

  const logout = useCallback(async () => {
    try {
      await authService.signOut()
      useAuthStore.getState().reset()
      useProfileStore.getState().reset()
      navigate(ROUTES.AUTH, { replace: true })
      toast.success('সফলভাবে লগআউট হয়েছেন')
    } catch {
      toast.error('লগআউট ব্যর্থ হয়েছে')
    }
  }, [navigate])

  return {
    user,
    role,
    status,
    profile,
    education,
    isAuthenticated,
    isAdmin,
    isPremium: profile?.isPremium ?? false,
    isProfileComplete: profile?.isProfileComplete ?? false,
    logout,
  }
}
