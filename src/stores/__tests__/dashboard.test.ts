import { describe, it, expect, beforeEach } from 'vitest'
import { useDashboardStore } from '../dashboard'

beforeEach(() => {
  useDashboardStore.setState({ metric: 'sales', timeRange: 'week' })
})

describe('useDashboardStore', () => {
  it('defaults to sales metric and week range', () => {
    const s = useDashboardStore.getState()
    expect(s.metric).toBe('sales')
    expect(s.timeRange).toBe('week')
  })

  it('setMetric changes the metric', () => {
    useDashboardStore.getState().setMetric('orders')
    expect(useDashboardStore.getState().metric).toBe('orders')
  })

  it('setTimeRange changes the time range', () => {
    useDashboardStore.getState().setTimeRange('month')
    expect(useDashboardStore.getState().timeRange).toBe('month')
  })
})
