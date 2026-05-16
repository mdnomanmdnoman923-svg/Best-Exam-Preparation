import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, Search, X, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { useProfileStore } from '@/store/profile.store'
import { useResponsive } from '@/hooks/useResponsive'
import { useDebounce } from '@/hooks/useDebounce'
import { ROUTES } from '@/lib/constants'

export function Topbar() {
  const { toggleSidebar } = useUIStore()
  const { isMobile } = useResponsive()
  const navigate = useNavigate()

  const user = useAuthStore((s) => s.user)
  const profile = useProfileStore((s) => s.profile)

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)

  const searchRef = useRef<HTMLInputElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const debouncedSearch = useDebounce(searchQuery, 400)

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  // Close notif panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const displayName = profile?.displayName?.split(' ')[0] ?? user?.displayName?.split(' ')[0] ?? 'বন্ধু'

  return (
    <header className="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-bep-border bg-bep-surface/80 backdrop-blur-md sticky top-0 z-[150] flex-shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-bep-text-dim hover:text-bep-text hover:bg-bep-card transition-colors"
            aria-label="মেনু খুলুন"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Welcome message — hidden when search is open */}
        <AnimatePresence>
          {!searchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden sm:flex items-center gap-1.5"
            >
              <span className="text-sm text-bep-text-dim font-bengali">স্বাগতম,</span>
              <span className="text-sm font-semibold text-bep-text font-bengali">{displayName}</span>
              <span className="text-base">👋</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Search */}
        <AnimatePresence mode="wait">
          {searchOpen ? (
            <motion.div
              key="search-expanded"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: isMobile ? 200 : 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center bg-bep-card border border-bep-border rounded-xl overflow-hidden"
            >
              <Search size={15} className="ml-3 text-bep-muted flex-shrink-0" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery('') }
                  if (e.key === 'Enter' && debouncedSearch) {
                    navigate(`${ROUTES.QUESTION_BANK}?q=${encodeURIComponent(debouncedSearch)}`)
                    setSearchOpen(false)
                    setSearchQuery('')
                  }
                }}
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
              aria-label="খুঁজুন"
            >
              <Search size={18} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((p) => !p)}
            className="relative p-2 rounded-lg text-bep-text-dim hover:text-bep-text hover:bg-bep-card transition-colors"
            aria-label="বিজ্ঞপ্তি"
          >
            <Bell size={18} />
            {/* Unread dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-bep-primary rounded-full ring-2 ring-bep-surface" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-bep-card border border-bep-border rounded-2xl shadow-card z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-bep-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-bep-text font-bengali">বিজ্ঞপ্তি</h3>
                  <button className="text-xs text-bep-primary hover:underline font-bengali">সব পড়া হয়েছে</button>
                </div>
                <div className="py-2">
                  {/* Placeholder notifications */}
                  {[
                    { icon: '🎯', title: 'নতুন মক টেস্ট', body: 'পদার্থবিজ্ঞান অধ্যায় ৩ মক টেস্ট যুক্ত হয়েছে', time: '২ ঘণ্টা আগে' },
                    { icon: '🏆', title: 'লিডারবোর্ড আপডেট', body: 'আপনি এই সপ্তাহে ৫ র‍্যাংক উপরে গেছেন', time: '১ দিন আগে' },
                  ].map((n, i) => (
                    <button
                      key={i}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-bep-surface transition-colors text-left"
                    >
                      <span className="text-lg flex-shrink-0 mt-0.5">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-bep-text font-bengali">{n.title}</p>
                        <p className="text-xs text-bep-text-dim font-bengali mt-0.5 line-clamp-2">{n.body}</p>
                        <p className="text-[10px] text-bep-text-muted mt-1 font-bengali">{n.time}</p>
                      </div>
                      <div className="w-2 h-2 bg-bep-primary rounded-full flex-shrink-0 mt-1.5" />
                    </button>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-bep-border">
                  <button className="w-full text-xs text-center text-bep-primary hover:underline font-bengali py-1">
                    সব বিজ্ঞপ্তি দেখুন
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings shortcut */}
        <button
          onClick={() => navigate(ROUTES.SETTINGS)}
          className="hidden sm:flex p-2 rounded-lg text-bep-text-dim hover:text-bep-text hover:bg-bep-card transition-colors"
          aria-label="সেটিংস"
        >
          <Settings size={18} />
        </button>

        {/* Avatar → profile */}
        <button
          onClick={() => navigate(ROUTES.PROFILE_UPDATE)}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0',
            'bg-bep-primary/20 border border-bep-primary/30 hover:border-bep-primary/70 transition-all duration-200'
          )}
          aria-label="প্রোফাইল"
        >
          {profile?.photoURL ? (
            <img src={profile.photoURL} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-bep-primary">
              {(profile?.displayName ?? user?.displayName ?? 'U')[0].toUpperCase()}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
