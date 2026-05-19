// bep-full-project/src/store/ui.store.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';
export type SidebarState = 'expanded' | 'collapsed' | 'hidden';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'premium';
  duration?: number;
  actionLabel?: string;
}

export interface ModalState {
  id: string;
  open: boolean;
  title?: string;
  description?: string;
  payload?: unknown;
}

interface UIState {
  theme: ThemeMode;
  sidebar: SidebarState;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  commandPaletteOpen: boolean;
  notificationsOpen: boolean;
  quickActionsOpen: boolean;
  fullscreen: boolean;

  toasts: ToastItem[];
  modals: Record<string, ModalState>;

  pageTitle: string | null;
  pageSubtitle: string | null;
  loadingOverlay: boolean;
  compactMode: boolean;
  reduceMotion: boolean;
  accentColor: string;

  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  setSidebar: (state: SidebarState) => void;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
  hideSidebar: () => void;

  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  setSearchOpen: (open: boolean) => void;
  toggleSearchOpen: () => void;

  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPaletteOpen: () => void;

  setNotificationsOpen: (open: boolean) => void;
  toggleNotificationsOpen: () => void;

  setQuickActionsOpen: (open: boolean) => void;
  toggleQuickActionsOpen: () => void;

  setFullscreen: (fullscreen: boolean) => void;
  toggleFullscreen: () => void;

  setPageMeta: (title: string | null, subtitle?: string | null) => void;

  setLoadingOverlay: (loading: boolean) => void;
  setCompactMode: (compact: boolean) => void;
  setReduceMotion: (reduceMotion: boolean) => void;
  setAccentColor: (color: string) => void;

  pushToast: (toast: Omit<ToastItem, 'id'> & { id?: string }) => string;
  updateToast: (id: string, patch: Partial<ToastItem>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  openModal: (id: string, data?: Omit<ModalState, 'id' | 'open'>) => void;
  closeModal: (id: string) => void;
  toggleModal: (id: string, data?: Omit<ModalState, 'id' | 'open'>) => void;
  closeAllModals: () => void;

  resetUI: () => void;

  isDark: () => boolean;
  isSidebarCollapsed: () => boolean;
  isAnyOverlayOpen: () => boolean;
}

const DEFAULT_ACCENT = '#22D3EE';

const initialState = {
  theme: 'system' as ThemeMode,
  sidebar: 'expanded' as SidebarState,
  mobileMenuOpen: false,
  searchOpen: false,
  commandPaletteOpen: false,
  notificationsOpen: false,
  quickActionsOpen: false,
  fullscreen: false,

  toasts: [] as ToastItem[],
  modals: {} as Record<string, ModalState>,

  pageTitle: null as string | null,
  pageSubtitle: null as string | null,
  loadingOverlay: false,
  compactMode: false,
  reduceMotion: false,
  accentColor: DEFAULT_ACCENT,
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setTheme: (theme) => {
        set({ theme });
      },

      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        }));
      },

      setSidebar: (state) => {
        set({ sidebar: state });
      },

      toggleSidebar: () => {
        set((state) => ({
          sidebar:
            state.sidebar === 'expanded'
              ? 'collapsed'
              : state.sidebar === 'collapsed'
                ? 'expanded'
                : 'expanded',
        }));
      },

      collapseSidebar: () => {
        set({ sidebar: 'collapsed' });
      },

      expandSidebar: () => {
        set({ sidebar: 'expanded' });
      },

      hideSidebar: () => {
        set({ sidebar: 'hidden' });
      },

      setMobileMenuOpen: (open) => {
        set({ mobileMenuOpen: open });
      },

      toggleMobileMenu: () => {
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }));
      },

      setSearchOpen: (open) => {
        set({ searchOpen: open });
      },

      toggleSearchOpen: () => {
        set((state) => ({ searchOpen: !state.searchOpen }));
      },

      setCommandPaletteOpen: (open) => {
        set({ commandPaletteOpen: open });
      },

      toggleCommandPaletteOpen: () => {
        set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen }));
      },

      setNotificationsOpen: (open) => {
        set({ notificationsOpen: open });
      },

      toggleNotificationsOpen: () => {
        set((state) => ({ notificationsOpen: !state.notificationsOpen }));
      },

      setQuickActionsOpen: (open) => {
        set({ quickActionsOpen: open });
      },

      toggleQuickActionsOpen: () => {
        set((state) => ({ quickActionsOpen: !state.quickActionsOpen }));
      },

      setFullscreen: (fullscreen) => {
        set({ fullscreen });
      },

      toggleFullscreen: () => {
        set((state) => ({ fullscreen: !state.fullscreen }));
      },

      setPageMeta: (title, subtitle) => {
        set({
          pageTitle: title,
          pageSubtitle: subtitle ?? null,
        });
      },

      setLoadingOverlay: (loading) => {
        set({ loadingOverlay: loading });
      },

      setCompactMode: (compact) => {
        set({ compactMode: compact });
      },

      setReduceMotion: (reduceMotion) => {
        set({ reduceMotion });
      },

      setAccentColor: (color) => {
        set({ accentColor: color });
      },

      pushToast: (toast) => {
        const id = toast.id ?? makeId('toast');
        const nextToast: ToastItem = {
          id,
          title: toast.title,
          message: toast.message,
          variant: toast.variant ?? 'info',
          duration: toast.duration ?? 3500,
          actionLabel: toast.actionLabel,
        };

        set((state) => ({
          toasts: [nextToast, ...state.toasts].slice(0, 5),
        }));

        return id;
      },

      updateToast: (id, patch) => {
        set((state) => ({
          toasts: state.toasts.map((toast) =>
            toast.id === id ? { ...toast, ...patch } : toast,
          ),
        }));
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
      },

      clearToasts: () => {
        set({ toasts: [] });
      },

      openModal: (id, data) => {
        set((state) => ({
          modals: {
            ...state.modals,
            [id]: {
              id,
              open: true,
              title: data?.title,
              description: data?.description,
              payload: data?.payload,
            },
          },
        }));
      },

      closeModal: (id) => {
        set((state) => ({
          modals: {
            ...state.modals,
            [id]: {
              ...(state.modals[id] ?? { id }),
              id,
              open: false,
            },
          },
        }));
      },

      toggleModal: (id, data) => {
        const current = get().modals[id];
        if (current?.open) {
          get().closeModal(id);
          return;
        }

        get().openModal(id, data);
      },

      closeAllModals: () => {
        set((state) => ({
          modals: Object.fromEntries(
            Object.entries(state.modals).map(([id, modal]) => [
              id,
              { ...modal, open: false },
            ]),
          ),
        }));
      },

      resetUI: () => {
        set({
          ...initialState,
          toasts: [],
          modals: {},
        });
      },

      isDark: () => {
        const theme = get().theme;
        if (theme === 'system') {
          if (typeof window === 'undefined') return true;
          return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
        }
        return theme === 'dark';
      },

      isSidebarCollapsed: () => {
        return get().sidebar === 'collapsed';
      },

      isAnyOverlayOpen: () => {
        const state = get();

        return Boolean(
          state.mobileMenuOpen ||
            state.searchOpen ||
            state.commandPaletteOpen ||
            state.notificationsOpen ||
            state.quickActionsOpen ||
            state.loadingOverlay ||
            state.fullscreen,
        );
      },
    }),
    {
      name: 'bep-ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        sidebar: state.sidebar,
        compactMode: state.compactMode,
        reduceMotion: state.reduceMotion,
        accentColor: state.accentColor,
      }),
    },
  ),
);

/* -------------------------------------------------------------------------- */
/*                               Helper Selectors                             */
/* -------------------------------------------------------------------------- */

export const uiSelectors = {
  theme: (state: UIState) => state.theme,
  sidebar: (state: UIState) => state.sidebar,
  mobileMenuOpen: (state: UIState) => state.mobileMenuOpen,
  searchOpen: (state: UIState) => state.searchOpen,
  commandPaletteOpen: (state: UIState) => state.commandPaletteOpen,
  notificationsOpen: (state: UIState) => state.notificationsOpen,
  quickActionsOpen: (state: UIState) => state.quickActionsOpen,
  fullscreen: (state: UIState) => state.fullscreen,
  toasts: (state: UIState) => state.toasts,
  modals: (state: UIState) => state.modals,
  pageTitle: (state: UIState) => state.pageTitle,
  pageSubtitle: (state: UIState) => state.pageSubtitle,
  loadingOverlay: (state: UIState) => state.loadingOverlay,
  compactMode: (state: UIState) => state.compactMode,
  reduceMotion: (state: UIState) => state.reduceMotion,
  accentColor: (state: UIState) => state.accentColor,
  isDark: (state: UIState) =>
    state.theme === 'system'
      ? (typeof window !== 'undefined'
          ? window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true
          : true)
      : state.theme === 'dark',
  isSidebarCollapsed: (state: UIState) => state.sidebar === 'collapsed',
  isAnyOverlayOpen: (state: UIState) =>
    Boolean(
      state.mobileMenuOpen ||
        state.searchOpen ||
        state.commandPaletteOpen ||
        state.notificationsOpen ||
        state.quickActionsOpen ||
        state.loadingOverlay ||
        state.fullscreen,
    ),
};
