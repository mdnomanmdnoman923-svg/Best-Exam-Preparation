import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Brain, Trophy, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { ROUTES } from '@/lib/constants'

const BOTTOM_NAV_ITEMS = [
  { to: ROUTES.DASHBOARD,     icon: LayoutDashboard, label: 'হোম' },
  { to: ROUTES.QUESTION_BANK, icon: BookOpen,         label: 'প্রশ্ন' },
  { to: ROUTES.PRACTICE,      icon: Brain,            label: 'প্র্যাকটিস' },
  { to: ROUTES.LEADERBOARD,   icon: Trophy,           label: 'র‍্যাংকিং' },
  { to: ROUTES.AI_ASSISTANT,  icon: Sparkles,         label: 'AI' },
] as const

export function BottomNav() {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[200]',
        'bg-bep-surface/95 backdrop-blur-md border-t border-bep-border',
        'safe-area-bottom'
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch justify-around px-1 py-1">
        {BOTTOM_NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === ROUTES.DASHBOARD}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 flex-1 min-w-0 relative',
                isActive ? 'text-bep-primary' : 'text-bep-text-muted hover:text-bep-text-dim'
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active pill background */}
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 bg-bep-primary/10 rounded-xl"
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  />
                )}

                <div
                  className={cn(
                    'relative p-1.5 rounded-lg transition-all duration-200',
                    isActive ? 'text-bep-primary' : 'text-current'
                  )}
                >
                  <Icon size={19} />
                  {/* AI icon special glow */}
                  {to === ROUTES.AI_ASSISTANT && isActive && (
                    <span className="absolute inset-0 rounded-lg bg-bep-primary/20 blur-sm -z-10" />
                  )}
                </div>

                <span
                  className={cn(
                    'text-[10px] font-medium font-bengali leading-none relative',
                    isActive ? 'text-bep-primary' : 'text-current'
                  )}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
