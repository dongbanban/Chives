import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from '@/stores/settings'

beforeEach(() => {
  useSettingsStore.setState({
    notifications: true,
    language: 'zh',
    compactMode: false,
  })
})

describe('useSettingsStore', () => {
  it('defaults to zh language, notifications on, compactMode off', () => {
    const s = useSettingsStore.getState()
    expect(s.notifications).toBe(true)
    expect(s.language).toBe('zh')
    expect(s.compactMode).toBe(false)
  })

  it('toggleNotifications flips the boolean', () => {
    useSettingsStore.getState().toggleNotifications()
    expect(useSettingsStore.getState().notifications).toBe(false)

    useSettingsStore.getState().toggleNotifications()
    expect(useSettingsStore.getState().notifications).toBe(true)
  })

  it('setLanguage changes the language', () => {
    useSettingsStore.getState().setLanguage('en')
    expect(useSettingsStore.getState().language).toBe('en')

    useSettingsStore.getState().setLanguage('ja')
    expect(useSettingsStore.getState().language).toBe('ja')
  })

  it('toggleCompactMode flips compactMode', () => {
    useSettingsStore.getState().toggleCompactMode()
    expect(useSettingsStore.getState().compactMode).toBe(true)

    useSettingsStore.getState().toggleCompactMode()
    expect(useSettingsStore.getState().compactMode).toBe(false)
  })
})
