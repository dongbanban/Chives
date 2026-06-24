import { createFileRoute } from "@tanstack/react-router"
import type { QueryClient } from "@tanstack/react-query"
import { dashboardQueryOptions } from "@/hooks/dashboard"
import DashboardPage from "@/pages/dashboard/dashboard-page"

export const Route = createFileRoute("/dashboard")({
  validateSearch: (search: Record<string, unknown>) => ({
    metric: (search.metric as string) || "sales",
    timeRange: (search.timeRange as string) || "week",
  }),
  loaderDeps: ({ search }) => ({
    metric: search.metric,
    timeRange: search.timeRange,
  }),
  loader: ({ deps: { metric, timeRange }, context }) => {
    const qc = (context as { queryClient: QueryClient }).queryClient
    return qc.ensureQueryData(
      dashboardQueryOptions(metric, timeRange)
    )
  },
  component: DashboardPage,
})
