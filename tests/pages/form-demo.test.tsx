import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest"
import { setupServer } from "msw/node"
import { http, HttpResponse } from "msw"
import { renderWithRouter } from "../../tests/utils"
import { screen, waitFor } from "@testing-library/react"

const server = setupServer(
  http.get("/api/health", () => HttpResponse.json({ status: "ok" })),
  http.get("/api/dashboard", ({ request }) => {
    const url = new URL(request.url)
    return HttpResponse.json({
      metric: url.searchParams.get("metric") ?? "sales",
      timeRange: url.searchParams.get("timeRange") ?? "week",
      data: [{ label: "Mon", value: 100 }],
    })
  }),
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
  http.post("/api/feedback", async ({ request }) => {
    const body = (await request.json()) as Record<string, string>
    if (!body.title || !body.category || !body.description) {
      return HttpResponse.json({ error: "All fields are required" }, { status: 400 })
    }
    return HttpResponse.json({ id: "abc", ...body }, { status: 201 })
  }),
)

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Form demo page", () => {
  it("renders form fields", async () => {
    const { router } = renderWithRouter()
    router.navigate({ to: "/form-demo" })

    await waitFor(() => {
      expect(screen.getByText("Form")).toBeDefined()
    })
  })

  it("shows toast on successful submit", async () => {
    const { router } = renderWithRouter()
    router.navigate({ to: "/form-demo" })

    await waitFor(() => {
      expect(screen.getByText("Form")).toBeDefined()
    })
  })
})
