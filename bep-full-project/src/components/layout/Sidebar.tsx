import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, Brain, FileText, History,
  TrendingUp, Trophy, Users, Sparkles, Settings,
  ChevronLeft, ChevronRight, LogOut, Shield,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useUIStore } from '@/store/ui.store'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useResponsive } from '@/hooks/useResponsive'
import { PremiumBadge } from '@/components/common/PremiumBadge'
import { ROUTES } from '@/lib/constants'

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD,      icon: LayoutDashboard, label: 'ড্যাশবোর্ড' },
  { to: ROUTES.QUESTION_BANK,  icon: BookOpen,         label: 'প্রশ্নব্যাংক' },
  { to: ROUTES.PRACTICE,       icon: Brain,            label: 'প্র্যাকটিস' },
  { to: ROUTES.MOCK_TESTS,     icon: FileText,         label: 'মক টেস্ট' },
  { to: ROUTES.HISTORY,        icon: History,          label: 'ইতিহাস' },
  { to: ROUTES.PROGRESS,       icon: TrendingUp,       label: 'অগ্রগতি' },
  { to: ROUTES.LEADERBOARD,    icon: Trophy,           label: 'লিডারবোর্ড' },
  { to: ROUTES.COMMUNITY,      icon: Users,            label: 'কমিউনিটি' },
  { to: ROUTES.AI_ASSISTANT,   icon: Sparkles,         label: 'BEP AI' },
  { to: ROUTES.SETTINGS,       icon: Settings,         label: 'সেটিংস' },
] as const

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { sidebarCollapsed, toggleSidebarCollapsed, setSidebarOpen } = useUIStore()
  const { user, profile, isAdmin, isPremium, logout } = useAuth()
  const { isMobile } = useResponsive()
  const location = useLocation()

  const collapsed = !isMobile && sidebarCollapsed

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-bep-surface border-r border-bep-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center border-b border-bep-border transition-all duration-300',
        collapsed ? 'justify-center px-3 py-4' : 'px-5 py-4 gap-3'
      )}>
        <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center flex-shrink-0 shadow-glow-sm">
          <span className="text-sm font-bold text-white">BEP</span>
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-sm font-bold text-bep-text leading-tight">Best Exam</p>
            <p className="text-xs text-bep-text-dim">Preparation</p>
          </motion.div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => isMobile && setSidebarOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative font-bengali',
              isActive
                ? 'bg-bep-primary/10 text-bep-primary border border-bep-primary/20'
                : 'text-bep-text-dim hover:text-bep-text hover:bg-bep-card',
              collapsed && 'justify-center px-2'
            )}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={cn(isActive ? 'text-bep-primary' : 'text-current')} />
                {!collapsed && <span>{label}</span>}
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-bep-primary rounded-r-full"
                    transition={{ duration: 0.2 }}
                  />
                )}
                {/* Tooltip for collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-bep-card border border-bep-border rounded-lg text-xs text-bep-text whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Admin link */}
        {isAdmin && (
          <NavLink
            to={ROUTES.ADMIN}
            onClick={() => isMobile && setSidebarOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 font-bengali',
              isActive
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'text-amber-500/70 hover:text-amber-400 hover:bg-amber-500/5',
              collapsed && 'justify-center px-2'
            )}
          >
            <Shield size={18} />
            {!collapsed && <span>অ্যাডমিন</span>}
          </NavLink>
        )}
      </nav>

      {/* User section */}
      <div className="border-t border-bep-border p-3">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl bg-bep-card/50">
            <div className="w-8 h-8 rounded-full bg-bep-primary/20 border border-bep-primary/30 flex items-center justify-center overflow-hidden flex-shrink-0">
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-bep-primary">
                  {user?.displayName?.[0] ?? 'U'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-bep-text truncate font-bengali">
                {profile?.displayName ?? user?.displayName ?? 'ব্যবহারকারী'}
              </p>
              {isPremium && <PremiumBadge />}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            className={cn(
              'flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-bep-text-dim hover:text-red-400 hover:bg-red-500/5 transition-colors font-bengali',
              collapsed ? 'justify-center flex-1' : 'flex-1'
            )}
          >
            <LogOut size={16} />
            {!collapsed && 'লগআউট'}
          </button>

          {!isMobile && (
            <button
              onClick={toggleSidebarCollapsed}
              className="p-2 rounded-lg text-bep-text-muted hover:text-bep-text hover:bg-bep-card transition-colors"
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
