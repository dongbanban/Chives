import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest"
import { setupServer } from "msw/node"
import { http, HttpResponse } from "msw"
import { renderWithRouter } from "../../tests/utils"
import { screen, waitFor } from "@testing-library/react"
import type { Post, PostListResponse } from "@/types/post"

const MOCK_POSTS: Post[] = [
  { id: "1", title: "测试文章标题", summary: "摘要", content: "内容", category: "tech", createdAt: "2025-01-01T00:00:00.000Z" },
]

const server = setupServer(
  http.get("/api/health", () => HttpResponse.json({ status: "ok" })),
  http.get("/api/dashboard", () => HttpResponse.json({ metric: "sales", timeRange: "week", data: [] })),
  http.get("/api/posts", () => HttpResponse.json<PostListResponse>({ posts: MOCK_POSTS, total: 1, page: 1, pageSize: 10 })),
  http.get("/api/posts/:id", ({ params }) => {
    const post = MOCK_POSTS.find((p) => p.id === params.id)
    if (!post) return HttpResponse.json({ error: "Not found" }, { status: 404 })
    return HttpResponse.json(post)
  }),
  http.post("/api/feedback", () => HttpResponse.json({ id: "1" }, { status: 201 })),
)

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Posts pages", () => {
  it("renders header bar", async () => {
    const { router } = renderWithRouter()
    router.navigate({ to: "/posts" })
    await waitFor(() => {
      expect(screen.getByText("Chives")).toBeDefined()
    }, { timeout: 5000 })
  })
})
