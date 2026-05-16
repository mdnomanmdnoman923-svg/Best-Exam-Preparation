import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Brain, Trophy, Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import { ROUTES } from '@/lib/constants'

const BOTTOM_NAV = [
  { to: ROUTES.DASHBOARD,    icon: LayoutDashboard, label: 'হোম' },
  { to: ROUTES.QUESTION_BANK,icon: BookOpen,         label: 'প্রশ্ন' },
  { to: ROUTES.PRACTICE,     icon: Brain,            label: 'প্র্যাকটিস' },
  { to: ROUTES.LEADERBOARD,  icon: Trophy,           label: 'র‍্যাংকিং' },
  { to: ROUTES.AI_ASSISTANT, icon: Sparkles,         label: 'AI' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[200] bg-bep-surface/95 backdrop-blur-md border-t border-bep-border safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {BOTTOM_NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]',
              isActive
                ? 'text-bep-primary'
                : 'text-bep-text-muted hover:text-bep-text-dim'
            )}
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  'p-1.5 rounded-lg transition-all',
                  isActive && 'bg-bep-primary/15'
                )}>
                  <Icon size={18} />
                </div>
                <span className={cn(
                  'text-[10px] font-medium font-bengali leading-none',
                  isActive ? 'text-bep-primary' : 'text-current'
                )}>
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
