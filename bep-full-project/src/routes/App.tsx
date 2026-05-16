import { useAuthState } from '@/hooks/useAuthState'
import { AppRouter } from './router'

/**
 * App bootstraps Firebase auth listener once,
 * then renders the router.
 */
export function App() {
  useAuthState()
  return <AppRouter />
}
