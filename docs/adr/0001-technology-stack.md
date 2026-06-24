# 技术栈选型

选定了 8 个核心依赖作为项目基础技术栈：Vite 8 / React 19 / TypeScript 6 / TanStack Router + Query / Zustand / shadcn/ui / ECharts + echarts-for-react / MSW。辅助工具统一采用 pnpm 11 + @vitejs/plugin-react 6。

## 状态管理分界

TanStack Query 管服务端状态（API 缓存、去重、失效），Zustand 管客户端状态（UI 开关、偏好、草稿）。两个 store 不互相拷贝数据。放弃 ahooks 是因为它的 `useRequest` 和 Query 的 `useQuery` 功能重叠且缓存模型不同，共存增加决策负担。

## 项目结构

单包、File-based 路由、按页面 + 全局共享拆目录。mock 层使用 MSW，在浏览器拦截 fetch，保持与真实 API 一致的网络层。

## Demo 页面

四个页面，每页突出不同技术组合：列表+详情（Query + Router）、表单（Query mutation + shadcn Form + Zustand 草稿）、仪表盘（ECharts + Zustand + Query 聚合）、设置/偏好（Zustand persist + shadcn）。

## 测试

测试框架采用 Vitest 4 + @testing-library/react 16 + jsdom 29。编写组件交互测试和 store 单元测试，展示前端自动化测试最佳实践。覆盖率工具使用 @vitest/coverage-v8。

## 样式方案

shadcn/ui 自带 Tailwind CSS v4，使用 CSS-first 配置和 CSS 变量主题系统，不创建独立的 tailwind.config.ts。
