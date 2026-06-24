import { useQuery } from "@tanstack/react-query"
import { queryOptions } from "@tanstack/react-query"
import { fetchDashboardData } from "@/api/dashboard"
import { useDashboardStore } from "@/stores/dashboard"

export function dashboardQueryOptions(
  metric: string,
  timeRange: string
) {
  return queryOptions({
    queryKey: ["dashboard", metric, timeRange],
    queryFn: () => fetchDashboardData(metric, timeRange),
    staleTime: 30_000,
  })
}

export function useDashboardQuery() {
  const metric = useDashboardStore((s) => s.metric)
  const timeRange = useDashboardStore((s) => s.timeRange)

  return useQuery({
    ...dashboardQueryOptions(metric, timeRange),
  })
}
