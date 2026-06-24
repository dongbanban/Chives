import { http, HttpResponse } from "msw"
import type { Post, PostListResponse } from "@/types/post"

// Deterministic mock data — important for cache-dedup verification
const MOCK_POSTS: Post[] = Array.from({ length: 23 }, (_, i) => {
  const categories = ["tech", "life", "design"] as const
  const category = categories[i % categories.length]
  return {
    id: String(i + 1),
    title: `文章标题 ${i + 1}`,
    summary: `这是第 ${i + 1} 篇文章的摘要，用于演示 TanStack Query 的缓存和去重机制。`,
    content: `## 第 ${i + 1} 篇文章\n\n这是文章 ${i + 1} 的完整内容。\n\n### 第一节\n\n详细内容展示 TanStack Router 基于文件的路由系统如何通过 URL 参数加载单篇文章。\n\n### 第二节\n\nTanStack Query 通过 queryKey 中的 id 参数确保每篇文章独立缓存。\n\n当用户从详情页返回列表时，列表数据从缓存读取，不会发起新的网络请求。`,
    category,
    createdAt: new Date(2025, 0, 23 - i).toISOString(),
  }
})

export const postsListHandler = http.get("/api/posts", ({ request }) => {
  const url = new URL(request.url)
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1)
  const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get("pageSize")) || 10))

  const start = (page - 1) * pageSize
  const posts = MOCK_POSTS.slice(start, start + pageSize)

  return HttpResponse.json<PostListResponse>({
    posts,
    total: MOCK_POSTS.length,
    page,
    pageSize,
  })
})

export const postDetailHandler = http.get("/api/posts/:id", ({ params }) => {
  const { id } = params
  const post = MOCK_POSTS.find((p) => p.id === id)

  if (!post) {
    return HttpResponse.json({ error: "Post not found" }, { status: 404 })
  }

  return HttpResponse.json<Post>(post)
})
