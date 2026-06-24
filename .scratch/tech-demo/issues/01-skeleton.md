# 项目骨架搭建

## Parent

PRD: 前端技术融合 Demo 项目初始化 (../PRD.md)

## What to build

初始化整个项目的基础设施：Vite 8 + React 19 + TypeScript 6 工程骨架，集成 TanStack Router（file-based）、TanStack Query、Tailwind v4 + shadcn/ui 主题、MSW browser mock 层。搭建约定的目录结构，确保 dev server 可启动、路由可跳转、MSW 可拦截请求。

## Acceptance criteria

- [ ] `pnpm dev` 启动 Vite dev server，页面正常渲染
- [ ] TanStack Router file-based 路由生效，`/` 返回首页占位内容
- [ ] TanStack Query Devtools 在开发环境可见
- [ ] shadcn/ui Button 组件可正常渲染，Tailwind v4 + CSS 变量主题生效
- [ ] MSW browser worker 初始化完成，开发环境拦截 API 请求
- [ ] 目录结构符合约定（routes/ pages/ components/ui/ hooks/ api/ stores/ types/ utils/ mocks/）
- [ ] TypeScript 编译无错误

## Blocked by

None - can start immediately
