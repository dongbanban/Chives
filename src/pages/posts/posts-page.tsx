import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { usePostsQuery } from "@/hooks/posts"
import { CATEGORY_LABELS } from "@/types/post"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react"

const PAGE_SIZE = 10

function PostsTableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  )
}

export default function PostsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, error } = usePostsQuery(page, PAGE_SIZE)

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Posts</h1>
        <p className="text-muted-foreground mt-1">
          TanStack Router file-based 路由 + TanStack Query 缓存/去重。
        </p>
      </div>

      {/* Error state */}
      {isError && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">数据加载失败</CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : "未知错误"}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Loading state */}
      {isLoading && <PostsTableSkeleton />}

      {/* Table */}
      {data && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>标题</TableHead>
                <TableHead className="w-20">分类</TableHead>
                <TableHead className="w-36">日期</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="text-muted-foreground">
                    {post.id}
                  </TableCell>
                  <TableCell>
                    <Link
                      to="/posts/$id"
                      params={{ id: post.id }}
                      className="font-medium hover:underline"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {post.summary}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {CATEGORY_LABELS[post.category] ?? post.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              共 {data.total} 篇文章，第 {data.page}/{totalPages} 页
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                下一页
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {data && data.total === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">暂无文章</p>
        </div>
      )}

      {/* Cache indicator */}
      <div className="rounded-[var(--radius)] border bg-muted/50 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Query key: <code className="text-foreground">["posts", "list", {page}, {PAGE_SIZE}]</code>
          &nbsp;&mdash;&nbsp;TanStack Query 缓存去重：同一页不重复请求。
        </p>
      </div>
    </div>
  )
}
