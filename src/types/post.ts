
export interface Post {
  id: string
  title: string
  summary: string
  content: string
  category: Category
  createdAt: string
}

export interface PostListResponse {
  posts: Post[]
  total: number
  page: number
  pageSize: number
}

export const CATEGORIES = ["tech", "life", "design"] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_LABELS: Record<Category, string> = {
  tech: "技术",
  life: "生活",
  design: "设计",
}
