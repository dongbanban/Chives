import { httpClient } from "./http-client"
import type { DashboardResponse } from "@/types/dashboard"

export async function fetchDashboardData(
  metric: string,
  timeRange: string
): Promise<DashboardResponse> {
  const { data } = await httpClient.get<DashboardResponse>("/dashboard", {
    params: { metric, timeRange },
  })
  return data
}
