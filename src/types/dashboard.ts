export type MetricType = "sales" | "orders"
export type TimeRange = "week" | "month" | "quarter"

export interface DashboardDataPoint {
  label: string
  value: number
}

export interface DashboardResponse {
  metric: MetricType
  timeRange: TimeRange
  data: DashboardDataPoint[]
}

export const METRIC_LABELS: Record<MetricType, string> = {
  sales: "销售额",
  orders: "订单数",
}

export const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  week: "本周",
  month: "本月",
  quarter: "本季度",
}
