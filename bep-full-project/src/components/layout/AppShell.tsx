import { Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { BottomNav } from './BottomNav'
import { AnimatedBackground } from '@/components/common/AnimatedBackground'
import { useUIStore } from '@/store/ui.store'
import { useResponsive } from '@/hooks/useResponsive'

export function AppShell() {
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const { isMobile } = useResponsive()

  return (
    <div className="flex h-screen overflow-hidden bg-bep-bg">
      <AnimatedBackground intensity="low" className="fixed inset-0 z-0" />

      {/* Desktop sidebar */}
      {!isMobile && (
        <Sidebar className="relative z-10 flex-shrink-0" />
      )}

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[190]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-[200] w-72"
            >
              <Sidebar className="h-full" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Topbar />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      {isMobile && <BottomNav />}
    </div>
  )
}
