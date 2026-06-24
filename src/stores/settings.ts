import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Language = "zh" | "en" | "ja"

export interface SettingsState {
  notifications: boolean
  language: Language
  compactMode: boolean
  toggleNotifications: () => void
  setLanguage: (lang: Language) => void
  toggleCompactMode: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notifications: true,
      language: "zh",
      compactMode: false,
      toggleNotifications: () =>
        set((s) => ({ notifications: !s.notifications })),
      setLanguage: (lang) => set({ language: lang }),
      toggleCompactMode: () =>
        set((s) => ({ compactMode: !s.compactMode })),
    }),
    { name: "chives-settings" }
  )
)
