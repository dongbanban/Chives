import { createFileRoute } from "@tanstack/react-router"
import PostDetailPage from "@/pages/posts/post-detail-page"

export const Route = createFileRoute("/posts/$id")({
  component: PostDetailPage,
})
