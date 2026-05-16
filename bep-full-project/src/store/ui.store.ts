import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UIState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  activeModal: string | null
  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebarCollapsed: () => void
  openModal: (id: string) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: false,
        sidebarCollapsed: false,
        activeModal: null,

        toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen }), false, 'ui/toggleSidebar'),
        setSidebarOpen: (open) => set({ sidebarOpen: open }, false, 'ui/setSidebarOpen'),
        toggleSidebarCollapsed: () =>
          set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed }), false, 'ui/toggleCollapsed'),
        openModal: (id) => set({ activeModal: id }, false, 'ui/openModal'),
        closeModal: () => set({ activeModal: null }, false, 'ui/closeModal'),
      }),
      { name: 'bep-ui', partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }) }
    ),
    { name: 'UIStore' }
  )
)
