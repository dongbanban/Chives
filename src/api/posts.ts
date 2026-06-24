import { httpClient } from "./http-client"
import type { Post, PostListResponse } from "@/types/post"

export async function fetchPosts(
  page: number,
  pageSize: number
): Promise<PostListResponse> {
  const { data } = await httpClient.get<PostListResponse>("/posts", {
    params: { page, pageSize },
  })
  return data
}

export async function fetchPost(id: string): Promise<Post> {
  const { data } = await httpClient.get<Post>(`/posts/${id}`)
  return data
}
