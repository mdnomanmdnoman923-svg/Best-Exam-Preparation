import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { AuthUser, AuthStatus } from '@/types/auth.types'
import type { UserRole } from '@/types/profile.types'

interface AuthState {
  user: AuthUser | null
  role: UserRole | null
  status: AuthStatus
  // Actions
  setUser: (user: AuthUser | null) => void
  setRole: (role: UserRole | null) => void
  setStatus: (status: AuthStatus) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      role: null,
      status: 'idle',

      setUser: (user) => set({ user }, false, 'auth/setUser'),
      setRole: (role) => set({ role }, false, 'auth/setRole'),
      setStatus: (status) => set({ status }, false, 'auth/setStatus'),
      reset: () => set({ user: null, role: null, status: 'unauthenticated' }, false, 'auth/reset'),
    }),
    { name: 'AuthStore' }
  )
)

// Derived selectors
export const selectIsAdmin = (state: AuthState) =>
  state.role?.role === 'admin' || state.role?.role === 'superadmin'

export const selectIsAuthenticated = (state: AuthState) =>
  state.status === 'authenticated' && state.user !== null
