import { Link, useParams } from "@tanstack/react-router"
import { usePostQuery } from "@/hooks/posts"
import { CATEGORY_LABELS } from "@/types/post"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, Calendar, Tag } from "lucide-react"

function PostDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-3/4" />
      <div className="flex gap-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="space-y-2 mt-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  )
}

export default function PostDetailPage() {
  const { id } = useParams({ from: "/posts/$id" })
  const { data: post, isLoading, isError, error } = usePostQuery(id)

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Button asChild variant="ghost" size="sm" className="w-fit -ml-3">
        <Link to="/posts">
          <ChevronLeft className="h-4 w-4" />
          返回列表
        </Link>
      </Button>

      {/* Loading state */}
      {isLoading && <PostDetailSkeleton />}

      {/* Error state */}
      {isError && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">文章加载失败</CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : "未知错误"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link to="/posts">返回列表</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Post content */}
      {post && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">
                {CATEGORY_LABELS[post.category] ?? post.category}
              </Badge>
            </div>
            <CardTitle className="text-2xl">{post.title}</CardTitle>
            <CardDescription className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.createdAt).toLocaleDateString("zh-CN")}
              </span>
              <span className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                {CATEGORY_LABELS[post.category] ?? post.category}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{post.summary}</p>
            <hr />
            <div className="prose prose-sm max-w-none whitespace-pre-line">
              {post.content}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Query key indicator */}
      <div className="rounded-[var(--radius)] border bg-muted/50 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Query key: <code className="text-foreground">["posts", "detail", "{id}"]</code>
          &nbsp;&mdash;&nbsp;每篇文章独立缓存，返回列表时数据从缓存读取。
        </p>
      </div>
    </div>
  )
}
