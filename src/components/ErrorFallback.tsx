import { TriangleAlert } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ErrorFallbackProps {
  error: Error
  reset?: () => void
}

export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Card className="border-destructive max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <TriangleAlert className="h-5 w-5" />
            页面出错
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error.message || "未知错误"}
          </p>
          {reset && (
            <Button variant="outline" size="sm" onClick={reset}>
              重试
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
