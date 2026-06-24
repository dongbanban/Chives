Status: ready-for-agent

## Parent

[PRD](../PRD.md)

## What to build

为所有 Demo 页面和新增的错误/加载行为编写 route-level 集成测试。测试 seam 为：渲染完整 Router 上下文 + MSW mock，从用户视角操作页面并断言 DOM 输出。

覆盖场景：
- Dashboard 页面渲染、指标/时间切换、数据展示
- Form 页面渲染、表单填写、提交成功流程
- Settings 页面渲染、偏好修改持久化
- Posts 列表渲染和详情页路由导航
- ErrorBoundary fallback 渲染（页面内 throw）
- Router errorComponent fallback 渲染（MSW 返回 error）
- Router pendingComponent skeleton 渲染（loader pending）

## Acceptance criteria

- [ ] Dashboard 页面集成测试（含 search params 驱动数据拉取）
- [ ] Form 页面集成测试（含表单填写和提交流程）
- [ ] Settings 页面集成测试
- [ ] Posts 列表和详情页集成测试
- [ ] ErrorBoundary 行为测试（渲染时 throw → fallback）
- [ ] Router errorComponent 行为测试（loader error → fallback）
- [ ] Router pendingComponent 行为测试（loader pending → skeleton）
- [ ] 全量测试通过 `pnpm test run`

## Blocked by

- 01-error-handling-and-cleanup
- 02-dashboard-url-state
