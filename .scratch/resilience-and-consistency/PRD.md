Status: ready-for-agent

## Problem Statement

各 Demo 页面存在 6 个代码质量缺陷，影响运行时稳定性、URL 状态可分享性、代码一致性和测试信心：

1. `__root.tsx` 顶部残留 `@file` / `@author` HTML 注释，属于脚手架生成噪声。
2. 未配置 ErrorBoundary 或 Suspense。TanStack Query 的 API 错误靠组件内 `isError` 处理，但 JS 运行时错误（如组件内 `TypeError`）会导致页面白屏崩溃。TanStack Router 提供的 `errorComponent` / `pendingComponent` 也未启用，loader 失败后无用户可见提示。
3. Dashboard 页面的 metric 和 timeRange 切换逻辑依赖 Zustand store 静态快照，用户切换参数后 loader 不自动重新 prefetch，需依赖客户端 query 补救。loader 应响应 search params 而非 store 状态。
4. `form-draft.ts` 中 `clearDraft` 手写了与 `initialState` 重复的默认值 `{ title: "", category: "", description: "" }`，字段增减时容易遗漏，应复用 `initialState`。
5. Dashboard 页面分 4 次独立调用 `useDashboardStore` selector，虽然 setter 为稳定引用不触发 re-render，但 metric/timeRange 迁移到 URL 后 store 即变为空壳，自然消除此问题。
6. 测试覆盖仅限 hooks 和 stores。页面组件、路由 loader、表单提交流程无测试。MSW handler 已就绪，集成测试成本低但未利用。

## Solution

从错误韧性、URL 驱动状态、代码一致性和测试完整性四个维度，系统性地补全 Demo 页面的代码质量基线。不引入新技术栈依赖，不新增 Demo 页面，不更换已有页面主角。

## User Stories

1. 作为一个浏览 Demo 页面的访问者，我希望 JS 运行时错误显示可理解的错误提示而非白屏，以便我知道发生了什么并可以刷新或返回。
2. 作为一个浏览 Demo 页面的访问者，我希望路由加载期间看到加载骨架而非空白，以便我知道页面正在准备内容。
3. 作为一个浏览 Dashboard 页面并切换指标的访问者，我希望每次切换后 URL 同步更新，以便我可以收藏或分享当前的指标视图。
4. 作为一个浏览 Dashboard 页面并切换指标的访问者，我希望每次切换后图表数据立即根据 URL 参数重新拉取，以便我看到新指标的正确数据而非旧数据缓存。
5. 作为一个前端开发者，我希望 `clearDraft` 的实现复用 `initialState` 而非手写默认值，以便新增表单字段时只需修改 `initialState` 一处，`clearDraft` 自动跟随。
6. 作为一个前端开发者，我希望 Dashboard 的 metric/timeRange 状态存在 URL 而非 Zustand store，以便状态管理职责清晰：URL 管可分享参数，store 管纯客户端状态。
7. 作为一个前端开发者，我希望每个 Demo 页面有集成测试覆盖渲染、交互和提交流程，以便重构时有信心不破坏现有功能。
8. 作为一个前端开发者，我希望路由 loader 的错误有可观察的用户界面，以便非预期错误能被暴露而非静默吞掉。

## Implementation Decisions

### 错误处理双层架构

采用两层错误边界：
- **路由层**: TanStack Router 的 `errorComponent`（兜 loader 错误 / 路由级异常）和 `pendingComponent`（兜 loader pending 状态）。系统级配置在 root route 的 `defaultErrorComponent` / `defaultPendingComponent`，单条路由可按需覆盖。
- **渲染层**: React ErrorBoundary 包裹 `<Outlet />` 于 `__root.tsx`，兜组件渲染时的 JS 运行时错误。
- 两层的 fallback 组件初期共用同一套基础 UI（card + 图标 + 文字）。

### Dashboard 状态迁入 URL

- `metric` 和 `timeRange` 从 Zustand store 移除，改为 TanStack Router search params。
- 页面组件通过 `useSearch()` 读取当前值，通过 `router.navigate({ search })` 写入。
- Loader 从 search params 读取参数而非 `useDashboardStore.getState()`，切换参数后 Router 自动 rerun loader。
- `useDashboardQuery` hook 改为接收参数而非内部订阅 store。
- `useDashboardStore` 文件删除（store 仅含 `metric`/`timeRange`，移除后无剩余字段）。

### form-draft clearDraft 去重

- `clearDraft` 实现从 `set({ title: "", category: "", description: "" })` 改为 `set({ ...initialState })`。
- `initialState` 保持模块内私有，不对外导出。

### useShallow 优化

- 不再需要。Dashboard store 删除后，不存在多 selector 订阅场景。

### __root.tsx 清理

- 移除 `@file` / `@author` HTML 注释。

## Testing Decisions

### 测试策略

只测试外部可观察行为，不测试实现细节。判断标准：改变实现方式（换库、重构内部逻辑）后，如外部行为一致，测试不应失败。

### 测试 seam

采用单一高 seam：**Route-level 集成测试**。渲染完整 Router 上下文 + MSW mock，操作页面，断言 DOM 输出和网络行为。此 seam 覆盖以下全部场景：

- 页面组件渲染（dashboard / form / settings / posts 列表+详情）
- 路由 loader 行为（不同 search params 拉取不同数据）
- Form 表单填写并提交（断言 MSW handler 收到正确 payload）
- Error handling（MSW 返回 error → 断言 error UI 渲染）
- ErrorBoundary（页面组件内 throw → 断言 fallback UI 渲染）
- Suspense / pendingComponent（loader pending → 断言 loading skeleton 渲染）

### 新增测试文件

- Dashboard 页面集成测试
- Form 页面集成测试（含提交流程）
- Settings 页面集成测试
- Posts 列表+详情集成测试
- ErrorBoundary 行为测试
- Suspense / pendingComponent 行为测试

### 先例

`tests/hooks/posts.test.tsx` 已使用 `@testing-library/react` + MSW 进行 hook 级测试。新测试延伸至完整的 route 渲染上下文。

## Out of Scope

- 不引入新的错误监控/上报系统
- 不对错误 UI 和加载 UI 做精细的按页面定制（初期共用基础 fallback）
- 不调整测试框架选型（继续 Vitest + @testing-library/react + MSW）
- 不修改 ADR 0001 的技术栈选型决策

## Further Notes

- 此次改进不改变任何 Demo 页面的功能行为，仅增强错误韧性、状态一致性、代码 DRY 度和测试覆盖率。
- 测试在逻辑改动全部完成后统一编写，避免断言跟随代码变动反复修改。
