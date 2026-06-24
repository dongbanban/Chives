import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/posts")({
  component: () => <div className="p-4">Coming in a future issue</div>,
})
