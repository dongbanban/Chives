Status: ready-for-agent

## Parent

[PRD](../PRD.md)

## What to build

为项目建立双层错误边界体系，同时清理脚手架残留和 form-draft 代码重复。

**错误处理**：在 `__root.tsx` 配置 TanStack Router 的 `defaultErrorComponent` / `defaultPendingComponent` 作为路由层兜底，并用 React ErrorBoundary 包裹 `<Outlet />` 捕获渲染时 JS 运行时错误。两层的 fallback UI 共用同一套基础组件（card + 图标 + 文字），后续可按需分化。

**代码卫生**：移除 `__root.tsx` 顶部 `@file` / `@author` HTML 注释；`form-draft.ts` 中 `clearDraft` 改为 `set({ ...initialState })` 复用初始化对象。

## Acceptance criteria

- [ ] `__root.tsx` 无 HTML 注释
- [ ] Router 配置了 `defaultErrorComponent` 和 `defaultPendingComponent`
- [ ] Loader 失败时显示 error fallback UI 而非白屏
- [ ] Loader pending 时显示 loading fallback UI 而非空白
- [ ] 页面组件内部 JS 运行时错误被 React ErrorBoundary 捕获，显示 fallback UI
- [ ] `form-draft.ts` 的 `clearDraft` 使用 `initialState` 展开，无手写字段默认值

## Blocked by

None - can start immediately
