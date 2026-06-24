Status: ready-for-agent

## Parent

[PRD](../PRD.md)

## What to build

将 Dashboard 页面的 `metric` 和 `timeRange` 从 Zustand store 迁移到 TanStack Router search params，实现 URL 驱动的数据拉取和服务端预取流程。

**关键行为变更**：用户切换指标或时间范围 → URL search params 更新 → Router 自动 rerun loader → loader 从 search params 读取参数（不再从 store 静态快照取值）→ 使用参数化的 query key 确保缓存正确 → 图表展示新数据。

页面组件通过 `useSearch()` 读取当前参数值，通过 `router.navigate{{ search }}` 写入。`useDashboardQuery` hook 改为显式接收参数而非内部订阅 store。原有的 `useDashboardStore` 文件删除。

## Acceptance criteria

- [ ] Dashboard 页面 URL 包含 `?metric=sales&timeRange=week` 形式的 search params
- [ ] 切换指标按钮后 URL search params 立即更新
- [ ] 切换时间范围下拉后 URL search params 立即更新
- [ ] Loader 从 search params 读取参数，而非调用 `useDashboardStore.getState()`
- [ ] Query key 随 search params 变化而变化，旧数据不被复用
- [ ] `useDashboardStore` 文件已删除
- [ ] 页面组件不再调用 `useDashboardStore`

## Blocked by

None - can start immediately
