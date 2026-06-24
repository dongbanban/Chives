import { useQuery } from "@tanstack/react-query"
import type { Post, PostListResponse } from "@/types/post"

async function fetchPosts(page: number, pageSize: number): Promise<PostListResponse> {
  const res = await fetch(`/api/posts?page=${page}&pageSize=${pageSize}`)
  if (!res.ok) throw new Error(`Posts fetch failed (${res.status})`)
  return res.json()
}

async function fetchPost(id: string): Promise<Post> {
  const res = await fetch(`/api/posts/${id}`)
  if (!res.ok) throw new Error(`Post fetch failed (${res.status})`)
  return res.json()
}

export function usePostsQuery(page: number, pageSize = 10) {
  return useQuery({
    queryKey: ["posts", "list", page, pageSize],
    queryFn: () => fetchPosts(page, pageSize),
    staleTime: 60_000,
  })
}

export function usePostQuery(id: string) {
  return useQuery({
    queryKey: ["posts", "detail", id],
    queryFn: () => fetchPost(id),
    staleTime: 60_000,
    enabled: Boolean(id),
  })
}
