import { http, HttpResponse } from "msw"
import type { DashboardResponse, MetricType, TimeRange } from "@/types/dashboard"

function generateMockData(
  metric: MetricType,
  timeRange: TimeRange
): DashboardResponse["data"] {
  if (timeRange === "week") {
    const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
    return days.map((label) => ({
      label,
      value:
        metric === "sales"
          ? Math.floor(Math.random() * 5000 + 2000)
          : Math.floor(Math.random() * 80 + 20),
    }))
  }

  if (timeRange === "month") {
    const weeks = ["第1周", "第2周", "第3周", "第4周"]
    return weeks.map((label) => ({
      label,
      value:
        metric === "sales"
          ? Math.floor(Math.random() * 20000 + 8000)
          : Math.floor(Math.random() * 300 + 80),
    }))
  }

  // quarter
  const months = ["1月", "2月", "3月"]
  return months.map((label) => ({
    label,
    value:
      metric === "sales"
        ? Math.floor(Math.random() * 80000 + 30000)
        : Math.floor(Math.random() * 1200 + 300),
  }))
}

export const dashboardHandler = http.get("/api/dashboard", ({ request }) => {
  const url = new URL(request.url)
  const metric = (url.searchParams.get("metric") ?? "sales") as MetricType
  const timeRange = (url.searchParams.get("timeRange") ?? "week") as TimeRange

  return HttpResponse.json<DashboardResponse>({
    metric,
    timeRange,
    data: generateMockData(metric, timeRange),
  })
})
