import { useSettingsStore } from "@/stores/settings"
import type { Language } from "@/stores/settings"
import { Toggle } from "@/components/ui/toggle"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bell, Languages, Minimize } from "lucide-react"

const LANGUAGE_LABELS: Record<Language, string> = {
  zh: "简体中文",
  en: "English",
  ja: "日本語",
}

export default function SettingsPage() {
  const {
    notifications,
    language,
    compactMode,
    toggleNotifications,
    setLanguage,
    toggleCompactMode,
  } = useSettingsStore()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Preferences persisted to localStorage. Refresh to verify.
        </p>
      </div>

      <div className="space-y-6">
        {/* Notifications — Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Notifications</p>
              <p className="text-xs text-muted-foreground">
                {notifications ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
          <Toggle
            pressed={notifications}
            onPressedChange={toggleNotifications}
            aria-label="Toggle notifications"
          >
            {notifications ? "On" : "Off"}
          </Toggle>
        </div>

        {/* Language — Select */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Languages className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Language</p>
              <p className="text-xs text-muted-foreground">
                Display language preference
              </p>
            </div>
          </div>
          <Select
            value={language}
            onValueChange={(v) => setLanguage(v as Language)}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(LANGUAGE_LABELS) as [Language, string][]).map(
                ([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Compact Mode — Switch */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Minimize className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Compact Mode</p>
              <p className="text-xs text-muted-foreground">
                {compactMode ? "Dense layout" : "Default layout"}
              </p>
            </div>
          </div>
          <Switch
            checked={compactMode}
            onCheckedChange={toggleCompactMode}
            aria-label="Toggle compact mode"
          />
        </div>
      </div>

      {/* Storage indicator */}
      <div className="rounded-[var(--radius)] border bg-muted/50 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Storage key: <code className="text-foreground">chives-settings</code>
          &nbsp;&mdash;&nbsp;auto-persisted to localStorage via Zustand{" "}
          <code>persist</code> middleware.
        </p>
      </div>
    </div>
  )
}
