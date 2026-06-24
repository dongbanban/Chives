import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest"
import { setupServer } from "msw/node"
import { http, HttpResponse } from "msw"
import { renderWithRouter } from "../../tests/utils"
import { screen, waitFor } from "@testing-library/react"

const server = setupServer(
  http.get("/api/health", () => HttpResponse.json({ status: "ok" })),
  http.get("/api/dashboard", () =>
    HttpResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  ),
  http.get("/api/posts", () => HttpResponse.json({ posts: [], total: 0, page: 1, pageSize: 10 })),
  http.get("/api/posts/:id", () =>
    HttpResponse.json({
      id: "1",
      title: "Post",
      summary: "",
      content: "",
      category: "tech",
      createdAt: "2025-01-01T00:00:00.000Z",
    })
  ),
  http.post("/api/feedback", () =>
    HttpResponse.json({ id: "1" }, { status: 201 })
  ),
)

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("ErrorBoundary", () => {
  it("shows errorComponent fallback when loader fails", async () => {
    const { router } = renderWithRouter()
    router.navigate({ to: "/dashboard", search: { metric: "sales", timeRange: "week" } })

    await waitFor(() => {
      expect(screen.getByText(/页面出错/)).toBeDefined()
    })
  })
})
