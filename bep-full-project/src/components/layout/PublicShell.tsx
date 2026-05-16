import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AnimatedBackground } from '@/components/common/AnimatedBackground'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useEffect } from 'react'

export function PublicShell() {
  const { isAuthenticated, isProfileComplete } = useAuth()
  const navigate = useNavigate()

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      navigate(isProfileComplete ? ROUTES.DASHBOARD : ROUTES.COMPLETE_PROFILE, { replace: true })
    }
  }, [isAuthenticated, isProfileComplete, navigate])

  return (
    <div className="min-h-screen bg-bep-bg text-bep-text relative overflow-x-hidden">
      <AnimatedBackground />

      {/* Public navbar */}
      <header className="relative z-10 border-b border-bep-border/50 bg-bep-surface/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <NavLink to={ROUTES.HOME} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center shadow-glow-sm">
              <span className="text-sm font-bold text-white">BEP</span>
            </div>
            <div>
              <p className="text-sm font-bold text-bep-text leading-tight">Best Exam</p>
              <p className="text-xs text-bep-text-dim leading-none">Preparation</p>
            </div>
          </NavLink>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { to: ROUTES.HOME, label: 'হোম' },
              { to: ROUTES.PRICING, label: 'মূল্য' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors font-bengali ${
                    isActive ? 'text-bep-primary' : 'text-bep-text-dim hover:text-bep-text'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(ROUTES.AUTH)}
            >
              লগইন
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(ROUTES.AUTH + '?tab=register')}
            >
              শুরু করুন
            </Button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10"
      >
        <Outlet />
      </motion.main>
    </div>
  )
}
