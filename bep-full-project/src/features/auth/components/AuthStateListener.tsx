import { useAuthState } from '@/hooks/useAuthState'

/** Mounts auth listener — rendered once in Providers */
export function AuthStateListener() {
  useAuthState()
  return null
}
