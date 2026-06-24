import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { usePostsQuery, usePostQuery } from '../posts'
import type { Post, PostListResponse } from '@/types/post'

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Test Post 1',
    summary: 'Summary 1',
    content: 'Content 1',
    category: 'tech',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Test Post 2',
    summary: 'Summary 2',
    content: 'Content 2',
    category: 'life',
    createdAt: '2025-01-02T00:00:00.000Z',
  },
]

const server = setupServer(
  http.get('/api/posts', () =>
    HttpResponse.json<PostListResponse>({
      posts: MOCK_POSTS,
      total: 2,
      page: 1,
      pageSize: 10,
    })
  ),
  http.get('/api/posts/:id', ({ params }) => {
    const post = MOCK_POSTS.find((p) => p.id === params.id)
    if (!post) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    return HttpResponse.json(post)
  })
)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('usePostsQuery', () => {
  it('starts in loading state then resolves with data', async () => {
    const { result } = renderHook(() => usePostsQuery(1, 10), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.posts).toHaveLength(2)
    expect(result.current.data?.total).toBe(2)
    expect(result.current.data?.posts[0].title).toBe('Test Post 1')
  })

  it('returns error state on server failure', async () => {
    server.use(
      http.get('/api/posts', () =>
        HttpResponse.json({ error: 'Server error' }, { status: 500 })
      )
    )

    const { result } = renderHook(() => usePostsQuery(2, 10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
  })
})

describe('usePostQuery', () => {
  it('fetches a single post by id', async () => {
    const { result } = renderHook(() => usePostQuery('1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.id).toBe('1')
    expect(result.current.data?.title).toBe('Test Post 1')
    expect(result.current.data?.category).toBe('tech')
  })

  it('returns error for non-existent post', async () => {
    const { result } = renderHook(() => usePostQuery('999'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })

  it('does not fetch when id is empty', () => {
    const { result } = renderHook(() => usePostQuery(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.fetchStatus).toBe('idle')
  })
})
