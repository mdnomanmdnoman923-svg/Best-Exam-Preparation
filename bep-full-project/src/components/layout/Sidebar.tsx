import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, Brain, FileText, History,
  TrendingUp, Trophy, Users, Sparkles, Settings,
  ChevronLeft, ChevronRight, LogOut, Shield, User,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore, selectIsAdmin } from '@/store/auth.store'
import { useProfileStore } from '@/store/profile.store'
import { useResponsive } from '@/hooks/useResponsive'
import { PremiumBadge } from '@/components/common/PremiumBadge'
import { ROUTES } from '@/lib/constants'
import { authService } from '@/services/auth.service'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD,     icon: LayoutDashboard, label: 'ড্যাশবোর্ড' },
  { to: ROUTES.QUESTION_BANK, icon: BookOpen,         label: 'প্রশ্নব্যাংক' },
  { to: ROUTES.PRACTICE,      icon: Brain,            label: 'প্র্যাকটিস' },
  { to: ROUTES.MOCK_TESTS,    icon: FileText,         label: 'মক টেস্ট' },
  { to: ROUTES.HISTORY,       icon: History,          label: 'ইতিহাস' },
  { to: ROUTES.PROGRESS,      icon: TrendingUp,       label: 'অগ্রগতি' },
  { to: ROUTES.LEADERBOARD,   icon: Trophy,           label: 'লিডারবোর্ড' },
  { to: ROUTES.COMMUNITY,     icon: Users,            label: 'কমিউনিটি' },
  { to: ROUTES.AI_ASSISTANT,  icon: Sparkles,         label: 'BEP AI' },
  { to: ROUTES.SETTINGS,      icon: Settings,         label: 'সেটিংস' },
] as const

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { sidebarCollapsed, toggleSidebarCollapsed, setSidebarOpen } = useUIStore()
  const { isMobile } = useResponsive()
  const navigate = useNavigate()

  const user = useAuthStore((s) => s.user)
  const isAdmin = useAuthStore(selectIsAdmin)
  const profile = useProfileStore((s) => s.profile)

  const collapsed = !isMobile && sidebarCollapsed

  const handleLogout = async () => {
    try {
      await authService.signOut()
      useAuthStore.getState().reset()
      useProfileStore.getState().reset()
      navigate(ROUTES.AUTH, { replace: true })
      toast.success('সফলভাবে লগআউট হয়েছেন')
    } catch {
      toast.error('লগআউট ব্যর্থ হয়েছে')
    }
  }

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-bep-surface border-r border-bep-border transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center border-b border-bep-border transition-all duration-300 flex-shrink-0',
          collapsed ? 'justify-center px-3 py-4' : 'px-5 py-4 gap-3'
        )}
      >
        <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center flex-shrink-0 shadow-glow-sm">
          <span className="text-sm font-bold text-white font-display">BEP</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
            >
              <p className="text-sm font-bold text-bep-text leading-tight font-display">Best Exam</p>
              <p className="text-xs text-bep-text-dim font-display">Preparation</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === ROUTES.DASHBOARD}
            onClick={() => isMobile && setSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative font-bengali',
                collapsed ? 'justify-center px-2' : 'gap-3',
                isActive
                  ? 'bg-bep-primary/10 text-bep-primary border border-bep-primary/20'
                  : 'text-bep-text-dim hover:text-bep-text hover:bg-bep-card border border-transparent'
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator bar */}
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="nav-active-bar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-bep-primary rounded-r-full"
                    transition={{ duration: 0.2 }}
                  />
                )}

                <Icon
                  size={18}
                  className={cn(
                    'flex-shrink-0 transition-colors',
                    isActive ? 'text-bep-primary' : 'text-current'
                  )}
                />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Collapsed tooltip */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-bep-card border border-bep-border rounded-lg text-xs text-bep-text whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-card">
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Admin section */}
        {isAdmin && (
          <>
            <div className={cn('my-2 border-t border-bep-border/50', collapsed && 'mx-1')} />
            <NavLink
              to={ROUTES.ADMIN_DASHBOARD}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative font-bengali border',
                  collapsed ? 'justify-center px-2' : 'gap-3',
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'text-amber-500/70 hover:text-amber-400 hover:bg-amber-500/5 border-transparent'
                )
              }
            >
              <Shield size={18} className="flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    অ্যাডমিন প্যানেল
                  </motion.span>
                )}
              </AnimatePresence>
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-bep-card border border-bep-border rounded-lg text-xs text-bep-text whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-card">
                  অ্যাডমিন প্যানেল
                </div>
              )}
            </NavLink>
          </>
        )}
      </nav>

      {/* User section */}
      <div className="border-t border-bep-border p-3 flex-shrink-0">
        {/* User info — only when not collapsed */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="mb-2 overflow-hidden"
            >
              <NavLink
                to={ROUTES.PROFILE_UPDATE}
                onClick={() => isMobile && setSidebarOpen(false)}
                className="flex items-center gap-3 px-2 py-2 rounded-xl bg-bep-card/50 hover:bg-bep-card transition-colors group"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-bep-primary/20 border border-bep-primary/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-bep-primary">
                      {(profile?.displayName ?? user?.displayName ?? 'U')[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-bep-text truncate font-bengali">
                    {profile?.displayName ?? user?.displayName ?? 'ব্যবহারকারী'}
                  </p>
                  <div className="mt-0.5">
                    {profile?.isPremium ? (
                      <PremiumBadge />
                    ) : (
                      <span className="text-[10px] text-bep-text-muted font-bengali">ফ্রি প্ল্যান</span>
                    )}
                  </div>
                </div>
                <User size={14} className="text-bep-text-muted group-hover:text-bep-text transition-colors flex-shrink-0" />
              </NavLink>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom action row */}
        <div className={cn('flex items-center', collapsed ? 'flex-col gap-2' : 'gap-2')}>
          <button
            onClick={handleLogout}
            title="লগআউট"
            className={cn(
              'flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-bep-text-dim',
              'hover:text-red-400 hover:bg-red-500/5 transition-colors font-bengali',
              collapsed ? 'justify-center w-full' : 'flex-1'
            )}
          >
            <LogOut size={16} className="flex-shrink-0" />
            {!collapsed && <span>লগআউট</span>}
          </button>

          {/* Collapse toggle — desktop only */}
          {!isMobile && (
            <button
              onClick={toggleSidebarCollapsed}
              title={collapsed ? 'প্রসারিত করুন' : 'সংকুচিত করুন'}
              className="p-2 rounded-lg text-bep-text-muted hover:text-bep-text hover:bg-bep-card transition-colors flex-shrink-0"
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
