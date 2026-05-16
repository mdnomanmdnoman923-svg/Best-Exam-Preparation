import { useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { AnimatedBackground } from '@/components/common/AnimatedBackground'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants'
import { useAuthStore, selectIsAuthenticated } from '@/store/auth.store'
import { useProfileStore } from '@/store/profile.store'

export function PublicShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const profile = useProfileStore((s) => s.profile)
  const isProfileComplete = profile?.isProfileComplete ?? false

  // Redirect authenticated users away from public pages
  useEffect(() => {
    if (isAuthenticated) {
      const destination = isProfileComplete ? ROUTES.DASHBOARD : ROUTES.COMPLETE_PROFILE
      navigate(destination, { replace: true })
    }
  }, [isAuthenticated, isProfileComplete, navigate])

  const navLinks = [
    { to: ROUTES.HOME, label: 'হোম' },
    { to: ROUTES.PRICING, label: 'মূল্য তালিকা' },
  ]

  return (
    <div className="min-h-screen bg-bep-bg text-bep-text relative overflow-x-hidden">
      <AnimatedBackground intensity="medium" className="fixed inset-0 z-0" />

      {/* Public navbar */}
      <header className="relative z-20 border-b border-bep-border/50 bg-bep-surface/60 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <NavLink to={ROUTES.HOME} className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center shadow-glow-sm">
              <span className="text-sm font-bold text-white font-display">BEP</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-bep-text leading-tight font-display">Best Exam</p>
              <p className="text-xs text-bep-text-dim leading-none font-display">Preparation</p>
            </div>
          </NavLink>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
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

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(ROUTES.AUTH)}
            >
              লগইন
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(`${ROUTES.AUTH}?tab=register`)}
            >
              শুরু করুন
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="md:hidden p-2 rounded-lg text-bep-text-dim hover:text-bep-text hover:bg-bep-card transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-bep-border bg-bep-surface/95 backdrop-blur-md overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block py-2 text-sm font-medium font-bengali transition-colors ${
                        isActive ? 'text-bep-primary' : 'text-bep-text-dim'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => { navigate(ROUTES.AUTH); setMobileMenuOpen(false) }}
                  >
                    লগইন
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => { navigate(`${ROUTES.AUTH}?tab=register`); setMobileMenuOpen(false) }}
                  >
                    শুরু করুন
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Page content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative z-10"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
