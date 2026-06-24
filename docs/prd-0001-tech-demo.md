# PRD: 前端技术融合 Demo 项目初始化

## Problem Statement

前端开发者在面对 Vite 8、React 19、TanStack Router/Query、Zustand、shadcn/ui、ECharts 等主流技术的组合使用时，缺乏一个可运行的参考项目来理解各技术的职责边界、协作方式和最佳实践。技术栈各自独立文档完善，但组合后的胶水层——状态管理分界、路由与数据加载的配合、组件与 mock 数据的衔接——往往是实际开发中最耗时的部分。

## Solution

构建一个技术游乐园风格的 Demo 项目。通过 4 个独立页面，每页围绕不同的技术组合设计交互场景，展示每种技术在真实协作中的行为和边界。项目本身不含业务领域，纯粹以技术演示为目的，代码即文档。

## User Stories

1. As a 前端开发者, I want 看到 TanStack Query + Router 在列表/详情页的完整写法, so that 我能理解 file-based 路由如何与数据加载 hook 配合
2. As a 前端开发者, I want 看到 Query mutation 与 shadcn Form 的协作方式, so that 我能理解乐观更新和表单提交流程
3. As a 前端开发者, I want 看到 Zustand + ECharts 在仪表盘页面的组合, so that 我能理解客户端状态如何驱动图表渲染
4. As a 前端开发者, I want 看到 Zustand persist 的实际用法, so that 我能理解 localStorage 持久化的接入方式
5. As a 前端开发者, I want 看到 MSW 如何 mock API 且不污染 Query 的缓存行为, so that 我能把这套 mock 模式移植到自己的项目
6. As a 前端开发者, I want 看到 shadcn/ui 组件在 Tailwind v4 + CSS 变量主题下的完整配置, so that 我能快速搭出视觉一致的项目骨架
7. As a 前端开发者, I want 看到 TypeScript 6 + React 19 的类型推导链路, so that 我能确认类型系统对新 API 的覆盖程度
8. As a 前端开发者, I want 看到 Vitest + React Testing Library 的基础配置和样例测试, so that 我能理解测试基础设施的搭建方式

## Implementation Decisions

### 技术栈

- 构建: Vite 8.1.0 + @vitejs/plugin-react 6.0.3
- 运行时: React 19.2.7 + react-dom 19.2.7
- 语言: TypeScript 6.0.3
- 路由: @tanstack/react-router 1.170.16 (File-based) + @tanstack/router-plugin + devtools
- 服务端状态: @tanstack/react-query 5.101.1 + devtools
- 客户端状态: Zustand 5.0.14 (多 store 模式)
- UI: shadcn/ui (CLI latest) + Tailwind CSS v4 + CSS 变量主题
- 图表: ECharts 6.1.0 + echarts-for-react 3.0.6
- Mock: MSW 2.14.6 (浏览器端)
- 测试: Vitest 4.1.9 + @testing-library/react 16.3.2 + jsdom 29.1.1
- 包管理: pnpm 10.28.1

### 状态管理分界

TanStack Query 持有所有 API 返回的服务端数据（缓存、去重、失效、乐观更新）。Zustand 持有纯前端状态（UI 开关、表单草稿、用户偏好）。两个 store 层不互相拷贝数据。

### 项目结构

单包项目。File-based 路由放在 src/routes/，页面级代码放在 src/pages/<name>/，全局共享代码放在 src/hooks/、src/api/、src/types/、src/utils/。MSW handlers 放在 src/mocks/。shadcn 组件在 src/components/ui/。

### Demo 页面

| 页面 | 路由 | 主角 | 配角 |
|---|---|---|---|
| 列表+详情 | /posts, /posts/$id | TanStack Router + Query | shadcn Table/Card/Badge/Skeleton |
| 表单 | /form-demo | Query mutation + shadcn Form | Zustand 草稿 |
| 仪表盘 | /dashboard | ECharts + Zustand | Query 数据聚合 |
| 设置 | /settings | Zustand persist | shadcn Toggle/Select/Switch |

### CSS 方案

Tailwind v4 CSS-first 配置。shadcn/ui 使用 CSS 变量定义主题色，不创建独立的 tailwind.config.ts。

### Mock 策略

MSW browser worker 在开发环境拦截 API 请求。每个 demo 页面对应一组 handler，返回符合 TypeScript 类型约束的 mock 数据。Query hooks 不感知 mock 层。

## Testing Decisions

- 框架: Vitest 4 + React Testing Library 16 + jsdom
- 策略: 只测外部行为，不测实现细节
- 优先: Zustand store 纯函数测试、Query hook 集成测试（配合 MSW）
- 不做: 完整页面 E2E、快照测试
- 目标: 搭建测试基础设施和 2-3 个样例测试

## Out of Scope

- 真实后端 API 对接、认证/授权、i18n、PWA、CI/CD、Dark Mode、E2E 测试、生产部署

## Further Notes

- 项目初始化使用 pnpm create vite 或手动搭建
- shadcn/ui 组件按需安装，不过早堆砌
- MSW 初始化使用 npx msw init 生成 service worker
- TanStack Router 使用 @tanstack/router-plugin Vite 插件
- 每个 demo 页面代码自包含在 pages/<name>/ 下
