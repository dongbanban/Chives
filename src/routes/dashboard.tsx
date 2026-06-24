import { createFileRoute } from "@tanstack/react-router"
import type { QueryClient } from "@tanstack/react-query"
import { dashboardQueryOptions } from "@/hooks/dashboard"
import { useDashboardStore } from "@/stores/dashboard"
import DashboardPage from "@/pages/dashboard/dashboard-page"

export const Route = createFileRoute("/dashboard")({
  loader: ({ context }) => {
    const { metric, timeRange } = useDashboardStore.getState()
    const qc = (context as { queryClient: QueryClient }).queryClient
    return qc.ensureQueryData(
      dashboardQueryOptions(metric, timeRange)
    )
  },
  component: DashboardPage,
})
