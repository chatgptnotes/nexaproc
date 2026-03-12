import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStoreState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },
    }),
    {
      name: 'nexaproc-theme',
    },
  ),
);
