import { http, HttpResponse } from "msw"

export const handlers = [
  http.get("/api/health", () => HttpResponse.json({ status: "ok" })),
  http.post("/api/feedback", async ({ request }) => {
    const body = (await request.json()) as {
      title: string
      category: string
      description: string
    }

    if (!body.title || !body.category || !body.description) {
      return HttpResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    if (body.category === "fail") {
      return HttpResponse.json(
        { error: "Server error" },
        { status: 500 }
      )
    }

    return HttpResponse.json(
      { id: crypto.randomUUID(), ...body },
      { status: 201 }
    )
  }),
]
