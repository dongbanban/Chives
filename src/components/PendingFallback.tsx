import { Loader } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PendingFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader className="h-5 w-5 animate-spin" />
            加载中
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">正在准备页面内容...</p>
        </CardContent>
      </Card>
    </div>
  )
}
