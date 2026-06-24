import { createFileRoute } from "@tanstack/react-router"
import { postListQueryOptions } from "@/hooks/posts"
import PostsPage from "@/pages/posts/posts-page"

export const Route = createFileRoute("/posts/")({
  loader: ({ context }) =>
    (context as { queryClient: { ensureQueryData: typeof import("@tanstack/react-query").QueryClient.prototype.ensureQueryData } }).queryClient.ensureQueryData(postListQueryOptions(1, 10)),
  component: PostsPage,
})
