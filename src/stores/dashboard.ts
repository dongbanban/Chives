import { create } from "zustand"
import type { MetricType, TimeRange } from "@/types/dashboard"

export interface DashboardState {
  metric: MetricType
  timeRange: TimeRange
  setMetric: (metric: MetricType) => void
  setTimeRange: (timeRange: TimeRange) => void
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  metric: "sales",
  timeRange: "week",
  setMetric: (metric) => set({ metric }),
  setTimeRange: (timeRange) => set({ timeRange }),
}))
