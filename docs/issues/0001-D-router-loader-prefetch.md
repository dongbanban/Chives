## Parent

[代码质量基线补全](/Users/i104/Chives/docs/prd/0001-codebase-polish.md)

## What to build

在 TanStack Router 中为 `/posts/`、`/posts/$id`、`/dashboard` 三个有数据依赖的路由增加 loader 预取。loader 通过 routerContext 获取 queryClient，调用 `ensureQueryData(queryOptions(...))` 提前填充缓存，组件挂载时第一条渲染就没有加载态。

端到端效果：用户在 Posts 列表、帖子详情、Dashboard 页面间导航，进入页面第一帧即显示数据，无空白 skeleton 闪烁。

### 架构前提

- `queryClient` 通过 TanStack Router 的 `routerContext` 注入，loader 通过 `context.queryClient` 访问
- `queryOptions` 工厂函数已在 [Slice A] 产出，loader 复用之
- 三个路由的 loader 签名：
  - `/posts/` — `loader({ context })` 调 `context.queryClient.ensureQueryData(postListQueryOptions(1, 10))`
  - `/posts/$id` — `loader({ params, context })` 调 `context.queryClient.ensureQueryData(postDetailQueryOptions(params.id))`
  - `/dashboard` — `loader({ context })` 调 `context.queryClient.ensureQueryData(dashboardQueryOptions("sales", "week"))`（默认值）

## Acceptance criteria

- [ ] Router 创建时注入 queryClient 到 routerContext
- [ ] `/posts/` 路由定义含 loader，首次导航缓存已预热
- [ ] `/posts/$id` 路由定义含 loader，URL 参数 id 正确传递
- [ ] `/dashboard` 路由定义含 loader，默认 metric=「销售额」timeRange=「本周」
- [ ] 导航到上述页面首帧不出现 loading skeleton
- [ ] 重复导航到同一路由不触发新 MSW 请求（缓存命中）
- [ ] `tsc --noEmit` 通过
- [ ] `vitest run` 通过

## Blocked by

- Slice A — 需要 API 层产出的 queryOptions 工厂
