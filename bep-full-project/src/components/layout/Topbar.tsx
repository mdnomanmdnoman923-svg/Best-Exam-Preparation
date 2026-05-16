import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useUIStore } from '@/store/ui.store'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useResponsive } from '@/hooks/useResponsive'
import { ROUTES } from '@/lib/constants'

export function Topbar() {
  const { toggleSidebar } = useUIStore()
  const { user, profile } = useAuth()
  const { isMobile } = useResponsive()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-bep-border bg-bep-surface/80 backdrop-blur-md sticky top-0 z-[200]">
      {/* Left */}
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-bep-text-dim hover:text-bep-text hover:bg-bep-card transition-colors"
          >
            <Menu size={20} />
          </button>
        )}

        {!searchOpen && (
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-sm text-bep-text-dim font-bengali">স্বাগতম,</span>
            <span className="text-sm font-semibold text-bep-text font-bengali">
              {profile?.displayName?.split(' ')[0] ?? 'বন্ধু'}
            </span>
            <span className="text-sm">👋</span>
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <AnimatePresence mode="wait">
          {searchOpen ? (
            <motion.div
              key="search-open"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: isMobile ? '200px' : '280px', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex items-center bg-bep-card border border-bep-border rounded-xl overflow-hidden"
            >
              <Search size={16} className="ml-3 text-bep-muted flex-shrink-0" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="প্রশ্ন খুঁজুন..."
                className="flex-1 bg-transparent px-3 py-2 text-sm text-bep-text placeholder-bep-muted outline-none font-bengali"
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                className="p-2 text-bep-muted hover:text-bep-text transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="search-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-bep-text-dim hover:text-bep-text hover:bg-bep-card transition-colors"
            >
              <Search size={18} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Notifications */}
        <button
          onClick={() => {/* open notifications panel */}}
          className="relative p-2 rounded-lg text-bep-text-dim hover:text-bep-text hover:bg-bep-card transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-bep-primary rounded-full" />
        </button>

        {/* Avatar */}
        <button
          onClick={() => navigate(ROUTES.PROFILE_UPDATE)}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center overflow-hidden',
            'bg-bep-primary/20 border border-bep-primary/30 hover:border-bep-primary/60 transition-colors'
          )}
        >
          {profile?.photoURL ? (
            <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-bep-primary">
              {user?.displayName?.[0]?.toUpperCase() ?? 'U'}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
