export interface Post {
  id: string
  title: string
  summary: string
  content: string
  category: string
  createdAt: string
}

export interface PostListResponse {
  posts: Post[]
  total: number
  page: number
  pageSize: number
}

export const CATEGORY_LABELS: Record<string, string> = {
  tech: "技术",
  life: "生活",
  design: "设计",
}
