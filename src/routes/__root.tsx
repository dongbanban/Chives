import { createRootRoute, Link, Outlet } from "@tanstack/react-router"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { ErrorFallback } from "@/components/ErrorFallback"
import { PendingFallback } from "@/components/PendingFallback"
import { Toaster } from "sonner"

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Page not found</p>
        <Link to="/" className="text-sm underline">
          Go home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
  errorComponent: ErrorFallback,
  pendingComponent: PendingFallback,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-6">
          <Link to="/" className="font-semibold text-lg">
            Chives
          </Link>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/posts">Posts</Link>
            <Link to="/form-demo">Form</Link>
            <Link to="/dashboard" search={{ metric: "sales", timeRange: "week" }}>Dashboard</Link>
            <Link to="/settings">Settings</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Toaster richColors closeButton />
    </div>
  );
}