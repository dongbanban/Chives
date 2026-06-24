import { useMemo } from "react"
import ReactECharts from "echarts-for-react"
import type { EChartsOption } from "echarts"
import { useDashboardQuery } from "@/hooks/dashboard"
import { useDashboardStore } from "@/stores/dashboard"
import {
  METRIC_LABELS,
  TIME_RANGE_LABELS,
  type MetricType,
  type TimeRange,
} from "@/types/dashboard"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BarChart3, LineChart, TrendingUp, Calendar } from "lucide-react"

function buildBarOption(
  labels: string[],
  values: number[],
  metricLabel: string
): EChartsOption {
  return {
    tooltip: { trigger: "axis" },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "category", data: labels },
    yAxis: { type: "value" },
    series: [
      {
        name: metricLabel,
        type: "bar",
        data: values,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
    ],
  }
}

function buildLineOption(
  labels: string[],
  values: number[],
  metricLabel: string
): EChartsOption {
  return {
    tooltip: { trigger: "axis" },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "category", data: labels, boundaryGap: false },
    yAxis: { type: "value" },
    series: [
      {
        name: metricLabel,
        type: "line",
        data: values,
        smooth: true,
        areaStyle: { opacity: 0.15 },
      },
    ],
  }
}

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardQuery()
  const metric = useDashboardStore((s) => s.metric)
  const timeRange = useDashboardStore((s) => s.timeRange)
  const setMetric = useDashboardStore((s) => s.setMetric)
  const setTimeRange = useDashboardStore((s) => s.setTimeRange)

  const metricLabel = METRIC_LABELS[metric]

  const barOption = useMemo(() => {
    if (!data) return null
    return buildBarOption(
      data.data.map((d) => d.label),
      data.data.map((d) => d.value),
      metricLabel
    )
  }, [data, metricLabel])

  const lineOption = useMemo(() => {
    if (!data) return null
    return buildLineOption(
      data.data.map((d) => d.label),
      data.data.map((d) => d.value),
      metricLabel
    )
  }, [data, metricLabel])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          ECharts charts driven by Zustand client state, data fetched via
          TanStack Query from MSW mock handlers.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Metric switcher */}
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">指标</span>
          <div className="flex rounded-[var(--radius)] border">
            {(Object.entries(METRIC_LABELS) as [MetricType, string][]).map(
              ([key, label]) => (
                <Button
                  key={key}
                  variant={metric === key ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none first:rounded-l-[calc(var(--radius)-1px)] last:rounded-r-[calc(var(--radius)-1px)]"
                  onClick={() => setMetric(key)}
                >
                  {label}
                </Button>
              )
            )}
          </div>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">时间范围</span>
          <Select
            value={timeRange}
            onValueChange={(v) => setTimeRange(v as TimeRange)}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(TIME_RANGE_LABELS) as [TimeRange, string][]).map(
                ([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Charts */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-64 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">数据加载失败</CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : "未知错误"}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {data && barOption && lineOption && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Bar chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {metricLabel} — 柱状图
              </CardTitle>
              <CardDescription>
                {TIME_RANGE_LABELS[timeRange]} · {metricLabel}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReactECharts
                option={barOption}
                style={{ height: 320 }}
                notMerge
                lazyUpdate
              />
            </CardContent>
          </Card>

          {/* Line chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                {metricLabel} — 折线图
              </CardTitle>
              <CardDescription>
                {TIME_RANGE_LABELS[timeRange]} · {metricLabel}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReactECharts
                option={lineOption}
                style={{ height: 320 }}
                notMerge
                lazyUpdate
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Zustand state indicator */}
      <div className="rounded-[var(--radius)] border bg-muted/50 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Zustand store:{" "}
          <code className="text-foreground">useDashboardStore</code> holds{" "}
          <code>metric=&quot;{metric}&quot;</code> and{" "}
          <code>timeRange=&quot;{timeRange}&quot;</code>. Query key is{" "}
          <code>[&quot;dashboard&quot;, &quot;{metric}&quot;, &quot;{timeRange}&quot;]</code>.
        </p>
      </div>
    </div>
  )
}
