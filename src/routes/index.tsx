import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">技术融合 Demo</h1>
      <p className="text-muted-foreground max-w-2xl">
        前端主流技术栈融合演练项目。通过多个独立 Demo 页面，分别展示不同技术组合的最佳实践和协作方式。
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link to="/posts">Posts — Router + Query</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/form-demo">Form — Mutation + Zustand</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/dashboard">Dashboard — ECharts + Zustand</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/settings">Settings — Zustand Persist</Link>
        </Button>
      </div>
    </div>
  )
}
