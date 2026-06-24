import { createFileRoute } from "@tanstack/react-router"
import { postDetailQueryOptions } from "@/hooks/posts"
import PostDetailPage from "@/pages/posts/post-detail-page"

export const Route = createFileRoute("/posts/$id")({
  loader: ({ params, context }: { params: { id: string }; context: Record<string, unknown> }) =>
    (context as unknown as { queryClient: { ensureQueryData: (opts: ReturnType<typeof postDetailQueryOptions>) => Promise<unknown> } }).queryClient.ensureQueryData(postDetailQueryOptions(params.id)),
  component: PostDetailPage,
})
