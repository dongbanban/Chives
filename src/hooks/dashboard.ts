import { useQuery } from "@tanstack/react-query"
import { useDashboardStore } from "@/stores/dashboard"
import type { DashboardResponse } from "@/types/dashboard"

async function fetchDashboardData(
  metric: string,
  timeRange: string
): Promise<DashboardResponse> {
  const res = await fetch(
    `/api/dashboard?metric=${metric}&timeRange=${timeRange}`
  )
  if (!res.ok) {
    throw new Error(`Dashboard fetch failed (${res.status})`)
  }
  return res.json()
}

export function useDashboardQuery() {
  const metric = useDashboardStore((s) => s.metric)
  const timeRange = useDashboardStore((s) => s.timeRange)

  return useQuery({
    queryKey: ["dashboard", metric, timeRange],
    queryFn: () => fetchDashboardData(metric, timeRange),
    staleTime: 30_000,
  })
}
