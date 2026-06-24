import { useQuery } from "@tanstack/react-query"
import { queryOptions } from "@tanstack/react-query"
import { fetchDashboardData } from "@/api/dashboard"

export function dashboardQueryOptions(metric: string, timeRange: string) {
  return queryOptions({
    queryKey: ["dashboard", metric, timeRange],
    queryFn: () => fetchDashboardData(metric, timeRange),
    staleTime: 30_000,
  })
}

export function useDashboardQuery(metric: string, timeRange: string) {
  return useQuery({
    ...dashboardQueryOptions(metric, timeRange),
  })
}
