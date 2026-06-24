import { useQuery } from "@tanstack/react-query"
import { queryOptions } from "@tanstack/react-query"
import { fetchPosts, fetchPost } from "@/api/posts"

export function postListQueryOptions(page: number, pageSize = 10) {
  return queryOptions({
    queryKey: ["posts", "list", page, pageSize],
    queryFn: () => fetchPosts(page, pageSize),
    staleTime: 60_000,
  })
}

export function usePostsQuery(page: number, pageSize = 10) {
  return useQuery({
    ...postListQueryOptions(page, pageSize),
  })
}

export function postDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["posts", "detail", id],
    queryFn: () => fetchPost(id),
    staleTime: 60_000,
    enabled: Boolean(id),
  })
}

export function usePostQuery(id: string) {
  return useQuery({
    ...postDetailQueryOptions(id),
  })
}
