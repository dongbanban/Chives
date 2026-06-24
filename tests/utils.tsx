import { createRouter, RouterProvider } from "@tanstack/react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render } from "@testing-library/react"
import type { RenderResult } from "@testing-library/react"
import { routeTree } from "../src/routeTree.gen"
import { ErrorFallback } from "../src/components/ErrorFallback"
import { PendingFallback } from "../src/components/PendingFallback"

export function renderWithRouter(): RenderResult & { router: ReturnType<typeof createRouter> } {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultErrorComponent: ErrorFallback,
    defaultPendingComponent: PendingFallback,
  }) as ReturnType<typeof createRouter> & {
    navigate: (opts: { to: string; search?: Record<string, unknown> }) => void
  }

  const result = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router as any} />
    </QueryClientProvider>
  )

  return { ...result, router }
}
