import { http, HttpResponse } from "msw"
import type { DashboardResponse, MetricType, TimeRange } from "@/types/dashboard"

// Deterministic fixtures — same (metric, timeRange) always returns same data.
// Enables cache-dedup verification through TanStack Query Devtools.
const FIXTURES: Record<string, DashboardResponse["data"]> = {
  "sales-week": [
    { label: "周一", value: 3200 },
    { label: "周二", value: 2800 },
    { label: "周三", value: 4500 },
    { label: "周四", value: 3900 },
    { label: "周五", value: 5100 },
    { label: "周六", value: 2300 },
    { label: "周日", value: 1800 },
  ],
  "sales-month": [
    { label: "第1周", value: 18500 },
    { label: "第2周", value: 16200 },
    { label: "第3周", value: 21300 },
    { label: "第4周", value: 19800 },
  ],
  "sales-quarter": [
    { label: "1月", value: 65000 },
    { label: "2月", value: 58000 },
    { label: "3月", value: 71000 },
  ],
  "orders-week": [
    { label: "周一", value: 42 },
    { label: "周二", value: 38 },
    { label: "周三", value: 55 },
    { label: "周四", value: 48 },
    { label: "周五", value: 62 },
    { label: "周六", value: 30 },
    { label: "周日", value: 25 },
  ],
  "orders-month": [
    { label: "第1周", value: 210 },
    { label: "第2周", value: 195 },
    { label: "第3周", value: 250 },
    { label: "第4周", value: 228 },
  ],
  "orders-quarter": [
    { label: "1月", value: 780 },
    { label: "2月", value: 720 },
    { label: "3月", value: 850 },
  ],
}

function generateMockData(
  metric: MetricType,
  timeRange: TimeRange
): DashboardResponse["data"] {
  return FIXTURES[`${metric}-${timeRange}`] ?? FIXTURES["sales-week"]
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
