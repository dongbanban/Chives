## Parent

[代码质量基线补全](../PRD.md)

## What to build

将 Dashboard mock handler 中 `generateMockData` 的 `Math.random()` 替换为硬编码 fixture 数据。每个 (metric, timeRange) 组合返回固定的 data 数组，消除随机性，使 TanStack Query 缓存行为可验证。

端到端效果：用户多次切换 metric（sales/orders）和 timeRange（week/month/quarter），同一组合始终显示相同数值。Query DevTools 或 Network 面板可见同一 queryKey 不重复发请求。

### Fixture 数量

2 metric × 3 timeRange = 6 组，每组数据点数量与当前逻辑一致：week → 7 点，month → 4 点，quarter → 3 点。

## Acceptance criteria

- [ ] `generateMockData` 不再调用 `Math.random()`
- [ ] 6 组 fixture 均为硬编码数值数组
- [ ] Dashboard 页面切换 metric → 再切回原 metric，数据显示一致（不闪变）
- [ ] Dashboard 页面切换 timeRange → 再切回原 timeRange，数据显示一致
- [ ] 同一 queryKey 第二次渲染时不触发 MSW handler（缓存生效）
- [ ] `vitest run` 通过

## Blocked by

None — can start immediately
