## Parent

[代码质量基线补全](../PRD.md)

## What to build

建立统一 API 层：axios 实例作共享 HTTP 客户端，每个资源模块（posts、dashboard）导出纯请求函数。hooks 层改为调用 API 函数并包装 TanStack Query，同时提取可复用的 queryOptions 工厂供后续 loader 使用。

改动的端到端效果：Posts 列表/详情、Dashboard 三个 Demo 页面数据请求路径从"hooks 内 inline fetch"变为"组件 → hook(useQuery) → queryOptions → API 函数 → axios(Mocked by MSW)"。用户感知行为不变。

### 请求函数接口约定

- `fetchPosts(page, pageSize): Promise<PostListResponse>`
- `fetchPost(id): Promise<Post>`
- `fetchDashboardData(metric, timeRange): Promise<DashboardResponse>`

每个函数通过 axios 实例发请求，统一错误映射为 Error thrown。

### queryOptions 工厂接口约定

- `postListQueryOptions(page, pageSize)` — 返回 queryKey + queryFn + staleTime
- `postDetailQueryOptions(id)` — 同上
- `dashboardQueryOptions(metric, timeRange)` — 同上

hook 调用 `useQuery(queryOptions(...))`，外部（loader）调用 `queryClient.ensureQueryData(queryOptions(...))`。

## Acceptance criteria

- [ ] `pnpm add axios` 完成，axios 版本写入 package.json
- [ ] `api/http-client.ts` 导出共享 axios 实例，含 baseURL 和统一错误响应拦截器
- [ ] `api/posts.ts` 导出 fetchPosts / fetchPost，使用 http-client
- [ ] `api/dashboard.ts` 导出 fetchDashboardData，使用 http-client
- [ ] `hooks/posts.ts` 删除 inline fetch，改用 API 函数，并导出 postListQueryOptions / postDetailQueryOptions
- [ ] `hooks/dashboard.ts` 删除 inline fetch，改用 API 函数，并导出 dashboardQueryOptions
- [ ] Posts 列表页正常渲染，翻页功能正常
- [ ] Posts 详情页正常渲染，id 参数正确传递
- [ ] Dashboard 正常渲染，metric / timeRange 切换正常
- [ ] 三个 Demo 页面无控制台 error
- [ ] `tsc --noEmit` 通过
- [ ] `vitest run` 通过（若已有测试）

## Blocked by

None — can start immediately
